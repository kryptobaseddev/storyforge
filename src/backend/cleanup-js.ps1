Get-ChildItem -Path "src" -Recurse -Filter "*.js" | Where-Object { Test-Path ($_.FullName -replace "\.js$", ".ts") } | ForEach-Object { Remove-Item $_.FullName -Force }
