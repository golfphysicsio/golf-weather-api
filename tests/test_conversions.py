"""
Tests for unit conversion utilities.

Tests all conversion functions for accuracy.
"""

import pytest
from app.utils.conversions import (
    UnitConverter,
    create_dual_temperature,
    create_dual_distance,
    create_dual_altitude,
    create_dual_speed,
    create_dual_pressure,
    validate_units_param,
    VALID_UNITS,
)


class TestTemperatureConversions:
    """Test temperature conversions between Fahrenheit and Celsius."""

    def test_freezing_point_f_to_c(self):
        """32°F should equal 0°C."""
        assert UnitConverter.fahrenheit_to_celsius(32) == 0

    def test_boiling_point_f_to_c(self):
        """212°F should equal 100°C."""
        assert UnitConverter.fahrenheit_to_celsius(212) == 100

    def test_room_temp_f_to_c(self):
        """72°F should be approximately 22.2°C."""
        result = UnitConverter.fahrenheit_to_celsius(72)
        assert abs(result - 22.2) < 0.1

    def test_freezing_point_c_to_f(self):
        """0°C should equal 32°F."""
        assert UnitConverter.celsius_to_fahrenheit(0) == 32

    def test_boiling_point_c_to_f(self):
        """100°C should equal 212°F."""
        assert UnitConverter.celsius_to_fahrenheit(100) == 212

    def test_room_temp_c_to_f(self):
        """22°C should be approximately 71.6°F."""
        result = UnitConverter.celsius_to_fahrenheit(22)
        assert abs(result - 71.6) < 0.1


class TestDistanceConversions:
    """Test distance conversions between yards and meters."""

    def test_100_yards_to_meters(self):
        """100 yards should be approximately 91.4 meters."""
        result = UnitConverter.yards_to_meters(100)
        assert abs(result - 91.4) < 0.1

    def test_100_meters_to_yards(self):
        """100 meters should be approximately 109.4 yards."""
        result = UnitConverter.meters_to_yards(100)
        assert abs(result - 109.4) < 0.1

    def test_driver_distance_yards_to_meters(self):
        """250 yards (typical driver) should be approximately 228.6 meters."""
        result = UnitConverter.yards_to_meters(250)
        assert abs(result - 228.6) < 0.1

    def test_zero_distance(self):
        """0 yards should be 0 meters."""
        assert UnitConverter.yards_to_meters(0) == 0
        assert UnitConverter.meters_to_yards(0) == 0


class TestAltitudeConversions:
    """Test altitude conversions between feet and meters."""

    def test_1000_feet_to_meters(self):
        """1000 feet should be approximately 304.8 meters."""
        result = UnitConverter.feet_to_meters(1000)
        assert abs(result - 304.8) < 0.1

    def test_1000_meters_to_feet(self):
        """1000 meters should be approximately 3280.8 feet."""
        result = UnitConverter.meters_to_feet(1000)
        assert abs(result - 3280.8) < 0.1

    def test_denver_altitude(self):
        """5280 feet (Denver) should be approximately 1609 meters."""
        result = UnitConverter.feet_to_meters(5280)
        assert abs(result - 1609.3) < 0.5


class TestSpeedConversions:
    """Test speed conversions between mph and km/h."""

    def test_60_mph_to_kmh(self):
        """60 mph should be approximately 96.6 km/h."""
        result = UnitConverter.mph_to_kmh(60)
        assert abs(result - 96.6) < 0.1

    def test_100_kmh_to_mph(self):
        """100 km/h should be approximately 62.1 mph."""
        result = UnitConverter.kmh_to_mph(100)
        assert abs(result - 62.1) < 0.1

    def test_15_mph_wind(self):
        """15 mph wind should be approximately 24.1 km/h."""
        result = UnitConverter.mph_to_kmh(15)
        assert abs(result - 24.1) < 0.1


class TestPressureConversions:
    """Test pressure conversions between inHg and hPa."""

    def test_standard_pressure_inhg_to_hpa(self):
        """29.92 inHg (standard atmosphere) should be approximately 1013 hPa."""
        result = UnitConverter.inhg_to_hpa(29.92)
        assert abs(result - 1013.2) < 0.5

    def test_30_inhg_to_hpa(self):
        """30 inHg should be approximately 1015.9 hPa."""
        result = UnitConverter.inhg_to_hpa(30)
        assert abs(result - 1015.9) < 0.5

    def test_1000_hpa_to_inhg(self):
        """1000 hPa should be approximately 29.53 inHg."""
        result = UnitConverter.hpa_to_inhg(1000)
        assert abs(result - 29.53) < 0.05


