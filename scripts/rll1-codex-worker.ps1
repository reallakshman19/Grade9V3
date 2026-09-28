param(
    [Parameter(Mandatory=$true)][string]$RepoRoot,
    [Parameter(Mandatory=$true)][string]$CommonRoot,
    [string]$Repository = "reallaksh19/Grade9V3",
    [string]$WorkerId = "codex-local",
    [string]$AuthorizedLogin = "reallaksh19",
    [string]$CodexUser = "",
    [string]$CodexHome = "",
    [string]$DataDir = "",
    [ValidateSet("low","medium","high")][string]$Effort = "high",
    [string]$PrintTimeout = "2h",
    [switch]$Smoke
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RequiredCommonBasis = "1ced68258afeaf50df113b1d38a4ceb9193587e3"
$Worker = Join-Path $CommonRoot "skills/engineering-pr-delivery-v3.1/scripts/rll_worker.py"

foreach ($name in @("GH_TOKEN","GITHUB_TOKEN","GH_ENTERPRISE_TOKEN","GITHUB_ENTERPRISE_TOKEN")) {
    if (Test-Path "Env:$name") {
        throw "RLL credential boundary: $name must not be present in the scheduled worker environment."
    }
}

foreach ($command in @("git","gh","python","codex")) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Missing required command: $command"
    }
}

if (-not (Test-Path $RepoRoot -PathType Container)) { throw "RepoRoot does not exist: $RepoRoot" }
if (-not (Test-Path $CommonRoot -PathType Container)) { throw "CommonRoot does not exist: $CommonRoot" }
if (-not (Test-Path $Worker -PathType Leaf)) { throw "Common RLL worker is missing: $Worker" }

& git -C $RepoRoot rev-parse --git-dir | Out-Null
if ($LASTEXITCODE -ne 0) { throw "RepoRoot is not a Git repository." }

& git -C $CommonRoot merge-base --is-ancestor $RequiredCommonBasis HEAD
if ($LASTEXITCODE -ne 0) {
    throw "Common checkout does not contain required basis $RequiredCommonBasis as an ancestor of HEAD."
}

& gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) { throw "GitHub CLI authentication is unavailable." }

if ($CodexUser) {
    if (-not (Get-Command sudo -ErrorAction SilentlyContinue)) {
        throw "Dedicated Codex user requires Linux/WSL with sudo."
    }
    if (-not $CodexHome) { $CodexHome = "/home/$CodexUser/.codex-rll" }
    & sudo -n -u $CodexUser env "CODEX_HOME=$CodexHome" "HOME=/home/$CodexUser" codex login status | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Codex login unavailable for dedicated user $CodexUser." }
} else {
    if ($CodexHome) { $env:CODEX_HOME = $CodexHome }
    & codex login status | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Codex login unavailable." }
}

$args = @(
    $Worker,
    "--repo-root", $RepoRoot,
    "--repository", $Repository,
    "--worker-id", $WorkerId,
    "--authorized-login", $AuthorizedLogin,
    "--executor", "codex",
    "--print-timeout", $PrintTimeout,
    "--effort", $Effort
)

if ($DataDir) { $args += @("--data-dir", $DataDir) }
if ($CodexUser) { $args += @("--codex-user", $CodexUser) }
if ($CodexHome) { $args += @("--codex-home", $CodexHome) }
if ($Smoke) { $args += "--smoke" }

& python @args
exit $LASTEXITCODE
