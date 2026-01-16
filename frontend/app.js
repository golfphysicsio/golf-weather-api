// API Configuration
const API_BASE = 'https://golf-weather-api.vercel.app';

// Club data with realistic ball speeds, launch angles, and spin rates
// Based on average amateur golfer data
const CLUB_DATA = {
    'driver':   { ballSpeed: 143, launchAngle: 11.0, spinRate: 2700, carry: 230, name: 'Driver' },
    '3-wood':   { ballSpeed: 132, launchAngle: 11.5, spinRate: 3500, carry: 215, name: '3-Wood' },
    '5-wood':   { ballSpeed: 125, launchAngle: 13.0, spinRate: 4000, carry: 200, name: '5-Wood' },
    '4-iron':   { ballSpeed: 118, launchAngle: 14.0, spinRate: 4500, carry: 185, name: '4-Iron' },
    '5-iron':   { ballSpeed: 113, launchAngle: 15.0, spinRate: 5000, carry: 175, name: '5-Iron' },
    '6-iron':   { ballSpeed: 107, launchAngle: 17.0, spinRate: 5500, carry: 165, name: '6-Iron' },
    '7-iron':   { ballSpeed: 101, launchAngle: 19.0, spinRate: 6500, carry: 155, name: '7-Iron' },
    '8-iron':   { ballSpeed: 95,  launchAngle: 21.0, spinRate: 7500, carry: 145, name: '8-Iron' },
    '9-iron':   { ballSpeed: 89,  launchAngle: 24.0, spinRate: 8500, carry: 135, name: '9-Iron' },
    'pw':       { ballSpeed: 83,  launchAngle: 27.0, spinRate: 9000, carry: 125, name: 'PW' },
    'gw':       { ballSpeed: 76,  launchAngle: 30.0, spinRate: 9500, carry: 110, name: 'GW' },
    'sw':       { ballSpeed: 68,  launchAngle: 33.0, spinRate: 10000, carry: 95, name: 'SW' },
    'lw':       { ballSpeed: 60,  launchAngle: 36.0, spinRate: 10500, carry: 80, name: 'LW' }
};

