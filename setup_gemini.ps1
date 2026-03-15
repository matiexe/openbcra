# Script de Reinstalación para Gemini CLI
# Ejecuta este script en una nueva instalación para replicar tu entorno actual.

Write-Host "Iniciando instalación de Agent Skills..." -ForegroundColor Cyan

$skills = @(
    "bcra-transparencia",
    "expense-report-generator",
    "find-skills",
    "frontend-design",
    "gemini-api-dev",
    "git-commit",
    "git-workflows",
    "react-frontend-expert",
    "release",
    "visualizing-data"
)

foreach ($skill in $skills) {
    Write-Host "Instalando skill: $skill..." -ForegroundColor Yellow
    gemini skills install $skill
}

Write-Host "`nVerificando instalación de skills..." -ForegroundColor Cyan
gemini skills list

Write-Host "`nProceso completado." -ForegroundColor Green
Write-Host "Nota: Si alguna extensión de la galería no se instaló, puedes usar 'gemini extensions install <nombre>'."
