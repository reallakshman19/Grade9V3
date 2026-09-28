param(
    [Parameter(Mandatory=$true)][string]$RepoRoot,
    [Parameter(Mandatory=$true)][string]$CommonRoot,
    [Parameter(Mandatory=$true)][int]$PilotIssue,
    [string]$Repository = "reallaksh19/Grade9V3",
    [string]$AuthorizedLogin = "reallaksh19",
    [string]$CodexUser = "",
    [string]$CodexHome = "",
    [string]$TaskName = "Grade9V3-RLL1-Codex",
    [string]$DataDir = "",
    [switch]$EnableExecution
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RequiredCommonBasis = "22d365839e64c19c7ba606e2cf4edc6b9cc2999f"
$SourceWorker = Join-Path $RepoRoot "scripts/rll1-codex-worker.ps1"

function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Missing required command: $Name"
    }
}

foreach ($name in @("GH_TOKEN","GITHUB_TOKEN","GH_ENTERPRISE_TOKEN","GITHUB_ENTERPRISE_TOKEN")) {
    if (Test-Path "Env:$name") {
        throw "Use gh auth login --web and the OS credential store; $name must not be present."
    }
}

foreach ($command in @("git","gh","python","codex")) { Require-Command $command }
if (-not (Get-Command Register-ScheduledTask -ErrorAction SilentlyContinue)) {
    throw "Windows Task Scheduler cmdlets are unavailable."
}
if (-not (Test-Path $SourceWorker -PathType Leaf)) {
    throw "Missing repository Codex wrapper: $SourceWorker"
}
if (-not (Test-Path $CommonRoot -PathType Container)) {
    throw "CommonRoot does not exist: $CommonRoot"
}

& git -C $CommonRoot merge-base --is-ancestor $RequiredCommonBasis HEAD
if ($LASTEXITCODE -ne 0) {
    throw "Common checkout does not contain required basis $RequiredCommonBasis."
}

& gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI authentication is unavailable."
}

if ($CodexUser) {
    Require-Command "wsl.exe"
    & wsl.exe --exec bash -lc "command -v sudo >/dev/null && command -v codex >/dev/null"
    if ($LASTEXITCODE -ne 0) {
        throw "WSL2/Linux Codex/sudo prerequisites are unavailable."
    }
} else {
    if ($CodexHome) { $env:CODEX_HOME = $CodexHome }
    & codex login status | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Codex login unavailable."
    }
}

$issue = (gh issue view $PilotIssue --repo $Repository --json state,labels,comments,title) | ConvertFrom-Json
if ($issue.state -ne "OPEN") {
    throw "Pilot issue #$PilotIssue must be OPEN."
}
if (@($issue.labels | ForEach-Object { $_.name } | Where-Object { $_ -eq "rll-review-ready" }).Count -gt 0) {
    throw "Pilot issue #$PilotIssue already reached review-ready; use a fresh smoke issue."
}
if (($issue.comments | ConvertTo-Json -Depth 8) -match "REVIEW_READY|CANCELLED") {
    throw "Pilot issue #$PilotIssue has prior terminal RLL state; use a fresh smoke issue."
}

$labels = @(
    @{ Name="rll-ready"; Color="1D76DB"; Description="RLL-1 eligible for unattended execution" },
    @{ Name="rll-active"; Color="FBCA04"; Description="RLL-1 transport execution active" },
    @{ Name="rll-review-ready"; Color="0E8A16"; Description="RLL-1 evidence cycle complete; independent review required" },
    @{ Name="rll-escalation"; Color="D93F0B"; Description="RLL-1 transport requires coordinator review" }
)
foreach ($label in $labels) {
    & gh label create $label.Name --repo $Repository --color $label.Color --description $label.Description --force | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to create/update label $($label.Name)."
    }
}

$root = if ($DataDir) { $DataDir } else { Join-Path $env:LOCALAPPDATA "Grade9V3-RLL1" }
New-Item -ItemType Directory -Force -Path $root | Out-Null
$installedWorker = Join-Path $root "rll1-codex-worker.ps1"
Copy-Item -Force $SourceWorker $installedWorker

$runner = Join-Path $root "run.ps1"
$smokeSwitch = if ($EnableExecution) { "" } else { " -Smoke" }
$codexUserArg = if ($CodexUser) { " -CodexUser '$CodexUser'" } else { "" }
$codexHomeArg = if ($CodexHome) { " -CodexHome '$CodexHome'" } else { "" }
$dataArg = " -DataDir '$root'"
$invokeLine = "& '$installedWorker' -RepoRoot '$RepoRoot' -CommonRoot '$CommonRoot' -Repository '$Repository' -AuthorizedLogin '$AuthorizedLogin'$codexUserArg$codexHomeArg$dataArg$smokeSwitch"
Set-Content -Path $runner -Value @(
    '$ErrorActionPreference = "Stop"',
    $invokeLine,
    'exit $LASTEXITCODE'
) -Encoding UTF8

$actionArgs = "-NoProfile -ExecutionPolicy Bypass -File " + [char]34 + $runner + [char]34
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $actionArgs
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 10)
$settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -StartWhenAvailable
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null

if (-not $EnableExecution) {
    Write-Host "Installed in smoke mode. Review smoke evidence before re-running with -EnableExecution."
} else {
    Write-Host "Execution enabled for already-authorized RLL work; merge/release authority is unchanged."
}
Write-Host "Task: $TaskName"
Write-Host "Runner: $runner"
Write-Host "Pilot issue: #$PilotIssue"
