"""
Gaming Router

Endpoints for gaming-enhanced trajectory calculations and weather presets.
Supports entertainment venues like Topgolf, Drive Shack, Five Iron.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime

from app.models.requests import (
    GamingTrajectoryRequest,
    WeatherConditions,
)
from app.models.responses import (
    PresetsResponse,
    GamingTrajectoryResponse,
    GamingConditionsUsed,
    DualAdjustedResults,
    DualImpactBreakdown,
    DualDistance,
    DualTrajectoryPoint,
)
from app.services.physics import calculate_impact_breakdown
from app.services.weather import fetch_weather_by_city
from app.constants.gaming import (
    WEATHER_PRESETS,
    get_handicap_tier,
    get_stock_parameters,
    VALID_CLUBS,
)
from app.utils.conversions import UnitConverter, validate_units_param


router = APIRouter()


def build_dual_distance(yards: float) -> DualDistance:
    """Create dual-unit distance from yards."""
    return DualDistance(
        yards=round(yards, 1),
        meters=UnitConverter.yards_to_meters(yards),
    )


def build_gaming_trajectory_response(
    physics_result: dict,
    conditions_used: GamingConditionsUsed,
    units_preference: str = "imperial",
) -> GamingTrajectoryResponse:
    """Build a GamingTrajectoryResponse from physics calculation results."""
    baseline = physics_result["baseline"]
    adjusted = physics_result["adjusted"]
    breakdown = physics_result["impact_breakdown"]

    return GamingTrajectoryResponse(
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


@router.get("/presets", response_model=PresetsResponse)
async def get_weather_presets() -> PresetsResponse:
    """
    Get all available weather presets for gaming scenarios.

    Returns 9 predefined extreme weather scenarios for entertainment venues:
    - calm_day: Perfect conditions (baseline)
    - hurricane_hero: Category 3 hurricane winds (65mph tailwind)
    - arctic_assault: Freezing polar conditions (-15°F, 30mph headwind)
    - desert_inferno: Scorching heat with high altitude (115°F, 3500ft)
    - monsoon_madness: Heavy tropical conditions (45mph variable winds)
    - mountain_challenge: High altitude thin air (8500ft elevation)
    - polar_vortex: Extreme Arctic cold (-25°F)
    - dust_bowl: Hot, dry plains (95°F)
    - sweet_spot_tailwind: Optimal 35mph tailwind - physics sweet spot
    - wind_surfer: 150mph hurricane tailwind - ball "surfs" the wind!

    Use these preset keys with the gaming trajectory endpoint.
    """
    return PresetsResponse(
        presets=WEATHER_PRESETS,
        count=len(WEATHER_PRESETS)
    )


@router.post("/trajectory", response_model=GamingTrajectoryResponse)
async def calculate_gaming_trajectory(
    request: GamingTrajectoryRequest,
    units: Optional[str] = Query(
        default="imperial",
        description="Preferred unit system: 'imperial' or 'metric'. Response includes both.",
    ),
) -> GamingTrajectoryResponse:
    """
    Calculate golf ball trajectory with gaming enhancements.

    **Features:**
    - **Handicap-based distances:** Provide `player_handicap` (0-36) and `club` to use
      realistic stock distances for that skill level.
    - **Weather presets:** Use `preset` parameter with preset names like "hurricane_hero"
      for extreme weather scenarios.
    - **Custom conditions:** Use `conditions_override` for complete control over weather.
    - **Real weather:** Use `location` to fetch current conditions for a city.

    **Parameter Priority:**
    1. If `conditions_override` provided → uses custom conditions
    2. If `preset` provided → uses preset conditions
    3. If `location` provided → fetches real weather

    **Shot Parameters Priority:**
    1. If `player_handicap` + `club` provided → looks up stock ball flight parameters
    2. If direct params (ball_speed, launch_angle, spin) provided → uses those

    **Valid Clubs:**
    driver, 3_wood, 5_wood, 3_iron, 4_iron, 5_iron, 6_iron, 7_iron, 8_iron, 9_iron, pw, gw, sw, lw

    **Handicap Tiers:**
    - Scratch (0-5): Professional-level distances
    - Low (6-12): Single-digit to low double-digit
    - Mid (13-20): Average amateur golfer
    - High (21-36): Beginner to high handicapper
    """
    # Validate units parameter
    try:
        validated_units = validate_units_param(units)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Determine shot parameters
    shot_data = request.shot
    handicap_tier = None
    stock_carry = None

    if shot_data.player_handicap is not None and shot_data.club is not None:
        # Use handicap-based lookup
        try:
            if shot_data.club not in VALID_CLUBS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid club '{shot_data.club}'. Valid clubs: {', '.join(VALID_CLUBS)}"
                )
            stock_params = get_stock_parameters(shot_data.player_handicap, shot_data.club)
            handicap_tier = get_handicap_tier(shot_data.player_handicap)
            stock_carry = stock_params["carry"]

            # Build ShotData from stock parameters
            from app.models.requests import ShotData
            shot = ShotData(
                ball_speed_mph=stock_params["ball_speed"],
                launch_angle_deg=stock_params["launch_angle"],
                spin_rate_rpm=stock_params["spin"],
                spin_axis_deg=shot_data.spin_axis_deg,
                direction_deg=shot_data.direction_deg,
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        # Use direct parameters
        from app.models.requests import ShotData
        shot = ShotData(
            ball_speed_mph=shot_data.ball_speed_mph,
            launch_angle_deg=shot_data.launch_angle_deg,
            spin_rate_rpm=shot_data.spin_rate_rpm,
            spin_axis_deg=shot_data.spin_axis_deg,
            direction_deg=shot_data.direction_deg,
        )

    # Determine weather conditions
    source = None
    preset_name = None
    location_name = None
    conditions_text = None

    if request.conditions_override:
        # Use custom override conditions
        source = "override"
        override = request.conditions_override
        conditions = WeatherConditions(
            wind_speed_mph=override.wind_speed,
            wind_direction_deg=override.wind_direction,
            temperature_f=override.temperature,
            altitude_ft=override.altitude,
            humidity_pct=override.humidity,
            pressure_inhg=override.air_pressure,
        )
        conditions_text = "Custom conditions"

    elif request.preset:
        # Use preset conditions
        if request.preset not in WEATHER_PRESETS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid preset '{request.preset}'. Valid presets: {', '.join(WEATHER_PRESETS.keys())}"
            )
        source = "preset"
        preset_name = request.preset
        preset = WEATHER_PRESETS[request.preset]
        preset_cond = preset["conditions"]
        conditions = WeatherConditions(
            wind_speed_mph=preset_cond["wind_speed"],
            wind_direction_deg=preset_cond["wind_direction"],
            temperature_f=preset_cond["temperature"],
            altitude_ft=preset_cond["altitude"],
            humidity_pct=preset_cond["humidity"],
            pressure_inhg=preset_cond["air_pressure"],
        )
        conditions_text = preset["description"]

    elif request.location:
        # Fetch real weather
        source = "real"
        try:
            weather = await fetch_weather_by_city(
                city=request.location.city,
                state=request.location.state,
                country=request.location.country,
            )
            conditions = WeatherConditions(
                wind_speed_mph=weather["wind_speed_mph"],
                wind_direction_deg=weather["wind_direction_deg"],
                temperature_f=weather["temperature_f"],
                altitude_ft=weather["altitude_ft"],
                humidity_pct=weather["humidity_pct"],
                pressure_inhg=weather["pressure_inhg"],
            )
            location_name = weather["location"]
            conditions_text = weather.get("conditions_text", "Real weather")
        except ValueError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail=f"Failed to fetch weather data: {str(e)}"
            )
    else:
        raise HTTPException(
            status_code=400,
            detail="Either conditions_override, preset, or location required"
        )

    # Calculate trajectory with gaming physics (smart capping for extreme conditions)
    result = calculate_impact_breakdown(shot, conditions, api_type="gaming")

    # Build conditions used response
    conditions_used = GamingConditionsUsed(
        source=source,
        preset_name=preset_name,
        handicap_tier=handicap_tier,
        player_handicap=shot_data.player_handicap,
        club=shot_data.club,
        stock_carry=stock_carry,
        wind_speed_mph=conditions.wind_speed_mph,
        wind_direction_deg=conditions.wind_direction_deg,
        temperature_f=conditions.temperature_f,
        altitude_ft=conditions.altitude_ft,
        humidity_pct=conditions.humidity_pct,
        pressure_inhg=conditions.pressure_inhg,
        location=location_name,
        conditions_text=conditions_text,
    )

    return build_gaming_trajectory_response(result, conditions_used, validated_units)


@router.get("/presets/{preset_id}")
async def get_preset_details(preset_id: str) -> dict:
    """
    Get details for a specific weather preset.

    Returns the preset configuration including conditions, difficulty, and tags.
    """
    if preset_id not in WEATHER_PRESETS:
        raise HTTPException(
            status_code=404,
            detail=f"Preset '{preset_id}' not found. Valid presets: {', '.join(WEATHER_PRESETS.keys())}"
        )
    return {
        "preset_id": preset_id,
        **WEATHER_PRESETS[preset_id]
    }


@router.get("/clubs")
async def get_valid_clubs() -> dict:
    """
    Get list of valid club names for the API.

    Use these club names with the player_handicap parameter.
    """
    return {
        "clubs": VALID_CLUBS,
        "count": len(VALID_CLUBS),
        "categories": {
            "woods": ["driver", "3_wood", "5_wood"],
            "irons": ["3_iron", "4_iron", "5_iron", "6_iron", "7_iron", "8_iron", "9_iron"],
            "wedges": ["pw", "gw", "sw", "lw"]
        }
    }


@router.get("/stock-distances")
async def get_stock_distances() -> dict:
    """
    Get the complete stock distance lookup table.

    Shows expected carry distances for all handicap tiers and clubs.
    """
    from app.constants.gaming import STOCK_DISTANCES, HANDICAP_TIERS
    return {
        "handicap_tiers": HANDICAP_TIERS,
        "stock_distances": STOCK_DISTANCES
    }
