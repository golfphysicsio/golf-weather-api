"""
Trajectory Router

Endpoints for calculating golf ball trajectory with weather effects.
Supports both imperial and metric units (dual-unit responses).
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.models.requests import (
    TrajectoryRequest,
    TrajectoryLocationRequest,
    TrajectoryCourseRequest,
    WeatherConditions,
    CalculateRequest,
    ConditionsOverride,
)
from app.models.responses import (
    TrajectoryResponse,
    AdjustedResults,
    ImpactBreakdown,
    TrajectoryPoint,
    ConditionsUsed,
    DualTrajectoryResponse,
    DualAdjustedResults,
    DualImpactBreakdown,
    DualConditionsUsed,
    DualTrajectoryPoint,
    DualDistance,
    DualSpeed,
    DualTemperature,
    DualAltitude,
    DualPressure,
)
from app.models.requests import ShotData
from app.services.physics import calculate_impact_breakdown
from app.services.weather import fetch_weather_by_city, fetch_weather_by_coords
from app.services.courses import get_course_location
from app.utils.conversions import (
    UnitConverter,
    validate_units_param,
)


router = APIRouter()


def build_dual_distance(yards: float) -> DualDistance:
    """Create dual-unit distance from yards."""
    return DualDistance(
        yards=round(yards, 1),
        meters=UnitConverter.yards_to_meters(yards),
    )


def build_trajectory_response(
    physics_result: dict, conditions_used: ConditionsUsed = None
) -> TrajectoryResponse:
    """Build a TrajectoryResponse from physics calculation results (legacy single-unit)."""
    baseline = physics_result["baseline"]
    adjusted = physics_result["adjusted"]
    breakdown = physics_result["impact_breakdown"]

    return TrajectoryResponse(
        adjusted=AdjustedResults(
            carry_yards=adjusted["carry_yards"],
            total_yards=adjusted["total_yards"],
            lateral_drift_yards=adjusted["lateral_drift_yards"],
            apex_height_yards=adjusted["apex_height_yards"],
            flight_time_seconds=adjusted["flight_time_seconds"],
            landing_angle_deg=adjusted["landing_angle_deg"],
        ),
        baseline=AdjustedResults(
            carry_yards=baseline["carry_yards"],
            total_yards=baseline["total_yards"],
            lateral_drift_yards=baseline["lateral_drift_yards"],
            apex_height_yards=baseline["apex_height_yards"],
            flight_time_seconds=baseline["flight_time_seconds"],
            landing_angle_deg=baseline["landing_angle_deg"],
        ),
        impact_breakdown=ImpactBreakdown(
            wind_effect_yards=breakdown["wind_effect_yards"],
            wind_lateral_yards=breakdown["wind_lateral_yards"],
            temperature_effect_yards=breakdown["temperature_effect_yards"],
            altitude_effect_yards=breakdown["altitude_effect_yards"],
            humidity_effect_yards=breakdown["humidity_effect_yards"],
            total_adjustment_yards=breakdown["total_adjustment_yards"],
        ),
        equivalent_calm_distance_yards=physics_result["equivalent_calm_distance_yards"],
        trajectory_points=[
            TrajectoryPoint(x=p["x"], y=p["y"], z=p["z"])
            for p in adjusted["trajectory_points"]
        ],
        conditions_used=conditions_used,
    )


def build_dual_trajectory_response(
    physics_result: dict,
    conditions_used: DualConditionsUsed = None,
    units_preference: str = "imperial",
) -> DualTrajectoryResponse:
    """Build a DualTrajectoryResponse from physics calculation results."""
    baseline = physics_result["baseline"]
    adjusted = physics_result["adjusted"]
    breakdown = physics_result["impact_breakdown"]

    return DualTrajectoryResponse(
        adjusted=DualAdjustedResults(
            carry=build_dual_distance(adjusted["carry_yards"]),
            total=build_dual_distance(adjusted["total_yards"]),
            lateral_drift=build_dual_distance(adjusted["lateral_drift_yards"]),
            apex_height=build_dual_distance(adjusted["apex_height_yards"]),
            flight_time_seconds=adjusted["flight_time_seconds"],
            landing_angle_deg=adjusted["landing_angle_deg"],
        ),
        baseline=DualAdjustedResults(
            carry=build_dual_distance(baseline["carry_yards"]),
            total=build_dual_distance(baseline["total_yards"]),
            lateral_drift=build_dual_distance(baseline["lateral_drift_yards"]),
            apex_height=build_dual_distance(baseline["apex_height_yards"]),
            flight_time_seconds=baseline["flight_time_seconds"],
            landing_angle_deg=baseline["landing_angle_deg"],
        ),
        impact_breakdown=DualImpactBreakdown(
            wind_effect=build_dual_distance(breakdown["wind_effect_yards"]),
            wind_lateral=build_dual_distance(breakdown["wind_lateral_yards"]),
            temperature_effect=build_dual_distance(breakdown["temperature_effect_yards"]),
            altitude_effect=build_dual_distance(breakdown["altitude_effect_yards"]),
            humidity_effect=build_dual_distance(breakdown["humidity_effect_yards"]),
            total_adjustment=build_dual_distance(breakdown["total_adjustment_yards"]),
        ),
        equivalent_calm_distance=build_dual_distance(physics_result["equivalent_calm_distance_yards"]),
        trajectory_points=[
            DualTrajectoryPoint(
                x=build_dual_distance(p["x"]),
                y=build_dual_distance(p["y"]),
                z=build_dual_distance(p["z"]),
            )
            for p in adjusted["trajectory_points"]
        ],
        conditions_used=conditions_used,
        units_preference=units_preference,
    )


def build_dual_conditions_used(weather: dict) -> DualConditionsUsed:
    """Build dual-unit conditions used from weather data."""
    return DualConditionsUsed(
        location=weather["location"],
        wind_speed=DualSpeed(
            mph=round(weather["wind_speed_mph"], 1),
            kmh=UnitConverter.mph_to_kmh(weather["wind_speed_mph"]),
        ),
        wind_direction_deg=weather["wind_direction_deg"],
        temperature=DualTemperature(
            fahrenheit=round(weather["temperature_f"], 1),
            celsius=UnitConverter.fahrenheit_to_celsius(weather["temperature_f"]),
        ),
        altitude=DualAltitude(
            feet=round(weather["altitude_ft"], 0),
            meters=round(UnitConverter.feet_to_meters(weather["altitude_ft"]), 0),
        ),
        humidity_pct=weather["humidity_pct"],
        pressure=DualPressure(
            inhg=round(weather["pressure_inhg"], 2),
            hpa=UnitConverter.inhg_to_hpa(weather["pressure_inhg"]),
        ),
        conditions_text=weather["conditions_text"],
        fetched_at=weather["fetched_at"],
    )


@router.post("/trajectory", response_model=DualTrajectoryResponse)
async def calculate_trajectory(
    request: TrajectoryRequest,
    units: Optional[str] = Query(
        default="imperial",
        description="Preferred unit system: 'imperial' or 'metric'. Response includes both.",
    ),
) -> DualTrajectoryResponse:
    """
    Calculate golf ball trajectory with manually provided weather conditions.

    This endpoint performs physics calculations to determine how weather
    conditions affect golf ball flight, including:
    - Wind effects (headwind/tailwind and crosswind)
    - Air density effects from temperature, altitude, humidity, and pressure
    - Spin effects (backspin lift and sidespin curve)

    **Unit Support:**
    - Accepts `units` parameter: 'imperial' (default) or 'metric'
    - Response always includes BOTH unit systems (yards/meters, mph/km/h, etc.)
    - `units_preference` in response indicates client's stated preference

    Returns adjusted trajectory, baseline comparison, and impact breakdown.
    """
    # Validate units parameter
    try:
        validated_units = validate_units_param(units)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = calculate_impact_breakdown(request.shot, request.conditions)
    return build_dual_trajectory_response(result, units_preference=validated_units)


@router.post("/trajectory/location", response_model=DualTrajectoryResponse)
async def calculate_trajectory_by_location(
    request: TrajectoryLocationRequest,
    units: Optional[str] = Query(
        default="imperial",
        description="Preferred unit system: 'imperial' or 'metric'. Response includes both.",
    ),
) -> DualTrajectoryResponse:
    """
    Calculate golf ball trajectory with weather fetched by city location.

    Automatically fetches current weather conditions for the specified city
    and calculates the trajectory with those conditions.

    **Unit Support:**
    - Accepts `units` parameter: 'imperial' (default) or 'metric'
    - Response always includes BOTH unit systems (yards/meters, mph/km/h, etc.)
    - `units_preference` in response indicates client's stated preference
    """
    # Validate units parameter
    try:
        validated_units = validate_units_param(units)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        weather = await fetch_weather_by_city(
            city=request.location.city,
            state=request.location.state,
            country=request.location.country,
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch weather data: {str(e)}",
        )

    # Build conditions from weather data
    conditions = WeatherConditions(
        wind_speed_mph=weather["wind_speed_mph"],
        wind_direction_deg=weather["wind_direction_deg"],
        temperature_f=weather["temperature_f"],
        altitude_ft=weather["altitude_ft"],
        humidity_pct=weather["humidity_pct"],
        pressure_inhg=weather["pressure_inhg"],
    )

    result = calculate_impact_breakdown(request.shot, conditions)
    dual_conditions = build_dual_conditions_used(weather)

    return build_dual_trajectory_response(result, dual_conditions, validated_units)


@router.post("/trajectory/course", response_model=DualTrajectoryResponse)
async def calculate_trajectory_by_course(
    request: TrajectoryCourseRequest,
    units: Optional[str] = Query(
        default="imperial",
        description="Preferred unit system: 'imperial' or 'metric'. Response includes both.",
    ),
) -> DualTrajectoryResponse:
    """
    Calculate golf ball trajectory with weather fetched by golf course name.

    Looks up the course location and fetches current weather conditions
    for that location.

    **Unit Support:**
    - Accepts `units` parameter: 'imperial' (default) or 'metric'
    - Response always includes BOTH unit systems (yards/meters, mph/km/h, etc.)
    - `units_preference` in response indicates client's stated preference
    """
    # Validate units parameter
    try:
        validated_units = validate_units_param(units)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Look up course
    course_data = get_course_location(request.course.name)
    if not course_data:
        raise HTTPException(
            status_code=404,
            detail=f"Course '{request.course.name}' not found. "
            "Try a well-known course name like 'TPC Scottsdale' or 'Pebble Beach'.",
        )

    try:
        weather = await fetch_weather_by_city(
            city=course_data["city"],
            state=course_data["state"],
            country=course_data["country"],
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch weather data: {str(e)}",
        )

    # Use course's known altitude if available (more accurate than city lookup)
    altitude_ft = course_data.get("altitude_ft", weather["altitude_ft"])

    # Build conditions from weather data
    conditions = WeatherConditions(
        wind_speed_mph=weather["wind_speed_mph"],
        wind_direction_deg=weather["wind_direction_deg"],
        temperature_f=weather["temperature_f"],
        altitude_ft=altitude_ft,
        humidity_pct=weather["humidity_pct"],
        pressure_inhg=weather["pressure_inhg"],
    )

    result = calculate_impact_breakdown(request.shot, conditions)

    # Update weather dict with course altitude before building dual conditions
    weather_with_altitude = weather.copy()
    weather_with_altitude["altitude_ft"] = altitude_ft
    dual_conditions = build_dual_conditions_used(weather_with_altitude)

    return build_dual_trajectory_response(result, dual_conditions, validated_units)


@router.post("/calculate", response_model=DualTrajectoryResponse)
async def calculate_trajectory_professional(
    request: CalculateRequest,
    units: Optional[str] = Query(
        default="imperial",
        description="Preferred unit system: 'imperial' or 'metric'. Response includes both.",
    ),
) -> DualTrajectoryResponse:
    """
    Professional trajectory calculation endpoint.

    Calculates golf ball trajectory with either:
    - **Real weather** from GPS coordinates (`location` with lat/lng)
    - **Custom conditions** via `conditions_override`

    **Priority:** If `conditions_override` is provided, it takes precedence over `location`.

    **Example with location (real weather):**
    ```json
    {
      "ball_speed": 165,
      "launch_angle": 12.5,
      "spin_rate": 2800,
      "location": {"lat": 33.45, "lng": -112.07}
    }
    ```

    **Example with conditions_override:**
    ```json
    {
      "ball_speed": 165,
      "launch_angle": 12.5,
      "spin_rate": 2800,
      "conditions_override": {
        "wind_speed": 30,
        "wind_direction": 180,
        "temperature": 85,
        "humidity": 60,
        "altitude": 5000,
        "air_pressure": 29.0
      }
    }
    ```

    **Response includes:**
    - `conditions_used.source`: "override" or "real"
    - All trajectory data in both imperial and metric units
    """
    # Validate units parameter
    try:
        validated_units = validate_units_param(units)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Build shot data from flat parameters
    shot = ShotData(
        ball_speed_mph=request.ball_speed,
        launch_angle_deg=request.launch_angle,
        spin_rate_rpm=request.spin_rate,
        spin_axis_deg=request.spin_axis,
        direction_deg=request.direction,
    )

    # Determine weather conditions
    if request.conditions_override:
        # Use custom override conditions
        override = request.conditions_override
        conditions = WeatherConditions(
            wind_speed_mph=override.wind_speed,
            wind_direction_deg=override.wind_direction,
            temperature_f=override.temperature,
            altitude_ft=override.altitude,
            humidity_pct=override.humidity,
            pressure_inhg=override.air_pressure,
        )

        # Calculate trajectory
        result = calculate_impact_breakdown(shot, conditions)

        # Build conditions_used with source = "override"
        from datetime import datetime
        dual_conditions = DualConditionsUsed(
            source="override",
            location=None,
            wind_speed=DualSpeed(
                mph=round(override.wind_speed, 1),
                kmh=UnitConverter.mph_to_kmh(override.wind_speed),
            ),
            wind_direction_deg=override.wind_direction,
            temperature=DualTemperature(
                fahrenheit=round(override.temperature, 1),
                celsius=UnitConverter.fahrenheit_to_celsius(override.temperature),
            ),
            altitude=DualAltitude(
                feet=round(override.altitude, 0),
                meters=round(UnitConverter.feet_to_meters(override.altitude), 0),
            ),
            humidity_pct=override.humidity,
            pressure=DualPressure(
                inhg=round(override.air_pressure, 2),
                hpa=UnitConverter.inhg_to_hpa(override.air_pressure),
            ),
            conditions_text="Custom conditions",
            fetched_at=datetime.utcnow(),
        )

        return build_dual_trajectory_response(result, dual_conditions, validated_units)

    elif request.location:
        # Fetch real weather from coordinates
        try:
            weather = await fetch_weather_by_coords(
                lat=request.location.lat,
                lon=request.location.lng,
            )
        except ValueError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail=f"Failed to fetch weather data: {str(e)}",
            )

        # Build conditions from weather data
        conditions = WeatherConditions(
            wind_speed_mph=weather["wind_speed_mph"],
            wind_direction_deg=weather["wind_direction_deg"],
            temperature_f=weather["temperature_f"],
            altitude_ft=weather["altitude_ft"],
            humidity_pct=weather["humidity_pct"],
            pressure_inhg=weather["pressure_inhg"],
        )

        # Calculate trajectory
        result = calculate_impact_breakdown(shot, conditions)

        # Build conditions_used with source = "real"
        dual_conditions = DualConditionsUsed(
            source="real",
            location=weather["location"],
            wind_speed=DualSpeed(
                mph=round(weather["wind_speed_mph"], 1),
                kmh=UnitConverter.mph_to_kmh(weather["wind_speed_mph"]),
            ),
            wind_direction_deg=weather["wind_direction_deg"],
            temperature=DualTemperature(
                fahrenheit=round(weather["temperature_f"], 1),
                celsius=UnitConverter.fahrenheit_to_celsius(weather["temperature_f"]),
            ),
            altitude=DualAltitude(
                feet=round(weather["altitude_ft"], 0),
                meters=round(UnitConverter.feet_to_meters(weather["altitude_ft"]), 0),
            ),
            humidity_pct=weather["humidity_pct"],
            pressure=DualPressure(
                inhg=round(weather["pressure_inhg"], 2),
                hpa=UnitConverter.inhg_to_hpa(weather["pressure_inhg"]),
            ),
            conditions_text=weather.get("conditions_text"),
            fetched_at=weather.get("fetched_at"),
        )

        return build_dual_trajectory_response(result, dual_conditions, validated_units)

    else:
        # This shouldn't happen due to validation, but handle it anyway
        raise HTTPException(
            status_code=400,
            detail="Either location or conditions_override required"
        )