// Scenario data - club-first approach with realistic physics
const scenarios = [
    {
        id: 0,
        title: "7-Iron • 165 Yards • Strong Headwind",
        description: "Your standard 7-iron flies 165 yards in calm conditions. But what happens when you're facing a 20 mph headwind at sea level? The ball fights through dense air and loses significant distance.",
        club: '7-iron',
        targetCarry: 165,
        conditions: {
            wind_speed_mph: 20,
            wind_direction_deg: 0,  // Pure headwind
            temperature_f: 70,
            altitude_ft: 0,
            humidity_pct: 50,
            pressure_inhg: 29.92
        },
        standardClub: "7-Iron",
        explanation: "The 20 mph headwind is costing you <strong>significant carry distance</strong>. Your 7-iron that normally flies 165 yards will come up well short. <strong>Club up two clubs</strong> to reach your target. The ball will land steeper which means <strong>less roll</strong> - that's helpful for holding the green."
    },
    {
        id: 1,
        title: "6-Iron • 175 Yards • Denver Summer",
        description: "Playing at 5,280 feet in the Colorado summer. The thin, warm air means your ball will fly much further than the yardage suggests - but how much further?",
        club: '6-iron',
        targetCarry: 175,
        conditions: {
            wind_speed_mph: 5,
            wind_direction_deg: 180,  // Slight tailwind
            temperature_f: 85,
            altitude_ft: 5280,
            humidity_pct: 25,
            pressure_inhg: 29.5
        },
        standardClub: "6-Iron",
        explanation: "At 5,280 feet (one mile high), the air is <strong>15-17% thinner</strong> than at sea level. Combined with the warm 85°F temperature and slight tailwind, your ball will fly significantly further. <strong>Club down</strong> - your 6-iron will play like a 5-iron here."
    },
    {
        id: 2,
        title: "8-Iron • 150 Yards • Cold Morning",
        description: "An early morning tee time in 45°F weather. Cold air is dense air, and your ball won't fly as far. Plus the ball itself is colder and less responsive.",
        club: '8-iron',
        targetCarry: 150,
        conditions: {
            wind_speed_mph: 5,
            wind_direction_deg: 0,  // Light headwind
            temperature_f: 45,
            altitude_ft: 500,
            humidity_pct: 70,
            pressure_inhg: 30.1
        },
        standardClub: "8-Iron",
        explanation: "Cold 45°F air is <strong>significantly denser</strong> than warm air, creating more drag on your ball. Combined with the light headwind, expect to lose distance. <strong>Take one more club</strong> than normal. Pro tip: keep your balls warm in your pocket between shots."
    },
    {
        id: 3,
        title: "9-Iron • 140 Yards • Crosswind",
        description: "A 15 mph left-to-right crosswind. The ball will drift sideways during flight. How much should you aim left to compensate?",
        club: '9-iron',
        targetCarry: 140,
        conditions: {
            wind_speed_mph: 15,
            wind_direction_deg: 90,  // Left-to-right
            temperature_f: 72,
            altitude_ft: 300,
            humidity_pct: 55,
            pressure_inhg: 29.92
        },
        standardClub: "9-Iron",
        explanation: "The 15 mph crosswind will push your ball <strong>significantly right</strong> during its 4+ seconds of flight. Aim left of your target to allow for the drift. Distance won't change much, but <strong>accuracy is the challenge</strong> here."
    },
    {
        id: 4,
        title: "Pebble Beach #7 • PW • 107 Yards",
        description: "The famous downhill par 3 overlooking the Pacific Ocean. Coastal winds swirl around this exposed green, making club selection tricky even for the pros.",
        club: 'pw',
        targetCarry: 107,
        conditions: {
            wind_speed_mph: 15,
            wind_direction_deg: 45,  // Quartering headwind from left
            temperature_f: 58,
            altitude_ft: 75,
            humidity_pct: 75,
            pressure_inhg: 30.0
        },
        standardClub: "PW",
        explanation: "The quartering wind off the Pacific costs you distance AND pushes the ball right. The cool, humid coastal air is dense. <strong>Club up to a 9-iron</strong> and aim at the left edge - let the wind bring it back. The tiny green demands precision."
    },
    {
        id: 5,
        title: "St Andrews #11 • 7-Iron • 172 Yards",
        description: "The Old Course's famous par 3, with its hidden Strath bunker and swirling Scottish winds. Links golf at its finest - and most unpredictable.",
        club: '7-iron',
        targetCarry: 172,
        conditions: {
            wind_speed_mph: 22,
            wind_direction_deg: 315,  // Quartering headwind from right
            temperature_f: 52,
            altitude_ft: 30,
            humidity_pct: 80,
            pressure_inhg: 29.8
        },
        standardClub: "7-Iron",
        explanation: "Scottish links wind is relentless. The 22 mph quartering wind costs distance AND pushes left. Cold, damp air adds drag. <strong>Take two extra clubs</strong> and hit a lower, punchy shot to reduce wind effect. Aim right and let the wind work the ball back."
    },
    {
        id: 6,
        title: "TPC Sawgrass #17 • 9-Iron • 137 Yards",
        description: "The most famous island green in golf. Wind swirls in the amphitheater setting, and there's no bailout. Miss the green and you're wet.",
        club: '9-iron',
        targetCarry: 137,
        conditions: {
            wind_speed_mph: 12,
            wind_direction_deg: 225,  // Back-right quartering (helping, pushing left)
            temperature_f: 78,
            altitude_ft: 15,
            humidity_pct: 70,
            pressure_inhg: 29.95
        },
        standardClub: "9-Iron",
        explanation: "The helping wind will add distance - <strong>don't fly it over the green into the water</strong>. The wind also pushes left, so favor the right side. Humid Florida air helps slightly. <strong>Take less club</strong> and aim right-center. The Sunday pin is always back-left for drama."
    }
];

// Current state
let currentScenario = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadScenario(0);
    setupSliderListeners();
});

// Get shot parameters from club and target carry
function getShotParams(clubKey, targetCarry) {
    const club = CLUB_DATA[clubKey];
    // Scale ball speed based on target carry vs standard carry
    const carryRatio = targetCarry / club.carry;
    return {
        ball_speed_mph: Math.round(club.ballSpeed * Math.sqrt(carryRatio)),
        launch_angle_deg: club.launchAngle,
        spin_rate_rpm: club.spinRate,
        spin_axis_deg: 0,
        direction_deg: 0
    };
}

