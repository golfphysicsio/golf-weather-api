"""
Unit Conversion Utilities

Provides conversion functions between imperial and metric units
for golf physics calculations.

All internal calculations use metric (SI) units.
Conversions are applied at API boundaries.
"""

from typing import Dict, Any, Union


class UnitConverter:
    """
    Handles conversion between imperial and metric units.

    Supported conversions:
    - Temperature: Fahrenheit <-> Celsius
    - Distance: Yards <-> Meters
    - Speed: MPH <-> KM/H (and M/S)
    - Altitude: Feet <-> Meters
    - Pressure: inHg <-> hPa (mbar)
    """

    # Conversion constants
    YARDS_TO_METERS = 0.9144
    FEET_TO_METERS = 0.3048
    MPH_TO_KMH = 1.60934
    MPH_TO_MS = 0.44704
    INHG_TO_HPA = 33.8639

    @staticmethod
    def fahrenheit_to_celsius(f: float) -> float:
        """Convert Fahrenheit to Celsius."""
        return round((f - 32) * 5 / 9, 1)

    @staticmethod
    def celsius_to_fahrenheit(c: float) -> float:
        """Convert Celsius to Fahrenheit."""
        return round(c * 9 / 5 + 32, 1)

    @staticmethod
    def yards_to_meters(yards: float) -> float:
        """Convert yards to meters."""
        return round(yards * UnitConverter.YARDS_TO_METERS, 1)

    @staticmethod
    def meters_to_yards(meters: float) -> float:
        """Convert meters to yards."""
        return round(meters / UnitConverter.YARDS_TO_METERS, 1)

    @staticmethod
    def feet_to_meters(feet: float) -> float:
        """Convert feet to meters."""
        return round(feet * UnitConverter.FEET_TO_METERS, 1)

    @staticmethod
    def meters_to_feet(meters: float) -> float:
        """Convert meters to feet."""
        return round(meters / UnitConverter.FEET_TO_METERS, 1)

    @staticmethod
    def mph_to_kmh(mph: float) -> float:
        """Convert miles per hour to kilometers per hour."""
        return round(mph * UnitConverter.MPH_TO_KMH, 1)

    @staticmethod
    def kmh_to_mph(kmh: float) -> float:
        """Convert kilometers per hour to miles per hour."""
        return round(kmh / UnitConverter.MPH_TO_KMH, 1)

    @staticmethod
    def mph_to_ms(mph: float) -> float:
        """Convert miles per hour to meters per second."""
        return round(mph * UnitConverter.MPH_TO_MS, 2)

    @staticmethod
    def ms_to_mph(ms: float) -> float:
        """Convert meters per second to miles per hour."""
        return round(ms / UnitConverter.MPH_TO_MS, 1)

    @staticmethod
    def inhg_to_hpa(inhg: float) -> float:
        """Convert inches of mercury to hectopascals (millibars)."""
        return round(inhg * UnitConverter.INHG_TO_HPA, 1)

    @staticmethod
    def hpa_to_inhg(hpa: float) -> float:
        """Convert hectopascals to inches of mercury."""
        return round(hpa / UnitConverter.INHG_TO_HPA, 2)


def create_dual_temperature(fahrenheit: float) -> Dict[str, float]:
    """Create dual-unit temperature object."""
    return {
        "fahrenheit": round(fahrenheit, 1),
        "celsius": UnitConverter.fahrenheit_to_celsius(fahrenheit)
    }


def create_dual_distance(yards: float) -> Dict[str, float]:
    """Create dual-unit distance object (yards/meters)."""
    return {
        "yards": round(yards, 1),
        "meters": UnitConverter.yards_to_meters(yards)
    }


def create_dual_altitude(feet: float) -> Dict[str, float]:
    """Create dual-unit altitude object (feet/meters)."""
    return {
        "feet": round(feet, 0),
        "meters": round(UnitConverter.feet_to_meters(feet), 0)
    }


def create_dual_speed(mph: float) -> Dict[str, float]:
    """Create dual-unit speed object (mph/kmh)."""
    return {
        "mph": round(mph, 1),
        "kmh": UnitConverter.mph_to_kmh(mph)
    }


def create_dual_pressure(inhg: float) -> Dict[str, float]:
    """Create dual-unit pressure object (inHg/hPa)."""
    return {
        "inhg": round(inhg, 2),
        "hpa": UnitConverter.inhg_to_hpa(inhg)
    }


def create_dual_trajectory_point(x: float, y: float, z: float) -> Dict[str, Any]:
    """Create dual-unit trajectory point."""
    return {
        "x": create_dual_distance(x),
        "y": create_dual_distance(y),
        "z": create_dual_distance(z)
    }


def convert_conditions_to_dual_unit(conditions: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert a conditions dict with imperial values to dual-unit format.

    Input keys expected:
    - wind_speed_mph
    - temperature_f
    - altitude_ft
    - pressure_inhg
    - humidity_pct (no conversion needed)
    - wind_direction_deg (no conversion needed)
    """
    return {
        "location": conditions.get("location"),
        "wind_speed": create_dual_speed(conditions["wind_speed_mph"]),
        "wind_direction_deg": conditions["wind_direction_deg"],
        "temperature": create_dual_temperature(conditions["temperature_f"]),
        "altitude": create_dual_altitude(conditions["altitude_ft"]),
        "humidity_pct": conditions["humidity_pct"],
        "pressure": create_dual_pressure(conditions["pressure_inhg"]),
        "conditions_text": conditions.get("conditions_text"),
        "fetched_at": conditions.get("fetched_at"),
    }


def convert_results_to_dual_unit(results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert trajectory results with imperial values to dual-unit format.

    Input keys expected:
    - carry_yards
    - total_yards
    - lateral_drift_yards
    - apex_height_yards
    - flight_time_seconds (no conversion)
    - landing_angle_deg (no conversion)
    """
    return {
        "carry": create_dual_distance(results["carry_yards"]),
        "total": create_dual_distance(results["total_yards"]),
        "lateral_drift": create_dual_distance(results["lateral_drift_yards"]),
        "apex_height": create_dual_distance(results["apex_height_yards"]),
        "flight_time_seconds": results["flight_time_seconds"],
        "landing_angle_deg": results["landing_angle_deg"],
    }


def convert_impact_breakdown_to_dual_unit(breakdown: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert impact breakdown with imperial values to dual-unit format.
    """
    return {
        "wind_effect": create_dual_distance(breakdown["wind_effect_yards"]),
        "wind_lateral": create_dual_distance(breakdown["wind_lateral_yards"]),
        "temperature_effect": create_dual_distance(breakdown["temperature_effect_yards"]),
        "altitude_effect": create_dual_distance(breakdown["altitude_effect_yards"]),
        "humidity_effect": create_dual_distance(breakdown["humidity_effect_yards"]),
        "total_adjustment": create_dual_distance(breakdown["total_adjustment_yards"]),
    }


# Valid unit system values
VALID_UNITS = ("imperial", "metric")


def validate_units_param(units: str) -> str:
    """
    Validate the units parameter.
    Returns normalized units value or raises ValueError.
    """
    if units is None:
        return "imperial"  # Default

    units_lower = units.lower().strip()
    if units_lower not in VALID_UNITS:
        raise ValueError(
            f"Invalid units parameter: '{units}'. "
            f"Valid values are: {', '.join(VALID_UNITS)}"
        )
    return units_lower
