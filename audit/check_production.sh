#!/bin/bash

echo "=========================================="
echo "Golf Physics API - Production Health Check"
echo "=========================================="
echo ""

# Test API custom domain
echo "1. Testing API (api.golfphysics.io)..."
API_HEALTH=$(curl -s https://api.golfphysics.io/api/v1/health)
API_STATUS=$(echo $API_HEALTH | jq -r '.status' 2>/dev/null || echo "FAILED")
API_VERSION=$(echo $API_HEALTH | jq -r '.checks.version' 2>/dev/null || echo "FAILED")
API_ENV=$(echo $API_HEALTH | jq -r '.checks.environment' 2>/dev/null || echo "FAILED")

if [ "$API_STATUS" = "healthy" ]; then
    echo "   API Status: $API_STATUS"
    echo "   Version: $API_VERSION"
    echo "   Environment: $API_ENV"
else
    echo "   API Health Check FAILED"
fi

echo ""

# Test Website
echo "2. Testing Website (www.golfphysics.io)..."
WEBSITE_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://www.golfphysics.io)

if [ "$WEBSITE_CODE" = "200" ]; then
    echo "   Website: $WEBSITE_CODE OK"
else
    echo "   Website: $WEBSITE_CODE (expected 200)"
fi

echo ""

# Test Gaming Presets
echo "3. Testing Gaming API..."
PRESETS=$(curl -s https://api.golfphysics.io/api/v1/gaming/presets | jq -r '.presets | length' 2>/dev/null || echo "0")

if [ "$PRESETS" = "10" ]; then
    echo "   Gaming presets: $PRESETS available"
else
    echo "   Gaming presets: $PRESETS (expected 10)"
fi

echo ""

# Compare Staging vs Production
echo "4. Comparing Staging vs Production..."
STAGING_VER=$(curl -s https://golf-weather-api-staging.up.railway.app/api/v1/health | jq -r '.checks.version' 2>/dev/null)
PROD_VER=$(curl -s https://api.golfphysics.io/api/v1/health | jq -r '.checks.version' 2>/dev/null)

echo "   Staging version: $STAGING_VER"
echo "   Production version: $PROD_VER"

if [ "$STAGING_VER" = "$PROD_VER" ]; then
    echo "   Versions match"
else
    echo "   Version mismatch!"
fi

echo ""
echo "=========================================="
echo "Production Health Check Complete"
echo "=========================================="
