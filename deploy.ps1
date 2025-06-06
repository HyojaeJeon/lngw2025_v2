# ──────────────────────────────────────────────────────────────────────────
# deploy.ps1
# Git pull → Docker Compose 재빌드 & 재실행
# ──────────────────────────────────────────────────────────────────────────

param (
    [string]$Branch = "main"
)

# 1) 프로젝트 루트 경로
$projectRoot = "D:\projects\lngw2025_v2"

Set-Location -Path $projectRoot

# 2) Git fetch / pull
git fetch origin
$local = git rev-parse $Branch
$remote = git rev-parse origin/$Branch
if ($local -ne $remote) {
    Write-Host "[Deploy] Pulling latest from origin/$Branch..."
    git pull origin $Branch
}
else {
    Write-Host "[Deploy] Already up-to-date on $Branch."
}

# 3) Docker Compose 재시작
Write-Host "[Deploy] Rebuilding and restarting Docker Compose services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 4) 완료 메시지
Write-Output "[Deploy] Completed at $(Get-Date -Format o)"
