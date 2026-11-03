param(
    [ValidateSet('ef', 'sql')][string]$Metodo = 'ef'
)
$ErrorActionPreference = 'Stop'
$tutorialRoot = Split-Path -Parent $PSScriptRoot
$project = if ($Metodo -eq 'ef') {
    Join-Path $tutorialRoot '01-ef\ProductsEf\ProductsEf.csproj'
} else {
    Join-Path $tutorialRoot '02-sql\ProductsSql\ProductsSql.csproj'
}

Write-Host 'Pega la cadena Npgsql completa. La entrada permanece oculta.'
Write-Host 'Usa SSL Mode=VerifyFull y Root Certificate con la ruta absoluta del certificado.'
$secureConnection = Read-Host 'ConnectionStrings:Supabase' -AsSecureString
$connectionPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureConnection)
try {
    $connectionValue = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($connectionPointer)
    if ([string]::IsNullOrWhiteSpace($connectionValue)) { throw 'La conexión no puede estar vacía.' }
    $secretJson = @{ 'ConnectionStrings:Supabase' = $connectionValue } | ConvertTo-Json -Compress
    $secretJson | dotnet user-secrets set --project $project | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo guardar User Secrets.' }
    Write-Host 'Conexión guardada fuera del repositorio. User Secrets no cifra el archivo.'
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($connectionPointer)
    $connectionValue = $null
    $secretJson = $null
    $secureConnection.Dispose()
}
