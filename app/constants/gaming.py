"""
Gaming Constants

Weather presets and stock distances for entertainment gaming scenarios.
"""

from typing import Dict, Any

# ============================================================================
# WEATHER PRESETS
# 10 predefined extreme weather scenarios for entertainment venues
# ============================================================================

WEATHER_PRESETS: Dict[str, Dict[str, Any]] = {
    "calm_day": {
        "name": "Calm Day",
        "description": "Perfect conditions - baseline for comparison",
        "conditions": {
            "wind_speed": 3,
            "wind_direction": 90,
            "temperature": 72,
            "humidity": 50,
            "altitude": 100,
            "air_pressure": 30.0
        },
        "difficulty": "easy",
        "tags": ["baseline", "calm", "perfect"]
    },

    "hurricane_hero": {
        "name": "Hurricane Hero",
        "description": "Category 3 hurricane conditions with extreme winds and rain",
        "conditions": {
            "wind_speed": 65,
            "wind_direction": 180,
            "temperature": 78,
            "humidity": 95,
            "altitude": 0,
            "air_pressure": 28.5
        },
        "difficulty": "extreme",
        "tags": ["wind", "rain", "coastal", "extreme"]
    },

    "arctic_assault": {
        "name": "Arctic Assault",
        "description": "Polar conditions with freezing temperatures and biting winds",
        "conditions": {
            "wind_speed": 30,
            "wind_direction": 0,
            "temperature": -15,
            "humidity": 70,
            "altitude": 100,
            "air_pressure": 30.5
        },
        "difficulty": "hard",
        "tags": ["cold", "wind", "winter"]
    },

    "desert_inferno": {
        "name": "Desert Inferno",
        "description": "Scorching heat with high altitude and thin air",
        "conditions": {
            "wind_speed": 20,
            "wind_direction": 90,
            "temperature": 115,
            "humidity": 8,
            "altitude": 3500,
            "air_pressure": 29.0
        },
        "difficulty": "hard",
        "tags": ["heat", "altitude", "dry"]
    },

    "tornado_alley": {
        "name": "Tornado Alley",
        "description": "Severe storm with chaotic, extreme winds",
        "conditions": {
            "wind_speed": 85,
            "wind_direction": 270,
            "temperature": 68,
            "humidity": 85,
            "altitude": 1200,
            "air_pressure": 29.5
        },
        "difficulty": "extreme",
        "tags": ["wind", "storm", "extreme"]
    },

    "monsoon_madness": {
        "name": "Monsoon Madness",
        "description": "Heavy tropical rain with high humidity and gusting winds",
        "conditions": {
            "wind_speed": 45,
            "wind_direction": 135,
            "temperature": 85,
            "humidity": 98,
            "altitude": 50,
            "air_pressure": 29.8
        },
        "difficulty": "hard",
        "tags": ["rain", "tropical", "wind"]
    },

    "mountain_challenge": {
        "name": "Mountain Challenge",
        "description": "High altitude with thin air and cool temperatures",
        "conditions": {
            "wind_speed": 15,
            "wind_direction": 180,
            "temperature": 58,
            "humidity": 40,
            "altitude": 8500,
            "air_pressure": 26.8
        },
        "difficulty": "medium",
        "tags": ["altitude", "thin-air", "mountain"]
    },

    "polar_vortex": {
        "name": "Polar Vortex",
        "description": "Extreme Arctic cold with dangerous wind chill",
        "conditions": {
            "wind_speed": 40,
            "wind_direction": 360,
            "temperature": -25,
            "humidity": 65,
            "altitude": 200,
            "air_pressure": 30.8
        },
        "difficulty": "extreme",
        "tags": ["extreme-cold", "wind", "arctic"]
    },

    "dust_bowl": {
        "name": "Dust Bowl",
        "description": "Hot, dry plains with moderate winds",
        "conditions": {
            "wind_speed": 25,
            "wind_direction": 225,
            "temperature": 95,
            "humidity": 12,
            "altitude": 2200,
            "air_pressure": 29.4
        },
        "difficulty": "medium",
        "tags": ["heat", "dry", "wind"]
    },

    "typhoon_terror": {
        "name": "Typhoon Terror",
        "description": "Category 4 Pacific storm with devastating winds",
        "conditions": {
            "wind_speed": 95,
            "wind_direction": 315,
            "temperature": 82,
            "humidity": 97,
            "altitude": 0,
            "air_pressure": 27.9
        },
        "difficulty": "extreme",
        "tags": ["extreme", "wind", "tropical", "rain"]
    }
}


