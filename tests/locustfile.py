"""
Golf Physics API - Locust Stress Test Suite

Stress testing for Professional and Gaming API endpoints.
Implements 6 test scenarios as specified in comprehensive_testing_spec.md.
"""

from locust import HttpUser, task, between, events
from locust.runners import MasterRunner
import random
import json
import time

# Base URL for staging
HOST = "https://golf-weather-api-staging.up.railway.app"

# Sample test payloads
PROFESSIONAL_PAYLOADS = [
    # Driver shots
    {
        "ball_speed": 167, "launch_angle": 11.2, "spin_rate": 2600,
        "conditions_override": {
            "wind_speed": 3, "wind_direction": 90,
            "temperature": 72, "humidity": 50,
            "altitude": 0, "air_pressure": 29.92
        }
    },
    # 7-iron shots
    {
        "ball_speed": 125, "launch_angle": 16.3, "spin_rate": 6500,
        "conditions_override": {
            "wind_speed": 10, "wind_direction": 0,
            "temperature": 75, "humidity": 55,
            "altitude": 500, "air_pressure": 29.80
        }
    },
    # Hot day driver
    {
        "ball_speed": 167, "launch_angle": 11.2, "spin_rate": 2600,
        "conditions_override": {
            "wind_speed": 5, "wind_direction": 180,
            "temperature": 95, "humidity": 40,
            "altitude": 0, "air_pressure": 29.92
        }
    },
    # Denver altitude
    {
        "ball_speed": 167, "launch_angle": 11.2, "spin_rate": 2600,
        "conditions_override": {
            "wind_speed": 5, "wind_direction": 90,
            "temperature": 70, "humidity": 30,
            "altitude": 5280, "air_pressure": 24.5
        }
    },
]

GAMING_PAYLOADS = [
    # Scratch golfer, calm day
    {
        "shot": {"player_handicap": 0, "club": "driver"},
        "preset": "calm_day"
    },
    # Mid handicapper, hurricane
    {
        "shot": {"player_handicap": 15, "club": "driver"},
        "preset": "hurricane_hero"
    },
    # Low handicapper, mountain
    {
        "shot": {"player_handicap": 10, "club": "7_iron"},
        "preset": "mountain_challenge"
    },
    # High handicapper, desert
    {
        "shot": {"player_handicap": 25, "club": "5_wood"},
        "preset": "desert_inferno"
    },
    # Custom conditions
    {
        "shot": {"player_handicap": 12, "club": "pw"},
        "conditions_override": {
            "wind_speed": 25, "wind_direction": 45,
            "temperature": 85, "humidity": 60,
            "altitude": 2000, "air_pressure": 28.5
        }
    },
]


class GolfAPIUser(HttpUser):
    """Simulates a user making requests to the Golf Physics API."""

    host = HOST
    wait_time = between(0.1, 0.5)  # Short wait for stress testing

    @task(3)
    def professional_calculate(self):
        """Call Professional API /api/v1/calculate endpoint."""
        payload = random.choice(PROFESSIONAL_PAYLOADS)
        with self.client.post(
            "/api/v1/calculate",
            json=payload,
            catch_response=True,
            name="/api/v1/calculate"
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    if "adjusted" in data and "carry" in data["adjusted"]:
                        response.success()
                    else:
                        response.failure("Invalid response structure")
                except json.JSONDecodeError:
                    response.failure("Invalid JSON response")
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(3)
    def gaming_trajectory(self):
        """Call Gaming API /api/v1/gaming/trajectory endpoint."""
        payload = random.choice(GAMING_PAYLOADS)
        with self.client.post(
            "/api/v1/gaming/trajectory",
            json=payload,
            catch_response=True,
            name="/api/v1/gaming/trajectory"
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    if "adjusted" in data and "carry" in data["adjusted"]:
                        response.success()
                    else:
                        response.failure("Invalid response structure")
                except json.JSONDecodeError:
                    response.failure("Invalid JSON response")
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def gaming_presets(self):
        """Call read-only presets endpoint."""
        with self.client.get(
            "/api/v1/gaming/presets",
            catch_response=True,
            name="/api/v1/gaming/presets"
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def health_check(self):
        """Call health endpoint."""
        with self.client.get(
            "/api/v1/health",
            catch_response=True,
            name="/api/v1/health"
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")


class ProfessionalAPIUser(HttpUser):
    """User focused on Professional API only."""

    host = HOST
    wait_time = between(0.1, 0.3)

    @task
    def calculate(self):
        """Call Professional API endpoint."""
        payload = random.choice(PROFESSIONAL_PAYLOADS)
        self.client.post("/api/v1/calculate", json=payload)


class GamingAPIUser(HttpUser):
    """User focused on Gaming API only."""

    host = HOST
    wait_time = between(0.1, 0.3)

    @task
    def trajectory(self):
        """Call Gaming API endpoint."""
        payload = random.choice(GAMING_PAYLOADS)
        self.client.post("/api/v1/gaming/trajectory", json=payload)
