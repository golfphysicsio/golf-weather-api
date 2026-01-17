"""
Conditions Router

Endpoints for fetching weather conditions without trajectory calculation.
Supports both imperial and metric units (dual-unit responses).
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Literal, Union

from app.models.responses import (
    ConditionsResponse,
    DualConditionsResponse,
    DualTemperature,
    DualSpeed,
    DualAltitude,
    DualPressure,
)
from app.services.weather import fetch_weather_by_city, fetch_weather_by_coords
from app.utils.conversions import (
    UnitConverter,
    validate_units_param,
    VALID_UNITS,
)


router = APIRouter()


def build_dual_conditions_response(weather: dict, units: str) -> DualConditionsResponse:
    """Build a dual-unit conditions response from weather data."""
    return DualConditionsResponse(
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
        units_preference=units,
    )


@router.get("/conditions", response_model=DualConditionsResponse)
async def get_conditions(
    city: str = Query(..., min_length=1, description="City name"),
    state: Optional[str] = Query(default=None, description="State or region"),
    country: Optional[str] = Query(default="US", description="Country code"),
    units: Optional[str] = Query(
        default="imperial",
        description="Preferred unit system: 'imperial' or 'metric'. Response includes both.",
    ),
) -> DualConditionsResponse:
    """
    Fetch current weather conditions for a location.

    This utility endpoint returns current weather conditions without
    performing any trajectory calculations. Useful for displaying
    conditions to users or caching weather data.

    **Unit Support:**
    - Accepts `units` parameter: 'imperial' (default) or 'metric'
    - Response always includes BOTH unit systems
    - `units_preference` in response indicates client's stated preference

    **Response includes:**
    - Temperature: Fahrenheit and Celsius
    - Wind speed: mph and km/h
    - Altitude: feet and meters
    - Pressure: inHg and hPa
    """
    # Validate units parameter
    try:
        validated_units = validate_units_param(units)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        weather = await fetch_weather_by_city(
            city=city,
            state=state,
            country=country,
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch weather data: {str(e)}",
        )

    return build_dual_conditions_response(weather, validated_units)


@router.get("/conditions/coords", response_model=DualConditionsResponse)
async def get_conditions_by_coords(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude"),
    units: Optional[str] = Query(
        default="imperial",
        description="Preferred unit system: 'imperial' or 'metric'. Response includes both.",
    ),
) -> DualConditionsResponse:
    """
    Fetch current weather conditions by GPS coordinates.

    This endpoint returns current weather conditions for a given latitude
    and longitude. Useful for geolocation-based weather lookup.

    **Unit Support:**
    - Accepts `units` parameter: 'imperial' (default) or 'metric'
    - Response always includes BOTH unit systems
    - `units_preference` in response indicates client's stated preference

    **Response includes:**
    - Temperature: Fahrenheit and Celsius
    - Wind speed: mph and km/h
    - Altitude: feet and meters
    - Pressure: inHg and hPa
    """
    # Validate units parameter
    try:
        validated_units = validate_units_param(units)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        weather = await fetch_weather_by_coords(lat=lat, lon=lon)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to fetch weather data: {str(e)}",
        )

    return build_dual_conditions_response(weather, validated_units)