# ============================================================================
# STOCK DISTANCES
# 4 handicap tiers x 14 clubs = 56 entries
# ============================================================================

STOCK_DISTANCES: Dict[str, Dict[str, Dict[str, Any]]] = {
    "scratch": {  # 0-5 handicap
        "driver": {"carry": 280, "ball_speed": 167, "launch_angle": 11.2, "spin": 2600},
        "3_wood": {"carry": 255, "ball_speed": 158, "launch_angle": 10.5, "spin": 3200},
        "5_wood": {"carry": 235, "ball_speed": 150, "launch_angle": 11.0, "spin": 3800},
        "3_iron": {"carry": 220, "ball_speed": 145, "launch_angle": 12.0, "spin": 4000},
        "4_iron": {"carry": 210, "ball_speed": 140, "launch_angle": 13.0, "spin": 4200},
        "5_iron": {"carry": 200, "ball_speed": 135, "launch_angle": 14.0, "spin": 4500},
        "6_iron": {"carry": 190, "ball_speed": 130, "launch_angle": 15.0, "spin": 5000},
        "7_iron": {"carry": 180, "ball_speed": 125, "launch_angle": 16.0, "spin": 5500},
        "8_iron": {"carry": 170, "ball_speed": 120, "launch_angle": 17.5, "spin": 6000},
        "9_iron": {"carry": 160, "ball_speed": 115, "launch_angle": 19.0, "spin": 6500},
        "pw": {"carry": 150, "ball_speed": 110, "launch_angle": 21.0, "spin": 7000},
        "gw": {"carry": 130, "ball_speed": 100, "launch_angle": 24.0, "spin": 8000},
        "sw": {"carry": 110, "ball_speed": 90, "launch_angle": 27.0, "spin": 9000},
        "lw": {"carry": 90, "ball_speed": 80, "launch_angle": 30.0, "spin": 9500},
    },

    "low": {  # 6-12 handicap
        "driver": {"carry": 260, "ball_speed": 158, "launch_angle": 12.0, "spin": 2800},
        "3_wood": {"carry": 235, "ball_speed": 148, "launch_angle": 11.0, "spin": 3400},
        "5_wood": {"carry": 215, "ball_speed": 140, "launch_angle": 11.5, "spin": 4000},
        "3_iron": {"carry": 200, "ball_speed": 135, "launch_angle": 13.0, "spin": 4300},
        "4_iron": {"carry": 190, "ball_speed": 130, "launch_angle": 14.0, "spin": 4500},
        "5_iron": {"carry": 180, "ball_speed": 125, "launch_angle": 15.0, "spin": 4800},
        "6_iron": {"carry": 170, "ball_speed": 120, "launch_angle": 16.0, "spin": 5300},
        "7_iron": {"carry": 160, "ball_speed": 115, "launch_angle": 17.0, "spin": 5800},
        "8_iron": {"carry": 150, "ball_speed": 110, "launch_angle": 18.5, "spin": 6300},
        "9_iron": {"carry": 140, "ball_speed": 105, "launch_angle": 20.0, "spin": 6800},
        "pw": {"carry": 130, "ball_speed": 100, "launch_angle": 22.0, "spin": 7500},
        "gw": {"carry": 110, "ball_speed": 90, "launch_angle": 25.0, "spin": 8500},
        "sw": {"carry": 90, "ball_speed": 80, "launch_angle": 28.0, "spin": 9500},
        "lw": {"carry": 70, "ball_speed": 70, "launch_angle": 31.0, "spin": 10000},
    },

    "mid": {  # 13-20 handicap
        "driver": {"carry": 230, "ball_speed": 145, "launch_angle": 13.0, "spin": 3200},
        "3_wood": {"carry": 210, "ball_speed": 135, "launch_angle": 12.0, "spin": 3800},
        "5_wood": {"carry": 190, "ball_speed": 127, "launch_angle": 12.5, "spin": 4400},
        "3_iron": {"carry": 175, "ball_speed": 122, "launch_angle": 14.0, "spin": 4700},
        "4_iron": {"carry": 165, "ball_speed": 117, "launch_angle": 15.0, "spin": 5000},
        "5_iron": {"carry": 155, "ball_speed": 112, "launch_angle": 16.0, "spin": 5300},
        "6_iron": {"carry": 145, "ball_speed": 107, "launch_angle": 17.5, "spin": 5800},
        "7_iron": {"carry": 135, "ball_speed": 102, "launch_angle": 19.0, "spin": 6300},
        "8_iron": {"carry": 125, "ball_speed": 97, "launch_angle": 21.0, "spin": 6800},
        "9_iron": {"carry": 115, "ball_speed": 92, "launch_angle": 23.0, "spin": 7300},
        "pw": {"carry": 105, "ball_speed": 87, "launch_angle": 25.0, "spin": 8000},
        "gw": {"carry": 90, "ball_speed": 78, "launch_angle": 27.0, "spin": 9000},
        "sw": {"carry": 75, "ball_speed": 70, "launch_angle": 30.0, "spin": 10000},
        "lw": {"carry": 60, "ball_speed": 62, "launch_angle": 33.0, "spin": 10500},
    },

    "high": {  # 21-36 handicap
        "driver": {"carry": 200, "ball_speed": 132, "launch_angle": 14.0, "spin": 3600},
        "3_wood": {"carry": 180, "ball_speed": 122, "launch_angle": 13.0, "spin": 4200},
        "5_wood": {"carry": 165, "ball_speed": 115, "launch_angle": 13.5, "spin": 4800},
        "3_iron": {"carry": 150, "ball_speed": 110, "launch_angle": 15.0, "spin": 5200},
        "4_iron": {"carry": 140, "ball_speed": 105, "launch_angle": 16.0, "spin": 5500},
        "5_iron": {"carry": 130, "ball_speed": 100, "launch_angle": 17.5, "spin": 5900},
        "6_iron": {"carry": 120, "ball_speed": 95, "launch_angle": 19.0, "spin": 6400},
        "7_iron": {"carry": 110, "ball_speed": 90, "launch_angle": 21.0, "spin": 6900},
        "8_iron": {"carry": 100, "ball_speed": 85, "launch_angle": 23.0, "spin": 7400},
        "9_iron": {"carry": 90, "ball_speed": 80, "launch_angle": 25.0, "spin": 7900},
        "pw": {"carry": 80, "ball_speed": 75, "launch_angle": 27.0, "spin": 8500},
        "gw": {"carry": 70, "ball_speed": 68, "launch_angle": 29.0, "spin": 9500},
        "sw": {"carry": 60, "ball_speed": 62, "launch_angle": 32.0, "spin": 10500},
        "lw": {"carry": 50, "ball_speed": 56, "launch_angle": 35.0, "spin": 11000},
    }
}

