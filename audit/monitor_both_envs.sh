#!/bin/bash

echo "=== Environment Monitor ==="
date
echo ""

# Function to check environment
check_env() {
    local NAME=$1
    local URL=$2

    echo "[$NAME]"

    HEALTH=$(curl -s $URL/api/v1/health 2>/dev/null)

    if [ -n "$HEALTH" ]; then
        STATUS=$(echo $HEALTH | jq -r '.status' 2>/dev/null || echo "ERROR")
        VERSION=$(echo $HEALTH | jq -r '.checks.version' 2>/dev/null || echo "ERROR")
        REDIS=$(echo $HEALTH | jq -r '.checks.redis' 2>/dev/null || echo "ERROR")
        ENV=$(echo $HEALTH | jq -r '.checks.environment' 2>/dev/null || echo "ERROR")

        echo "  Status: $STATUS"
        echo "  Version: $VERSION"
        echo "  Environment: $ENV"
        echo "  Redis: $REDIS"

        if [ "$STATUS" = "healthy" ] && [ "$REDIS" = "healthy" ]; then
            echo "  All systems operational"
        else
            echo "  ISSUES DETECTED"
        fi
    else
        echo "  CANNOT REACH $URL"
    fi

    echo ""
}

# Check both environments
check_env "STAGING" "https://golf-weather-api-staging.up.railway.app"
check_env "PRODUCTION" "https://api.golfphysics.io"

echo "=== Monitor Complete ==="
