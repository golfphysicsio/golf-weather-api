# Golf Physics API - Production Health Check (PowerShell)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Golf Physics API - Production Health Check" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Test API custom domain
Write-Host "1. Testing API (api.golfphysics.io)..." -ForegroundColor Yellow
try {
    $apiHealth = Invoke-RestMethod -Uri "https://api.golfphysics.io/api/v1/health" -Method Get
    Write-Host "   API Status: $($apiHealth.status)" -ForegroundColor Green
    Write-Host "   Version: $($apiHealth.checks.version)" -ForegroundColor Green
    Write-Host "   Environment: $($apiHealth.checks.environment)" -ForegroundColor Green
    Write-Host "   Redis: $($apiHealth.checks.redis)" -ForegroundColor Green
} catch {
    Write-Host "   API Health Check FAILED: $_" -ForegroundColor Red
}

Write-Host ""

# Test Website
Write-Host "2. Testing Website (www.golfphysics.io)..." -ForegroundColor Yellow
try {
    $websiteResponse = Invoke-WebRequest -Uri "https://www.golfphysics.io" -Method Get -UseBasicParsing
    Write-Host "   Website: $($websiteResponse.StatusCode) OK" -ForegroundColor Green
} catch {
    Write-Host "   Website: FAILED - $_" -ForegroundColor Red
}

Write-Host ""

# Test Gaming Presets
Write-Host "3. Testing Gaming API..." -ForegroundColor Yellow
try {
    $presets = Invoke-RestMethod -Uri "https://api.golfphysics.io/api/v1/gaming/presets" -Method Get
    $presetCount = $presets.count
    if ($presetCount -eq 10) {
        Write-Host "   Gaming presets: $presetCount available" -ForegroundColor Green
    } else {
        Write-Host "   Gaming presets: $presetCount (expected 10)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   Gaming API FAILED: $_" -ForegroundColor Red
}

Write-Host ""

# Compare Staging vs Production
Write-Host "4. Comparing Staging vs Production..." -ForegroundColor Yellow
try {
    $stagingHealth = Invoke-RestMethod -Uri "https://golf-weather-api-staging.up.railway.app/api/v1/health" -Method Get
    $prodHealth = Invoke-RestMethod -Uri "https://api.golfphysics.io/api/v1/health" -Method Get

    Write-Host "   Staging version: $($stagingHealth.checks.version)"
    Write-Host "   Production version: $($prodHealth.checks.version)"

    if ($stagingHealth.checks.version -eq $prodHealth.checks.version) {
        Write-Host "   Versions match" -ForegroundColor Green
    } else {
        Write-Host "   Version mismatch!" -ForegroundColor Red
    }
} catch {
    Write-Host "   Version comparison FAILED: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Production Health Check Complete" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