# Valid club names for validation
VALID_CLUBS = [
    "driver", "3_wood", "5_wood",
    "3_iron", "4_iron", "5_iron", "6_iron", "7_iron", "8_iron", "9_iron",
    "pw", "gw", "sw", "lw"
]

# Handicap tier boundaries
HANDICAP_TIERS = {
    "scratch": (0, 5),
    "low": (6, 12),
    "mid": (13, 20),
    "high": (21, 36),
}


def get_handicap_tier(handicap: int) -> str:
    """
    Map a handicap value to its tier.

    Args:
        handicap: Player handicap (0-36)

    Returns:
        Tier name: "scratch", "low", "mid", or "high"

    Raises:
        ValueError: If handicap is outside valid range (0-36)
    """
    if handicap < 0 or handicap > 36:
        raise ValueError(f"Handicap must be between 0 and 36, got {handicap}")

    if 0 <= handicap <= 5:
        return "scratch"
    elif 6 <= handicap <= 12:
        return "low"
    elif 13 <= handicap <= 20:
        return "mid"
    else:  # 21-36
        return "high"


def get_stock_parameters(handicap: int, club: str) -> dict:
    """
    Look up stock ball flight parameters for a given handicap and club.

    Args:
        handicap: Player handicap (0-36)
        club: Club name (e.g., "driver", "7_iron", "pw")

    Returns:
        Dict with ball_speed, launch_angle, spin, and carry

    Raises:
        ValueError: If handicap or club is invalid
    """
    if club not in VALID_CLUBS:
        raise ValueError(f"Invalid club '{club}'. Valid clubs: {', '.join(VALID_CLUBS)}")

    tier = get_handicap_tier(handicap)
    return STOCK_DISTANCES[tier][club]
