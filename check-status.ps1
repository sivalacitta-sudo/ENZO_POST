# 项目状态检查脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  全栈个人博客项目 - 状态检查" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查后端
Write-Host "检查后端服务器..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/posts" -Method GET -UseBasicParsing -TimeoutSec 3
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ 后端服务器运行正常 (http://localhost:3000)" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "  - API 响应正常" -ForegroundColor Gray
        Write-Host "  - 文章数量: $($data.data.total)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ 后端服务器未运行" -ForegroundColor Red
    Write-Host "  提示: 运行 .\start.ps1 启动项目" -ForegroundColor Gray
}

Write-Host ""

# 检查前端（尝试多个端口）
Write-Host "检查前端服务器..." -ForegroundColor Yellow
$frontendPorts = @(5173, 5174, 5175, 5176, 5177, 5178, 5179)
$frontendFound = $false

foreach ($port in $frontendPorts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port" -Method GET -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ 前端服务器运行正常 (http://localhost:$port)" -ForegroundColor Green
            Write-Host "  - 页面加载正常" -ForegroundColor Gray
            $frontendFound = $true
            break
        }
    } catch {
        continue
    }
}

if (-not $frontendFound) {
    Write-Host "✗ 前端服务器未运行" -ForegroundColor Red
    Write-Host "  提示: 运行 .\start.ps1 启动项目" -ForegroundColor Gray
}

Write-Host ""

# 检查数据库文件
Write-Host "检查数据库..." -ForegroundColor Yellow
$dbPath = "server\data\dev.db"
if (Test-Path $dbPath) {
    $dbSize = (Get-Item $dbPath).Length
    Write-Host "✓ 数据库文件存在 ($dbPath)" -ForegroundColor Green
    Write-Host "  - 文件大小: $([math]::Round($dbSize / 1KB, 2)) KB" -ForegroundColor Gray
} else {
    Write-Host "✗ 数据库文件不存在" -ForegroundColor Red
}

Write-Host ""

# 检查依赖
Write-Host "检查依赖安装..." -ForegroundColor Yellow
$clientInstalled = Test-Path "client\node_modules"
$serverInstalled = Test-Path "server\node_modules"

if ($clientInstalled) {
    Write-Host "✓ 前端依赖已安装" -ForegroundColor Green
} else {
    Write-Host "✗ 前端依赖未安装" -ForegroundColor Red
    Write-Host "  提示: cd client; npm install" -ForegroundColor Gray
}

if ($serverInstalled) {
    Write-Host "✓ 后端依赖已安装" -ForegroundColor Green
} else {
    Write-Host "✗ 后端依赖未安装" -ForegroundColor Red
    Write-Host "  提示: cd server; npm install" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  检查完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
