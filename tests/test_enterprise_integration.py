"""
Enterprise Integration Tests

Tests the enhanced /api/v1/calculate endpoint with:
- Enterprise metadata support
- Enhanced response format with insights and recommendations
- Backward compatibility (requests without metadata still work)
"""

import pytest
from fastapi.testclient import TestClient
from tests.conftest import TEST_API_KEY
from app.main import app

client = TestClient(app)

# Headers with test API key
AUTH_HEADERS = {"X-API-Key": TEST_API_KEY}


class TestEnterpriseMetadata:
    """Tests for enterprise metadata support."""

    def test_calculate_with_full_metadata(self):
        """Test that full metadata is accepted and echoed back."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145.2,
                "launch_angle": 12.3,
                "spin_rate": 5842,
                "conditions_override": {
                    "wind_speed": 10,
                    "wind_direction": 180,
                    "temperature": 72,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                },
                "metadata": {
                    "facility_id": "test_facility_001",
                    "bay_number": 12,
                    "player_id": "player_123",
                    "session_id": "session_456",
                    "club_type": "7-iron",
                    "club_speed": 95.5,
                    "smash_factor": 1.38,
                    "launch_direction": -2.1,
                    "player_handicap": 15
                }
            }
        )

        assert response.status_code == 200
        data = response.json()

        # Check metadata is echoed back
        assert data["metadata"] is not None
        assert data["metadata"]["facility_id"] == "test_facility_001"
        assert data["metadata"]["bay_number"] == 12
        assert data["metadata"]["player_id"] == "player_123"
        assert data["metadata"]["session_id"] == "session_456"
        assert data["metadata"]["club_type"] == "7-iron"
        assert data["metadata"]["player_handicap"] == 15

    def test_calculate_with_partial_metadata(self):
        """Test that partial metadata works (only some fields provided)."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 167,
                "launch_angle": 11.2,
                "spin_rate": 2600,
                "conditions_override": {
                    "wind_speed": 5,
                    "wind_direction": 90,
                    "temperature": 75,
                    "humidity": 60,
                    "altitude": 500,
                    "air_pressure": 29.92
                },
                "metadata": {
                    "facility_id": "inrange_001",
                    "bay_number": 5
                }
            }
        )

        assert response.status_code == 200
        data = response.json()

        # Check partial metadata is echoed back
        assert data["metadata"] is not None
        assert data["metadata"]["facility_id"] == "inrange_001"
        assert data["metadata"]["bay_number"] == 5
        # Other fields should be None
        assert data["metadata"].get("player_id") is None

    def test_calculate_without_metadata_backward_compatible(self):
        """Test that requests without metadata still work (backward compatibility)."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 167,
                "launch_angle": 11.2,
                "spin_rate": 2600,
                "conditions_override": {
                    "wind_speed": 10,
                    "wind_direction": 0,
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        assert response.status_code == 200
        data = response.json()

        # Metadata should be None
        assert data["metadata"] is None

        # Other fields should still exist
        assert "trajectory" in data
        assert "analysis" in data
        assert "insights" in data


class TestEnhancedResponse:
    """Tests for enhanced response format."""

    def test_response_contains_request_id(self):
        """Test that response includes request_id."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 0,
                    "wind_direction": 0,
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()
        assert "request_id" in data
        assert len(data["request_id"]) > 0  # Should be a UUID

    def test_response_contains_timestamp(self):
        """Test that response includes timestamp."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 0,
                    "wind_direction": 0,
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()
        assert "timestamp" in data
        assert "Z" in data["timestamp"]  # Should be ISO format with Z suffix

    def test_response_contains_conditions(self):
        """Test that response includes conditions used."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 15,
                    "wind_direction": 180,
                    "temperature": 85,
                    "humidity": 70,
                    "altitude": 1000,
                    "air_pressure": 29.5
                }
            }
        )

        data = response.json()
        conditions = data["conditions"]

        assert conditions["source"] == "override"
        assert conditions["wind_speed_mph"] == 15
        assert conditions["wind_direction_deg"] == 180
        assert conditions["temperature_f"] == 85
        assert conditions["humidity_percent"] == 70
        assert conditions["altitude_ft"] == 1000

    def test_response_contains_trajectory(self):
        """Test that response includes trajectory data."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 0,
                    "wind_direction": 0,
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()
        trajectory = data["trajectory"]

        assert "carry_distance_yards" in trajectory
        assert "total_distance_yards" in trajectory
        assert "apex_height_feet" in trajectory
        assert "flight_time_seconds" in trajectory
        assert "landing_angle_degrees" in trajectory

        # Values should be reasonable
        assert 100 < trajectory["carry_distance_yards"] < 300
        assert trajectory["apex_height_feet"] > 0
        assert trajectory["flight_time_seconds"] > 0

    def test_response_contains_analysis(self):
        """Test that response includes analysis breakdown."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 10,
                    "wind_direction": 0,
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()
        analysis = data["analysis"]

        assert "baseline_carry_yards" in analysis
        assert "adjusted_carry_yards" in analysis
        assert "total_adjustment_yards" in analysis
        assert "effects" in analysis

        effects = analysis["effects"]
        assert "wind_yards" in effects
        assert "temperature_yards" in effects
        assert "humidity_yards" in effects
        assert "altitude_yards" in effects