// Load a preset scenario
async function loadScenario(index) {
    currentScenario = index;
    const scenario = scenarios[index];

    // Update active state on sidebar
    document.querySelectorAll('.scenario-card').forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });

    // Update header
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-description').textContent = scenario.description;

    // Get shot parameters based on club and target carry
    const shot = getShotParams(scenario.club, scenario.targetCarry);

    // Show loading
    showLoading();

    try {
        // Call API
        const response = await fetch(`${API_BASE}/v1/trajectory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shot: shot,
                conditions: scenario.conditions
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        updateDisplay(data, scenario);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to calculate trajectory. Please try again.');
    } finally {
        hideLoading();
    }
}

// Update the display with API results
function updateDisplay(data, scenario) {
    const baseline = data.baseline;
    const adjusted = data.adjusted;
    const impact = data.impact_breakdown;
    const conditions = scenario.conditions;

    // Standard stats (baseline)
    document.getElementById('std-carry').textContent = Math.round(baseline.carry_yards);
    document.getElementById('std-total').textContent = Math.round(baseline.total_yards);
    document.getElementById('std-apex').textContent = Math.round(baseline.apex_height_yards);
    document.getElementById('std-drift').textContent = Math.round(Math.abs(baseline.lateral_drift_yards));
    document.getElementById('std-flight').textContent = baseline.flight_time_seconds.toFixed(1);
    document.getElementById('std-land').textContent = Math.round(baseline.landing_angle_deg) + '°';
    document.getElementById('std-club').textContent = scenario.standardClub;

    // Adjusted stats
    document.getElementById('adj-carry').textContent = Math.round(adjusted.carry_yards);
    document.getElementById('adj-total').textContent = Math.round(adjusted.total_yards);
    document.getElementById('adj-apex').textContent = Math.round(adjusted.apex_height_yards);
    document.getElementById('adj-drift').textContent = Math.round(Math.abs(adjusted.lateral_drift_yards));
    document.getElementById('adj-flight').textContent = adjusted.flight_time_seconds.toFixed(1);
    document.getElementById('adj-land').textContent = Math.round(adjusted.landing_angle_deg) + '°';

    // Calculate recommended club
    const carryDiff = adjusted.carry_yards - baseline.carry_yards;
    const driftYards = Math.abs(adjusted.lateral_drift_yards);
    document.getElementById('adj-club').textContent = getClubRecommendation(scenario.standardClub, carryDiff, driftYards);

    // Deltas
    updateDelta('delta-carry', adjusted.carry_yards - baseline.carry_yards);
    updateDelta('delta-total', adjusted.total_yards - baseline.total_yards);
    updateDelta('delta-apex', adjusted.apex_height_yards - baseline.apex_height_yards);
    updateDelta('delta-drift', adjusted.lateral_drift_yards, true);
    updateDelta('delta-flight', adjusted.flight_time_seconds - baseline.flight_time_seconds);
    updateDelta('delta-land', adjusted.landing_angle_deg - baseline.landing_angle_deg, false, '°');

    // Conditions pills
    document.getElementById('cond-temp').textContent = `🌡️ ${conditions.temperature_f}°F`;
    document.getElementById('cond-wind').textContent = `💨 ${conditions.wind_speed_mph} mph ${getWindDirectionText(conditions.wind_direction_deg)}`;
    document.getElementById('cond-altitude').textContent = conditions.altitude_ft > 100 ? `⛰️ ${conditions.altitude_ft.toLocaleString()} ft` : '⛰️ Sea level';
    document.getElementById('cond-humidity').textContent = `💧 ${conditions.humidity_pct}% humidity`;

    // Impact breakdown
    updateImpactBar('wind', impact.wind_effect_yards);
    updateImpactBar('temp', impact.temperature_effect_yards);
    updateImpactBar('altitude', impact.altitude_effect_yards);
    updateImpactBar('humidity', impact.humidity_effect_yards);

    // Explanation
    document.getElementById('explanation-text').innerHTML = scenario.explanation;
}

// Get club recommendation based on distance difference
function getClubRecommendation(originalClub, carryDiff, driftYards) {
    const clubOrder = ['LW', 'SW', 'GW', 'PW', '9-Iron', '8-Iron', '7-Iron', '6-Iron', '5-Iron', '4-Iron', '5-Wood', '3-Wood', 'Driver'];
    const currentIndex = clubOrder.findIndex(c => c.toLowerCase() === originalClub.toLowerCase());

    let recommendation = '';

    if (Math.abs(carryDiff) < 5) {
        recommendation = `${originalClub} (same club)`;
    } else if (carryDiff < -15) {
        const newIndex = Math.min(currentIndex + 2, clubOrder.length - 1);
        recommendation = `${clubOrder[newIndex]} (+2 clubs)`;
    } else if (carryDiff < -8) {
        const newIndex = Math.min(currentIndex + 1, clubOrder.length - 1);
        recommendation = `${clubOrder[newIndex]} (+1 club)`;
    } else if (carryDiff > 15) {
        const newIndex = Math.max(currentIndex - 2, 0);
        recommendation = `${clubOrder[newIndex]} (-2 clubs)`;
    } else if (carryDiff > 8) {
        const newIndex = Math.max(currentIndex - 1, 0);
        recommendation = `${clubOrder[newIndex]} (-1 club)`;
    } else {
        recommendation = originalClub;
    }

    // Add drift advice if significant
    if (driftYards > 5) {
        const direction = driftYards > 0 ? 'left' : 'right';
        recommendation += `, aim ${Math.round(driftYards)}yds ${direction}`;
    }

    return recommendation;
}

// Helper: Update delta display
function updateDelta(id, value, absolute = false, suffix = '') {
    const el = document.getElementById(id);
    const displayValue = absolute ? value : value;
    const sign = displayValue >= 0 ? '+' : '';
    el.textContent = `${sign}${displayValue.toFixed(1)}${suffix}`;
    el.className = 'stat-delta ' + (displayValue < -0.5 ? 'negative' : displayValue > 0.5 ? 'positive' : '');
}

// Helper: Update impact bar
function updateImpactBar(type, value) {
    const bar = document.getElementById(`bar-${type}`);
    const valueEl = document.getElementById(`impact-${type}`);

    const maxEffect = 20; // Max yards for full bar
    const width = Math.min(Math.abs(value) / maxEffect * 100, 100);

    bar.style.width = `${width}%`;
    bar.className = `impact-bar ${value < 0 ? 'negative' : 'positive'}`;

    const sign = value >= 0 ? '+' : '';
    valueEl.textContent = `${sign}${value.toFixed(1)} yds`;
    valueEl.style.color = value < 0 ? 'var(--negative)' : 'var(--positive)';
}

// Helper: Get wind direction text
function getWindDirectionText(deg) {
    if (deg >= 337.5 || deg < 22.5) return 'headwind';
    if (deg >= 22.5 && deg < 67.5) return 'quartering head-left';
    if (deg >= 67.5 && deg < 112.5) return 'L-to-R crosswind';
    if (deg >= 112.5 && deg < 157.5) return 'quartering tail-left';
    if (deg >= 157.5 && deg < 202.5) return 'tailwind';
    if (deg >= 202.5 && deg < 247.5) return 'quartering tail-right';
    if (deg >= 247.5 && deg < 292.5) return 'R-to-L crosswind';
    if (deg >= 292.5 && deg < 337.5) return 'quartering head-right';
    return '';
}

// Custom panel functions
function showCustomPanel() {
    document.getElementById('custom-panel').classList.add('active');
    document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector('.custom-card').classList.add('active');
}

function hideCustomPanel() {
    document.getElementById('custom-panel').classList.remove('active');
}

// Update carry distance when club changes
function updateClubDistance() {
    const select = document.getElementById('club-select');
    const option = select.options[select.selectedIndex];
    const carry = option.getAttribute('data-carry');
    document.getElementById('carry-distance').value = carry;
}

// Setup slider listeners
function setupSliderListeners() {
    // Temperature
    const tempSlider = document.getElementById('temperature');
    const tempVal = document.getElementById('temperature-val');
    tempSlider.addEventListener('input', () => {
        tempVal.textContent = `${tempSlider.value}°F`;
    });

    // Wind speed
    const windSlider = document.getElementById('wind-speed');
    const windVal = document.getElementById('wind-speed-val');
    windSlider.addEventListener('input', () => {
        windVal.textContent = `${windSlider.value} mph`;
    });

    // Altitude
    const altSlider = document.getElementById('altitude');
    const altVal = document.getElementById('altitude-val');
    altSlider.addEventListener('input', () => {
        const alt = parseInt(altSlider.value);
        altVal.textContent = alt === 0 ? 'Sea level' : `${alt.toLocaleString()} ft`;
    });

    // Humidity
    const humSlider = document.getElementById('humidity');
    const humVal = document.getElementById('humidity-val');
    humSlider.addEventListener('input', () => {
        humVal.textContent = `${humSlider.value}%`;
    });
}

// Simulate custom scenario
async function simulateCustom() {
    const clubSelect = document.getElementById('club-select');
    const clubKey = clubSelect.value;
    const clubName = CLUB_DATA[clubKey].name;
    const targetCarry = parseInt(document.getElementById('carry-distance').value);

    const conditions = {
        wind_speed_mph: parseFloat(document.getElementById('wind-speed').value),
        wind_direction_deg: parseFloat(document.getElementById('wind-direction').value),
        temperature_f: parseFloat(document.getElementById('temperature').value),
        altitude_ft: parseFloat(document.getElementById('altitude').value),
        humidity_pct: parseFloat(document.getElementById('humidity').value),
        pressure_inhg: 29.92
    };

    const shot = getShotParams(clubKey, targetCarry);

    // Update header
    document.getElementById('scenario-title').textContent = `${clubName} • ${targetCarry} Yards • Custom Conditions`;
    document.getElementById('scenario-description').textContent =
        `Testing your ${clubName} that carries ${targetCarry} yards in calm conditions. See how your custom weather conditions affect the shot.`;

    showLoading();
    hideCustomPanel();

    try {
        const response = await fetch(`${API_BASE}/v1/trajectory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shot, conditions })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();

        // Create custom scenario for display
        const customScenario = {
            conditions,
            standardClub: clubName,
            explanation: generateCustomExplanation(data, conditions)
        };

        updateDisplay(data, customScenario);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to calculate trajectory. Please try again.');
    } finally {
        hideLoading();
    }
}

