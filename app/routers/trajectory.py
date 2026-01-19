"""
Trajectory Router

Endpoints for calculating golf ball trajectory with weather effects.
Supports both imperial and metric units (dual-unit responses).
Includes enterprise integration features for launch monitor platforms.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime
import uuid

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
    EnterpriseTrajectoryResponse,
    EnterpriseConditions,
    EnterpriseTrajectory,
    EnterpriseAnalysis,
    EnterpriseEffects,
    EnterpriseRecommendations,
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


# ============================================================================
# ENTERPRISE HELPER FUNCTIONS
# ============================================================================


def is_headwind(wind_direction: float) -> bool:
    """Check if wind direction indicates headwind (roughly 315-45 degrees)."""
    return wind_direction <= 45 or wind_direction >= 315


def is_tailwind(wind_direction: float) -> bool:
    """Check if wind direction indicates tailwind (roughly 135-225 degrees)."""
    return 135 <= wind_direction <= 225


def generate_insights(
    wind_speed: float,
    wind_direction: float,
    temperature: float,
    humidity: float,
    altitude: float,
    effects: dict
) -> List[str]:
    """Generate human-readable insights about shot conditions."""
    insights = []

    # Wind insights
    wind_effect = effects.get("wind_effect_yards", 0)
    if abs(wind_effect) > 2:
        if is_headwind(wind_direction):
            direction_text = "headwind"
        elif is_tailwind(wind_direction):
            direction_text = "tailwind"
        else:
            direction_text = "crosswind"

        action = "reducing" if wind_effect < 0 else "adding"
        insights.append(
            f"{abs(wind_speed):.0f}mph {direction_text} {action} {abs(wind_effect):.0f} yards"
        )

    # Temperature insights
    temp_effect = effects.get("temperature_effect_yards", 0)
    if abs(temp_effect) > 1:
        temp_desc = "Cool" if temp_effect < 0 else "Warm"
        action = "costing" if temp_effect < 0 else "adding"
        insights.append(
            f"{temp_desc} temperature ({temperature:.0f}°F) {action} {abs(temp_effect):.0f} yards"
        )

    # Humidity insights
    humidity_effect = effects.get("humidity_effect_yards", 0)
    if abs(humidity_effect) > 1:
        humidity_desc = "High" if humidity > 60 else "Low"
        action = "reducing" if humidity_effect < 0 else "adding"
        insights.append(
            f"{humidity_desc} humidity ({humidity:.0f}%) {action} {abs(humidity_effect):.0f} yards"
        )

    # Altitude insights
    altitude_effect = effects.get("altitude_effect_yards", 0)
    if abs(altitude_effect) > 2:
        insights.append(
            f"Altitude ({altitude:.0f}ft) adding {abs(altitude_effect):.0f} yards"
        )

    # Overall assessment
    if len(insights) == 0:
        insights.append("Near-ideal conditions - minimal environmental impact")

    return insights


def suggest_club_adjustment(total_adjustment: float) -> Optional[str]:
    """Suggest club change if significant adjustment needed."""
    if abs(total_adjustment) < 5:
        return None  # No suggestion needed

    if total_adjustment < -10:
        return f"Consider clubbing up (1-2 clubs) to account for {abs(total_adjustment):.0f}-yard loss"
    elif total_adjustment > 10:
        return f"Consider clubbing down - conditions adding {total_adjustment:.0f} yards"
    elif total_adjustment < -5:
        return f"Consider clubbing up one club to account for {abs(total_adjustment):.0f}-yard loss"
    elif total_adjustment > 5:
        return f"Consider clubbing down one club - conditions adding {total_adjustment:.0f} yards"

    return None


def calculate_optimal_launch(wind_speed: float, wind_direction: float) -> float:
    """Calculate optimal launch angle for conditions."""
    # Start with standard optimal (varies by club, but ~14° average)
    optimal = 14.0

    # Adjust for headwind (lower launch better)
    if wind_speed > 10 and is_headwind(wind_direction):
        optimal -= 1.5

    # Adjust for tailwind (higher launch better)
    elif wind_speed > 10 and is_tailwind(wind_direction):
        optimal += 1.0

    return round(optimal, 1)


# ============================================================================
# DUAL-UNIT HELPER FUNCTIONS
# ============================================================================


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

    result = calculate_impact_breakdown(request.shot, request.conditions, api_type="professional")
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

    result = calculate_impact_breakdown(request.shot, conditions, api_type="professional")
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

    result = calculate_impact_breakdown(request.shot, conditions, api_type="professional")

    # Update weather dict with course altitude before building dual conditions
    weather_with_altitude = weather.copy()
    weather_with_altitude["altitude_ft"] = altitude_ft
    dual_conditions = build_dual_conditions_used(weather_with_altitude)

    return build_dual_trajectory_response(result, dual_conditions, validated_units)


@router.post("/calculate", response_model=EnterpriseTrajectoryResponse)
async def calculate_trajectory_professional(
    request: CalculateRequest,
    units: Optional[str] = Query(
        default="imperial",
        description="Preferred unit system: 'imperial' or 'metric'. Response includes both.",
    ),
) -> EnterpriseTrajectoryResponse:
    """
    Professional trajectory calculation endpoint with enterprise integration support.

    Calculates golf ball trajectory with either:
    - **Real weather** from GPS coordinates (`location` with lat/lng)
    - **Custom conditions** via `conditions_override`

    **Priority:** If `conditions_override` is provided, it takes precedence over `location`.

    **Enterprise Metadata (optional):**
    Include metadata for tracking shots across facilities, bays, and players:
    ```json
    {
      "ball_speed": 165,
      "launch_angle": 12.5,
      "spin_rate": 2800,
      "conditions_override": {...},
      "metadata": {
        "facility_id": "inrange_atlanta_001",
        "bay_number": 12,
        "player_id": "user_12345",
        "club_type": "7-iron",
        "player_handicap": 15
      }
    }
    ```

    **Response includes:**
    - `request_id`: Unique ID for this request
    - `metadata`: Echo of provided metadata
    - `conditions`: Weather conditions used
    - `trajectory`: Core physics results
    - `analysis`: Breakdown of environmental effects
    - `insights`: Human-readable explanations
    - `recommendations`: Club and launch angle suggestions
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

    # Variables to track conditions used
    wind_speed = 0.0
    wind_direction = 0.0
    temperature = 70.0
    humidity = 50.0
    altitude = 0.0
    pressure = 29.92
    source = "override"
    location_data = None

    # Determine weather conditions
    if request.conditions_override:
        # Use custom override conditions
        override = request.conditions_override
        wind_speed = override.wind_speed
        wind_direction = override.wind_direction
        temperature = override.temperature
        humidity = override.humidity
        altitude = override.altitude
        pressure = override.air_pressure
        source = "override"

        conditions = WeatherConditions(
            wind_speed_mph=wind_speed,
            wind_direction_deg=wind_direction,
            temperature_f=temperature,
            altitude_ft=altitude,
            humidity_pct=humidity,
            pressure_inhg=pressure,
        )

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

        wind_speed = weather["wind_speed_mph"]
        wind_direction = weather["wind_direction_deg"]
        temperature = weather["temperature_f"]
        humidity = weather["humidity_pct"]
        altitude = weather["altitude_ft"]
        pressure = weather["pressure_inhg"]
        source = "real-time"
        location_data = {"lat": request.location.lat, "lng": request.location.lng}

        conditions = WeatherConditions(
            wind_speed_mph=wind_speed,
            wind_direction_deg=wind_direction,
            temperature_f=temperature,
            altitude_ft=altitude,
            humidity_pct=humidity,
            pressure_inhg=pressure,
        )
    else:
        raise HTTPException(
            status_code=400,
            detail="Either location or conditions_override required"
        )

    # Calculate trajectory with professional physics
    result = calculate_impact_breakdown(shot, conditions, api_type="professional")

    # Extract effects for insights
    breakdown = result["impact_breakdown"]
    effects = {
        "wind_effect_yards": breakdown["wind_effect_yards"],
        "temperature_effect_yards": breakdown["temperature_effect_yards"],
        "humidity_effect_yards": breakdown["humidity_effect_yards"],
        "altitude_effect_yards": breakdown["altitude_effect_yards"],
    }

    # Calculate baseline and adjusted values
    baseline_carry = result["baseline"]["carry_yards"]
    adjusted_carry = result["adjusted"]["carry_yards"]
    total_adjustment = breakdown["total_adjustment_yards"]

    # Generate insights
    insights = generate_insights(
        wind_speed=wind_speed,
        wind_direction=wind_direction,
        temperature=temperature,
        humidity=humidity,
        altitude=altitude,
        effects=effects
    )

    # Generate recommendations
    club_suggestion = suggest_club_adjustment(total_adjustment)
    optimal_launch = calculate_optimal_launch(wind_speed, wind_direction)

    # Build enterprise response
    response = EnterpriseTrajectoryResponse(
        request_id=str(uuid.uuid4()),
        timestamp=datetime.utcnow().isoformat() + "Z",

        # Echo back metadata if provided
        metadata=request.metadata.model_dump() if request.metadata else None,

        # Conditions used
        conditions=EnterpriseConditions(
            source=source,
            temperature_f=round(temperature, 1),
            wind_speed_mph=round(wind_speed, 1),
            wind_direction_deg=round(wind_direction, 1),
            humidity_percent=round(humidity, 1),
            pressure_inhg=round(pressure, 2),
            altitude_ft=round(altitude, 0),
            location=location_data
        ),

        # Trajectory results
        trajectory=EnterpriseTrajectory(
            carry_distance_yards=round(adjusted_carry, 1),
            total_distance_yards=round(result["adjusted"]["total_yards"], 1),
            apex_height_feet=round(result["adjusted"]["apex_height_yards"] * 3, 1),  # yards to feet
            flight_time_seconds=round(result["adjusted"]["flight_time_seconds"], 2),
            landing_angle_degrees=round(result["adjusted"]["landing_angle_deg"], 1)
        ),

        # Analysis
        analysis=EnterpriseAnalysis(
            baseline_carry_yards=round(baseline_carry, 1),
            adjusted_carry_yards=round(adjusted_carry, 1),
            total_adjustment_yards=round(total_adjustment, 1),
            effects=EnterpriseEffects(
                wind_yards=round(effects["wind_effect_yards"], 1),
                temperature_yards=round(effects["temperature_effect_yards"], 1),
                humidity_yards=round(effects["humidity_effect_yards"], 1),
                altitude_yards=round(effects["altitude_effect_yards"], 1)
            )
        ),

        # Insights
        insights=insights,

        # Recommendations
        recommendations=EnterpriseRecommendations(
            club_suggestion=club_suggestion,
            optimal_launch_angle=optimal_launch
        ),

        # Also include full dual-unit data for comprehensive clients
        adjusted=DualAdjustedResults(
            carry=build_dual_distance(result["adjusted"]["carry_yards"]),
            total=build_dual_distance(result["adjusted"]["total_yards"]),
            lateral_drift=build_dual_distance(result["adjusted"]["lateral_drift_yards"]),
            apex_height=build_dual_distance(result["adjusted"]["apex_height_yards"]),
            flight_time_seconds=result["adjusted"]["flight_time_seconds"],
            landing_angle_deg=result["adjusted"]["landing_angle_deg"],
        ),
        baseline=DualAdjustedResults(
            carry=build_dual_distance(result["baseline"]["carry_yards"]),
            total=build_dual_distance(result["baseline"]["total_yards"]),
            lateral_drift=build_dual_distance(result["baseline"]["lateral_drift_yards"]),
            apex_height=build_dual_distance(result["baseline"]["apex_height_yards"]),
            flight_time_seconds=result["baseline"]["flight_time_seconds"],
            landing_angle_deg=result["baseline"]["landing_angle_deg"],
        ),
        impact_breakdown=DualImpactBreakdown(
            wind_effect=build_dual_distance(breakdown["wind_effect_yards"]),
            wind_lateral=build_dual_distance(breakdown["wind_lateral_yards"]),
            temperature_effect=build_dual_distance(breakdown["temperature_effect_yards"]),
            altitude_effect=build_dual_distance(breakdown["altitude_effect_yards"]),
            humidity_effect=build_dual_distance(breakdown["humidity_effect_yards"]),
            total_adjustment=build_dual_distance(breakdown["total_adjustment_yards"]),
        )
    )

    return response
