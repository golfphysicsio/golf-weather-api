"""
Tests for API endpoints.
"""

import pytest
from fastapi.testclient import TestClient

# Import test API key from conftest (this also sets up the env var)
from tests.conftest import TEST_API_KEY

from app.main import app


client = TestClient(app)

# Headers for authenticated requests
AUTH_HEADERS = {"X-API-Key": TEST_API_KEY}


class TestHealthEndpoint:
    """Tests for health check endpoint."""

    def test_health_returns_200(self):
        """Health endpoint should return 200."""
        response = client.get("/v1/health")
        assert response.status_code == 200

    def test_health_returns_healthy_status(self):
        """Health endpoint should return healthy status."""
        response = client.get("/v1/health")
        data = response.json()
        assert data["status"] == "healthy"

    def test_health_returns_version(self):
        """Health endpoint should return version."""
        response = client.get("/v1/health")
        data = response.json()
        assert "version" in data
        assert data["version"]  # Just check version exists and is truthy

    def test_health_returns_timestamp(self):
        """Health endpoint should return timestamp."""
        response = client.get("/v1/health")
        data = response.json()
        assert "timestamp" in data


class TestRootEndpoint:
    """Tests for root endpoint."""

    def test_root_returns_200(self):
        """Root endpoint should return 200."""
        response = client.get("/")
        assert response.status_code == 200

    def test_root_returns_api_info(self):
        """Root endpoint should return API info."""
        response = client.get("/")
        data = response.json()
        assert "message" in data
        assert "docs" in data


class TestTrajectoryEndpoint:
    """Tests for POST /v1/trajectory endpoint."""

    def test_valid_request_returns_200(self):
        """Valid trajectory request should return 200."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                    "spin_axis_deg": 0,
                    "direction_deg": 0,
                },
                "conditions": {
                    "wind_speed_mph": 10,
                    "wind_direction_deg": 0,
                    "temperature_f": 70,
                    "altitude_ft": 0,
                    "humidity_pct": 50,
                    "pressure_inhg": 29.92,
                },
            },
        )
        assert response.status_code == 200

    def test_response_contains_adjusted_results(self):
        """Response should contain adjusted results with dual-unit format."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "conditions": {},
            },
        )
        data = response.json()
        assert "adjusted" in data
        # New dual-unit format: values have both yards and meters
        assert "carry" in data["adjusted"]
        assert "yards" in data["adjusted"]["carry"]
        assert "meters" in data["adjusted"]["carry"]
        assert "total" in data["adjusted"]
        assert "lateral_drift" in data["adjusted"]
        assert "apex_height" in data["adjusted"]
        assert "flight_time_seconds" in data["adjusted"]
        assert "landing_angle_deg" in data["adjusted"]

    def test_response_contains_baseline(self):
        """Response should contain baseline results with dual-unit format."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "conditions": {},
            },
        )
        data = response.json()
        assert "baseline" in data
        # New dual-unit format
        assert "carry" in data["baseline"]
        assert "yards" in data["baseline"]["carry"]
        assert "meters" in data["baseline"]["carry"]

    def test_response_contains_impact_breakdown(self):
        """Response should contain impact breakdown with dual-unit format."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "conditions": {},
            },
        )
        data = response.json()
        assert "impact_breakdown" in data
        # New dual-unit format
        assert "wind_effect" in data["impact_breakdown"]
        assert "yards" in data["impact_breakdown"]["wind_effect"]
        assert "meters" in data["impact_breakdown"]["wind_effect"]
        assert "temperature_effect" in data["impact_breakdown"]
        assert "altitude_effect" in data["impact_breakdown"]
        assert "humidity_effect" in data["impact_breakdown"]
        assert "total_adjustment" in data["impact_breakdown"]

    def test_response_contains_trajectory_points(self):
        """Response should contain trajectory points with dual-unit format."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "conditions": {},
            },
        )
        data = response.json()
        assert "trajectory_points" in data
        assert len(data["trajectory_points"]) > 0
        # Check first point structure - now with dual units
        point = data["trajectory_points"][0]
        assert "x" in point
        assert "y" in point
        assert "z" in point
        # Each coordinate has dual units
        assert "yards" in point["x"]
        assert "meters" in point["x"]

    def test_invalid_ball_speed_returns_422(self):
        """Invalid ball speed should return 422."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 300,  # Too high
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "conditions": {},
            },
        )
        assert response.status_code == 422

    def test_missing_required_fields_returns_422(self):
        """Missing required fields should return 422."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    # Missing launch_angle_deg and spin_rate_rpm
                },
                "conditions": {},
            },
        )
        assert response.status_code == 422

    def test_defaults_applied_for_optional_fields(self):
        """Optional fields should use defaults."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                    # spin_axis_deg and direction_deg should default to 0
                },
                "conditions": {
                    # All conditions should use defaults
                },
            },
        )
        assert response.status_code == 200
        data = response.json()
        # Results should be valid - now using dual-unit format
        assert data["adjusted"]["carry"]["yards"] > 0

class TestTrajectoryLocationEndpoint:
    """Tests for POST /v1/trajectory/location endpoint."""

    def test_returns_422_for_missing_city(self):
        """Missing city should return 422."""
        response = client.post(
            "/v1/trajectory/location",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "location": {
                    # Missing city
                },
            },
        )
        assert response.status_code == 422


class TestTrajectoryCourseEndpoint:
    """Tests for POST /v1/trajectory/course endpoint."""

    def test_returns_404_for_unknown_course(self):
        """Unknown course should return 404."""
        response = client.post(
            "/v1/trajectory/course",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "course": {
                    "name": "Nonexistent Golf Club 12345",
                },
            },
        )
        assert response.status_code == 404


class TestValidation:
    """Tests for input validation."""

    def test_ball_speed_too_low(self):
        """Ball speed <= 0 should fail validation."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 0,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "conditions": {},
            },
        )
        assert response.status_code == 422

    def test_launch_angle_out_of_range(self):
        """Launch angle outside -10 to 60 should fail validation."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 70,  # Too high
                    "spin_rate_rpm": 2800,
                },
                "conditions": {},
            },
        )
        assert response.status_code == 422

    def test_spin_rate_negative(self):
        """Negative spin rate should fail validation."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": -100,
                },
                "conditions": {},
            },
        )
        assert response.status_code == 422

    def test_wind_direction_out_of_range(self):
        """Wind direction outside 0-360 should fail validation."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "conditions": {
                    "wind_direction_deg": 400,  # Invalid
                },
            },
        )
        assert response.status_code == 422

    def test_humidity_over_100(self):
        """Humidity > 100 should fail validation."""
        response = client.post(
            "/v1/trajectory",
            headers=AUTH_HEADERS,
            json={
                "shot": {
                    "ball_speed_mph": 130,
                    "launch_angle_deg": 14.5,
                    "spin_rate_rpm": 2800,
                },
                "conditions": {
                    "humidity_pct": 150,
                },
            },
        )
        assert response.status_code == 422
