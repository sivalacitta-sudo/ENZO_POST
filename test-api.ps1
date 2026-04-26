# Test script for the blog CMS
Write-Host "Testing Blog CMS API..." -ForegroundColor Cyan

# Test 1: Check if backend is running
Write-Host "`nTest 1: Checking backend server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/posts" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Backend server is running" -ForegroundColor Green
    } else {
        Write-Host "✗ Backend server returned status code: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Backend server is not accessible: $_" -ForegroundColor Red
}

# Test 2: Check if frontend is running
Write-Host "`nTest 2: Checking frontend server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5179" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Frontend server is running" -ForegroundColor Green
    } else {
        Write-Host "✗ Frontend server returned status code: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Frontend server is not accessible: $_" -ForegroundColor Red
}

# Test 3: Test registration endpoint
Write-Host "`nTest 3: Testing user registration..." -ForegroundColor Yellow
try {
    $body = @{
        username = "testuser"
        password = "testpass123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    if ($response.StatusCode -eq 201) {
        Write-Host "✓ User registration works" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "  Created user: $($data.data.user.username)" -ForegroundColor Gray
    } else {
        Write-Host "✗ User registration failed with status code: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ User registration failed: $_" -ForegroundColor Red
}

# Test 4: Test login endpoint
Write-Host "`nTest 4: Testing user login..." -ForegroundColor Yellow
try {
    $body = @{
        username = "testuser"
        password = "testpass123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ User login works" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "  Token received: $($data.data.token.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        Write-Host "✗ User login failed with status code: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ User login failed: $_" -ForegroundColor Red
}

Write-Host "`nAll tests completed!" -ForegroundColor Cyan
