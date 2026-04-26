# 将用户提升为管理员的脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  用户权限提升工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 获取用户名
$username = Read-Host "请输入要提升为管理员的用户名"

if (-not $username) {
    Write-Host "错误: 用户名不能为空" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "正在连接数据库..." -ForegroundColor Yellow

# 使用 Node.js 脚本更新数据库
$nodeScript = @"
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'data', 'dev.db');
const db = new sqlite3.Database(dbPath);

const username = '$username';

console.log('查询用户:', username);

db.get('SELECT id, username, role FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
        console.error('查询错误:', err.message);
        db.close();
        process.exit(1);
    }
    
    if (!row) {
        console.error('用户不存在:', username);
        db.close();
        process.exit(1);
    }
    
    console.log('找到用户:', row);
    console.log('当前角色:', row.role);
    
    if (row.role === 'admin') {
        console.log('该用户已经是管理员');
        db.close();
        process.exit(0);
    }
    
    // 更新为 admin
    db.run('UPDATE users SET role = ? WHERE id = ?', ['admin', row.id], (err) => {
        if (err) {
            console.error('更新错误:', err.message);
            db.close();
            process.exit(1);
        }
        
        console.log('✓ 成功将用户', username, '提升为管理员');
        console.log('请重新登录以获取新的权限');
        db.close();
    });
});
"@

# 保存并执行脚本
$scriptPath = Join-Path $PWD "upgrade-admin.ps1.temp.js"
$nodeScript | Set-Content $scriptPath -Encoding UTF8

try {
    node $scriptPath
} catch {
    Write-Host "执行失败: $_" -ForegroundColor Red
} finally {
    Remove-Item $scriptPath -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