class TestInsightsGeneration:
    """Tests for insights generation."""

    def test_headwind_insight(self):
        """Test that headwind generates appropriate insight."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 15,
                    "wind_direction": 0,  # headwind (0 degrees = into the wind)
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()
        insights = data["insights"]

        assert len(insights) > 0
        # Should mention headwind
        assert any("headwind" in insight.lower() for insight in insights)

    def test_tailwind_insight(self):
        """Test that tailwind generates appropriate insight."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 15,
                    "wind_direction": 180,  # tailwind
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()
        insights = data["insights"]

        assert len(insights) > 0
        # Should mention tailwind
        assert any("tailwind" in insight.lower() for insight in insights)

    def test_calm_conditions_insight(self):
        """Test that calm conditions generate appropriate insight (even with minor effects)."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 0,
                    "wind_direction": 0,
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()
        insights = data["insights"]

        # Should have at least one insight (either about conditions or "near-ideal")
        assert len(insights) > 0
        # With calm wind (no wind), no wind-related insight should appear
        assert not any("headwind" in insight.lower() or "tailwind" in insight.lower() for insight in insights)


class TestRecommendations:
    """Tests for recommendations."""

    def test_recommendations_exist(self):
        """Test that recommendations are present."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 15,
                    "wind_direction": 0,
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()

        assert "recommendations" in data
        assert "optimal_launch_angle" in data["recommendations"]

    def test_club_suggestion_for_significant_adjustment(self):
        """Test that club suggestion is provided for significant adjustment."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 25,  # Strong headwind
                    "wind_direction": 0,
                    "temperature": 50,  # Cool
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()
        recommendations = data["recommendations"]

        # With strong headwind and cool temp, should suggest clubbing up
        if abs(data["analysis"]["total_adjustment_yards"]) > 5:
            assert recommendations["club_suggestion"] is not None


class TestDualUnitData:
    """Tests for dual-unit data inclusion."""

    def test_includes_dual_unit_adjusted(self):
        """Test that dual-unit adjusted data is included."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 0,
                    "wind_direction": 0,
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()

        # Should include dual-unit adjusted results
        assert "adjusted" in data
        adjusted = data["adjusted"]
        assert "carry" in adjusted
        assert "yards" in adjusted["carry"]
        assert "meters" in adjusted["carry"]

    def test_includes_dual_unit_impact_breakdown(self):
        """Test that dual-unit impact breakdown is included."""
        response = client.post(
            "/api/v1/calculate",
            headers=AUTH_HEADERS,
            json={
                "ball_speed": 145,
                "launch_angle": 12,
                "spin_rate": 5800,
                "conditions_override": {
                    "wind_speed": 10,
                    "wind_direction": 0,
                    "temperature": 70,
                    "humidity": 50,
                    "altitude": 0,
                    "air_pressure": 29.92
                }
            }
        )

        data = response.json()

        # Should include dual-unit impact breakdown
        assert "impact_breakdown" in data
        breakdown = data["impact_breakdown"]
        assert "wind_effect" in breakdown
        assert "yards" in breakdown["wind_effect"]
        assert "meters" in breakdown["wind_effect"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
