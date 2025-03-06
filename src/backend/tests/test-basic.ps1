# Basic API Test

Write-Host "Testing API health endpoint..."

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET

Write-Host "Response received:"
Write-Host ($response | ConvertTo-Json)

Write-Host "Testing Swagger UI..."
$swagger = Invoke-WebRequest -Uri "http://localhost:5000/api/docs/" -Method GET

Write-Host "Swagger UI status code: $($swagger.StatusCode)"

Write-Host "Tests completed." 