// Generate explanation for custom scenario
function generateCustomExplanation(data, conditions) {
    const impact = data.impact_breakdown;
    const parts = [];

    // Wind effect
    if (Math.abs(impact.wind_effect_yards) > 3) {
        const effect = impact.wind_effect_yards < 0 ? 'costing' : 'adding';
        parts.push(`The wind is ${effect} you <strong>${Math.abs(impact.wind_effect_yards).toFixed(0)} yards</strong>`);
    }

    // Temperature effect
    if (Math.abs(impact.temperature_effect_yards) > 2) {
        if (conditions.temperature_f < 60) {
            parts.push(`Cold ${conditions.temperature_f}°F air is dense, reducing distance by <strong>${Math.abs(impact.temperature_effect_yards).toFixed(0)} yards</strong>`);
        } else if (conditions.temperature_f > 85) {
            parts.push(`Hot ${conditions.temperature_f}°F air is thin, adding <strong>${impact.temperature_effect_yards.toFixed(0)} yards</strong>`);
        }
    }

    // Altitude effect
    if (impact.altitude_effect_yards > 3) {
        parts.push(`The ${conditions.altitude_ft.toLocaleString()} ft altitude adds <strong>${impact.altitude_effect_yards.toFixed(0)} yards</strong> due to thinner air`);
    }

    // Drift
    const drift = Math.abs(data.adjusted.lateral_drift_yards);
    if (drift > 5) {
        const direction = data.adjusted.lateral_drift_yards > 0 ? 'right' : 'left';
        parts.push(`Expect <strong>${drift.toFixed(0)} yards of ${direction} drift</strong>`);
    }

    // Net effect
    const total = impact.total_adjustment_yards;
    if (Math.abs(total) > 2) {
        const netEffect = total > 0 ? 'further' : 'shorter';
        parts.push(`<strong>Net effect: ${Math.abs(total).toFixed(0)} yards ${netEffect}</strong> than calm conditions`);
    } else {
        parts.push(`<strong>Net effect: minimal change</strong> from calm conditions`);
    }

    return parts.join('. ') + '.';
}

// Modal functions
function showPlaceholder(feature) {
    document.getElementById('modal-title').textContent = feature;
    document.getElementById('modal-text').textContent =
        `The ${feature} feature is coming soon. This is a placeholder for future development.`;
    document.getElementById('modal-overlay').classList.add('active');
}

function hideModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// Loading functions
function showLoading() {
    document.getElementById('loading').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}
