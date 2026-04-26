# 快速启动脚本 - 全栈个人博客项目
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  全栈个人博客项目 - 快速启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在正确的目录
if (-not (Test-Path "client") -or -not (Test-Path "server")) {
    Write-Host "错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 启动后端
Write-Host "[1/2] 启动后端服务器..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm run start:dev"
Write-Host "✓ 后端服务器正在启动 (http://localhost:3000)" -ForegroundColor Green
Start-Sleep -Seconds 2

# 启动前端
Write-Host "[2/2] 启动前端服务器..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; npm run dev"
Write-Host "✓ 前端服务器正在启动 (http://localhost:5173)" -ForegroundColor Green
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  启动完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "后端 API: http://localhost:3000/api" -ForegroundColor White
Write-Host "前端应用: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "提示: 两个终端窗口已打开，分别运行后端和前端" -ForegroundColor Gray
Write-Host "按 Ctrl+C 可以停止服务器" -ForegroundColor Gray
Write-Host ""