class TestDualUnitHelpers:
    """Test helper functions that create dual-unit objects."""

    def test_create_dual_temperature(self):
        """Test dual temperature object creation."""
        result = create_dual_temperature(72)
        assert "fahrenheit" in result
        assert "celsius" in result
        assert result["fahrenheit"] == 72
        assert abs(result["celsius"] - 22.2) < 0.1

    def test_create_dual_distance(self):
        """Test dual distance object creation."""
        result = create_dual_distance(150)
        assert "yards" in result
        assert "meters" in result
        assert result["yards"] == 150
        assert abs(result["meters"] - 137.2) < 0.1

    def test_create_dual_altitude(self):
        """Test dual altitude object creation."""
        result = create_dual_altitude(5000)
        assert "feet" in result
        assert "meters" in result
        assert result["feet"] == 5000
        assert abs(result["meters"] - 1524) < 1

    def test_create_dual_speed(self):
        """Test dual speed object creation."""
        result = create_dual_speed(15)
        assert "mph" in result
        assert "kmh" in result
        assert result["mph"] == 15
        assert abs(result["kmh"] - 24.1) < 0.1

    def test_create_dual_pressure(self):
        """Test dual pressure object creation."""
        result = create_dual_pressure(29.92)
        assert "inhg" in result
        assert "hpa" in result
        assert result["inhg"] == 29.92
        assert abs(result["hpa"] - 1013.2) < 0.5


class TestUnitsParamValidation:
    """Test units parameter validation."""

    def test_valid_imperial(self):
        """'imperial' should be valid."""
        assert validate_units_param("imperial") == "imperial"

    def test_valid_metric(self):
        """'metric' should be valid."""
        assert validate_units_param("metric") == "metric"

    def test_case_insensitive(self):
        """Units should be case-insensitive."""
        assert validate_units_param("IMPERIAL") == "imperial"
        assert validate_units_param("Metric") == "metric"
        assert validate_units_param("METRIC") == "metric"

    def test_whitespace_trimming(self):
        """Whitespace should be trimmed."""
        assert validate_units_param("  imperial  ") == "imperial"
        assert validate_units_param("\tmetric\n") == "metric"

    def test_default_none(self):
        """None should default to imperial."""
        assert validate_units_param(None) == "imperial"

    def test_invalid_units(self):
        """Invalid units should raise ValueError."""
        with pytest.raises(ValueError) as excinfo:
            validate_units_param("invalid")
        assert "Invalid units parameter" in str(excinfo.value)

    def test_invalid_units_message(self):
        """Error message should list valid options."""
        with pytest.raises(ValueError) as excinfo:
            validate_units_param("foo")
        error_msg = str(excinfo.value)
        assert "imperial" in error_msg
        assert "metric" in error_msg


class TestRoundTripConversions:
    """Test that conversions are reversible (round-trip)."""

    def test_temperature_round_trip(self):
        """Converting back and forth should yield original value."""
        original = 72
        celsius = UnitConverter.fahrenheit_to_celsius(original)
        back = UnitConverter.celsius_to_fahrenheit(celsius)
        assert abs(back - original) < 0.5

    def test_distance_round_trip(self):
        """Converting back and forth should yield original value."""
        original = 150
        meters = UnitConverter.yards_to_meters(original)
        back = UnitConverter.meters_to_yards(meters)
        assert abs(back - original) < 0.5

    def test_altitude_round_trip(self):
        """Converting back and forth should yield original value."""
        original = 5000
        meters = UnitConverter.feet_to_meters(original)
        back = UnitConverter.meters_to_feet(meters)
        assert abs(back - original) < 1

    def test_speed_round_trip(self):
        """Converting back and forth should yield original value."""
        original = 15
        kmh = UnitConverter.mph_to_kmh(original)
        back = UnitConverter.kmh_to_mph(kmh)
        assert abs(back - original) < 0.5

    def test_pressure_round_trip(self):
        """Converting back and forth should yield original value."""
        original = 29.92
        hpa = UnitConverter.inhg_to_hpa(original)
        back = UnitConverter.hpa_to_inhg(hpa)
        assert abs(back - original) < 0.05
