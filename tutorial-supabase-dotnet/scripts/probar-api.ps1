param([string]$BaseUrl = 'http://localhost:5080')
$ErrorActionPreference = 'Stop'
$body = @{ name = 'Cuaderno'; price = 12.50 } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "$BaseUrl/products" -Method Post -ContentType 'application/json' -Body $body -UseBasicParsing
if ([int]$response.StatusCode -ne 201) { throw 'POST debe devolver 201.' }
$created = $response.Content | ConvertFrom-Json
$products = @(Invoke-RestMethod -Uri "$BaseUrl/products")
if (-not ($products | Where-Object { $_.id -eq $created.id -and $_.name -eq 'Cuaderno' -and $_.price -eq 12.50 })) {
    throw 'GET no devolvió el producto insertado.'
}
[pscustomobject]@{ status = 201; product = $created; readBack = $true } | ConvertTo-Json -Depth 4
Write-Host 'Ahora refresca Table Editor y comprueba el mismo ID.'
