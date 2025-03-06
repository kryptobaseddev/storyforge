# StoryForge API Testing Script
# This script tests all major API endpoints and generates a results report

# Base URL settings
$BASE_URL = "http://localhost:5000/api"
$TRPC_URL = "$BASE_URL/trpc"

# Resolve paths correctly - make sure they're relative to script location
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RESULTS_FOLDER = Join-Path $scriptDir "tests/results"
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$RESULTS_FILE = Join-Path $RESULTS_FOLDER "api-test-results_$TIMESTAMP.md"

# Create results folder if it doesn't exist
if (-not (Test-Path $RESULTS_FOLDER)) {
    Write-Host "Creating results directory: $RESULTS_FOLDER"
    New-Item -ItemType Directory -Path $RESULTS_FOLDER -Force | Out-Null
}

# Initialize results array to store test outcomes
$global:testResults = @()
$startTime = Get-Date

# Text formatting for console output
function Write-ColorOutput($message, $color) {
    Write-Host $message -ForegroundColor $color
}

# Add a result to our results array
function Add-TestResult($endpoint, $status, $details) {
    $global:testResults += [PSCustomObject]@{
        Endpoint = $endpoint
        Status = $status
        Details = $details
    }
    
    # Also write to console for immediate feedback
    $statusColor = if ($status -eq "PASS") { "Green" } elseif ($status -eq "WARN") { "Yellow" } else { "Red" }
    Write-ColorOutput "  Status: $status" $statusColor
    if ($details) {
        Write-Host "  Details: $details"
    }
}

# Helper function for section headers
function Write-SectionHeader($title) {
    $header = "===== $title ====="
    Write-ColorOutput "`n$header" "Cyan"
    return $header
}

# Function to call API with error handling
function Invoke-ApiCall {
    param (
        [string]$Uri,
        [string]$Method = "GET",
        [string]$Body = $null,
        [hashtable]$Headers = @{"Content-Type" = "application/json"},
        [string]$Description = "API call",
        [string]$TestName = $Description
    )
    
    Write-Host "Testing: $Description..." -NoNewline
    
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body -and $Method -ne "GET") {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params
        Write-Host " SUCCESS" -ForegroundColor Green
        Add-TestResult $TestName "PASS" "Request successful"
        return $response
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        $errorMessage = $_.Exception.Message
        
        # Try to extract more information from the error
        try {
            if ($_.ErrorDetails.Message) {
                $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
                $errorDetails = "Code: $($errorObj.code), Message: $($errorObj.message)"
            }
            else {
                $errorDetails = $errorMessage
            }
        }
        catch {
            $errorDetails = $errorMessage
        }
        
        Add-TestResult $TestName "FAIL" $errorDetails
        return $null
    }
}

# Start test execution
Write-SectionHeader "StoryForge API Test Suite" | Out-Null
Write-Host "Starting tests at $startTime"
Write-Host "Results will be saved to: $RESULTS_FILE"

# 1. Test health endpoint
Write-SectionHeader "1. Health Check" | Out-Null
$health = Invoke-ApiCall -Uri "$BASE_URL/health" -Description "Health endpoint" -TestName "Health Check"
if ($health) {
    Write-Host "Health status: $($health.status)"
    Write-Host "Database: $($health.services.database.status)"
}

# 2. Test Swagger UI
Write-SectionHeader "2. Swagger Documentation" | Out-Null
try {
    $swagger = Invoke-WebRequest -Uri "$BASE_URL/docs/" -Method GET
    Write-Host "Swagger UI accessible: $($swagger.StatusCode -eq 200)" -ForegroundColor Green
    Add-TestResult "Swagger UI" "PASS" "Status code: $($swagger.StatusCode)"
}
catch {
    Write-Host "Swagger UI not accessible: $($_.Exception.Message)" -ForegroundColor Red
    Add-TestResult "Swagger UI" "FAIL" $_.Exception.Message
}

# 3. Test user registration (Try tRPC first, then REST as fallback)
Write-SectionHeader "3. User Registration" | Out-Null
$testEmail = "test-$TIMESTAMP@example.com" # Use timestamp to avoid duplicate user errors
$userData = @{
    email = $testEmail
    password = "Password123!"
    username = "testuser-$TIMESTAMP"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

# Try tRPC endpoint first
$trpcUserData = @{
    input = $userData | ConvertFrom-Json
} | ConvertTo-Json

$register = Invoke-ApiCall -Uri "$TRPC_URL/auth.register" -Method "POST" -Body $trpcUserData -Description "User registration (tRPC)" -TestName "User Registration"

# If tRPC fails, try REST endpoint as fallback
if (-not $register) {
    Write-ColorOutput "Trying REST registration endpoint as fallback..." "Yellow"
    $register = Invoke-ApiCall -Uri "$BASE_URL/auth/register" -Method "POST" -Body $userData -Description "User registration (REST)" -TestName "User Registration (REST)"
}

# 4. Test login (Try tRPC first, then REST as fallback)
Write-SectionHeader "4. User Login" | Out-Null
$trpcLoginData = @{
    input = @{
        email = $testEmail
        password = "Password123!"
    }
} | ConvertTo-Json

$login = Invoke-ApiCall -Uri "$TRPC_URL/auth.login" -Method "POST" -Body $trpcLoginData -Description "User login (tRPC)" -TestName "User Login"

# If tRPC login fails, try REST login
if (-not $login) {
    Write-ColorOutput "Trying REST login endpoint as fallback..." "Yellow"
    $loginData = @{
        email = $testEmail
        password = "Password123!"
    } | ConvertTo-Json
    
    $login = Invoke-ApiCall -Uri "$BASE_URL/auth/login" -Method "POST" -Body $loginData -Description "User login (REST)" -TestName "User Login (REST)"
}

# Extract token
$token = $null
if ($login) {
    # Try different possible locations of the token in the response
    if ($login.token) { 
        $token = $login.token 
    }
    elseif ($login.data -and $login.data.token) { 
        $token = $login.data.token 
    }
    elseif ($login.result -and $login.result.data -and $login.result.data.token) { 
        $token = $login.result.data.token 
    }

    if ($token) {
        Write-ColorOutput "Token received successfully" "Green"
        
        # Set up headers for authenticated requests
        $authHeaders = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $token"
        }
        
        # 5. Test user profile (Try tRPC first, then REST as fallback)
        Write-SectionHeader "5. User Profile" | Out-Null
        $profile = Invoke-ApiCall -Uri "$TRPC_URL/user.getProfile" -Method "GET" -Headers $authHeaders -Description "Get user profile (tRPC)" -TestName "User Profile"
        
        # If tRPC endpoint fails, try REST endpoint
        if (-not $profile) {
            Write-ColorOutput "Trying REST profile endpoint as fallback..." "Yellow"
            $profile = Invoke-ApiCall -Uri "$BASE_URL/users/profile" -Method "GET" -Headers $authHeaders -Description "Get user profile (REST)" -TestName "User Profile (REST)"
        }
        
        if ($profile) {
            Write-Host "Profile data successfully retrieved"
        }
        
        # 6. Test project creation (Try tRPC first, then REST as fallback)
        Write-SectionHeader "6. Project Creation" | Out-Null
        $projectData = @{
            title = "Test Project $TIMESTAMP"
            description = "Test project created via API test script"
            genre = "fantasy"
            targetAudience = "middle grade"
            narrativeType = "Novel"
        } | ConvertTo-Json
        
        $trpcProjectData = @{
            input = $projectData | ConvertFrom-Json
        } | ConvertTo-Json -Depth 10
        
        $project = Invoke-ApiCall -Uri "$TRPC_URL/project.create" -Method "POST" -Body $trpcProjectData -Headers $authHeaders -Description "Create project (tRPC)" -TestName "Project Creation"
        
        # If tRPC endpoint fails, try REST endpoint
        if (-not $project) {
            Write-ColorOutput "Trying REST project endpoint as fallback..." "Yellow"
            $project = Invoke-ApiCall -Uri "$BASE_URL/projects" -Method "POST" -Body $projectData -Headers $authHeaders -Description "Create project (REST)" -TestName "Project Creation (REST)"
        }
        
        # Extract project ID for use in subsequent tests
        $projectId = $null
        if ($project) {
            if ($project.id) { 
                $projectId = $project.id 
            }
            elseif ($project.data -and $project.data.id) { 
                $projectId = $project.data.id 
            }
            elseif ($project.result -and $project.result.data -and $project.result.data.id) { 
                $projectId = $project.result.data.id 
            }
            
            if ($projectId) {
                Write-ColorOutput "Project created with ID: $projectId" "Green"
                
                # 7. Test character creation (Try tRPC first, then REST as fallback)
                Write-SectionHeader "7. Character Creation" | Out-Null
                $characterData = @{
                    projectId = $projectId
                    name = "Test Character"
                    role = "Protagonist"
                    description = "A test character created via API"
                } | ConvertTo-Json
                
                $trpcCharacterData = @{
                    input = $characterData | ConvertFrom-Json
                } | ConvertTo-Json -Depth 10
                
                $character = Invoke-ApiCall -Uri "$TRPC_URL/character.create" -Method "POST" -Body $trpcCharacterData -Headers $authHeaders -Description "Create character (tRPC)" -TestName "Character Creation"
                
                # If tRPC endpoint fails, try REST endpoint
                if (-not $character) {
                    Write-ColorOutput "Trying REST character endpoint as fallback..." "Yellow"
                    $character = Invoke-ApiCall -Uri "$BASE_URL/characters" -Method "POST" -Body $characterData -Headers $authHeaders -Description "Create character (REST)" -TestName "Character Creation (REST)"
                }
                
                # Extract character ID
                $characterId = $null
                if ($character) {
                    if ($character.id) { 
                        $characterId = $character.id 
                    }
                    elseif ($character.data -and $character.data.id) { 
                        $characterId = $character.data.id 
                    }
                    elseif ($character.result -and $character.result.data -and $character.result.data.id) { 
                        $characterId = $character.result.data.id 
                    }
                    
                    if ($characterId) {
                        Write-ColorOutput "Character created with ID: $characterId" "Green"
                    }
                }
                
                # 8. Test plot creation (Try tRPC first, then REST as fallback)
                Write-SectionHeader "8. Plot Creation" | Out-Null
                $plotData = @{
                    projectId = $projectId
                    title = "Test Plot"
                    description = "A test plot created via API"
                } | ConvertTo-Json
                
                $trpcPlotData = @{
                    input = $plotData | ConvertFrom-Json
                } | ConvertTo-Json -Depth 10
                
                $plot = Invoke-ApiCall -Uri "$TRPC_URL/plot.create" -Method "POST" -Body $trpcPlotData -Headers $authHeaders -Description "Create plot (tRPC)" -TestName "Plot Creation"
                
                # If tRPC endpoint fails, try REST endpoint
                if (-not $plot) {
                    Write-ColorOutput "Trying REST plot endpoint as fallback..." "Yellow"
                    $plot = Invoke-ApiCall -Uri "$BASE_URL/plots" -Method "POST" -Body $plotData -Headers $authHeaders -Description "Create plot (REST)" -TestName "Plot Creation (REST)"
                }
                
                # 9. Test chapter creation (Try tRPC first, then REST as fallback)
                Write-SectionHeader "9. Chapter Creation" | Out-Null
                $chapterData = @{
                    projectId = $projectId
                    title = "Test Chapter"
                    content = "This is a test chapter created via API."
                } | ConvertTo-Json
                
                $trpcChapterData = @{
                    input = $chapterData | ConvertFrom-Json
                } | ConvertTo-Json -Depth 10
                
                $chapter = Invoke-ApiCall -Uri "$TRPC_URL/chapter.create" -Method "POST" -Body $trpcChapterData -Headers $authHeaders -Description "Create chapter (tRPC)" -TestName "Chapter Creation"
                
                # If tRPC endpoint fails, try REST endpoint
                if (-not $chapter) {
                    Write-ColorOutput "Trying REST chapter endpoint as fallback..." "Yellow"
                    $chapter = Invoke-ApiCall -Uri "$BASE_URL/chapters" -Method "POST" -Body $chapterData -Headers $authHeaders -Description "Create chapter (REST)" -TestName "Chapter Creation (REST)"
                }
                
                # 10. Test AI text generation (Try tRPC first, then REST as fallback)
                Write-SectionHeader "10. AI Text Generation" | Out-Null
                $aiData = @{
                    prompt = "Generate a brief story introduction"
                    modelName = "gpt-3.5-turbo"
                } | ConvertTo-Json
                
                $trpcAiData = @{
                    input = $aiData | ConvertFrom-Json
                } | ConvertTo-Json -Depth 10
                
                $aiGeneration = Invoke-ApiCall -Uri "$TRPC_URL/ai.generateText" -Method "POST" -Body $trpcAiData -Headers $authHeaders -Description "Generate AI text (tRPC)" -TestName "AI Text Generation"
                
                # If tRPC endpoint fails, try REST endpoint
                if (-not $aiGeneration) {
                    Write-ColorOutput "Trying REST AI endpoint as fallback..." "Yellow"
                    $aiGeneration = Invoke-ApiCall -Uri "$BASE_URL/ai/generate" -Method "POST" -Body $aiData -Headers $authHeaders -Description "Generate AI text (REST)" -TestName "AI Text Generation (REST)"
                }
                
                # 11. Test export creation (Try tRPC first, then REST as fallback)
                Write-SectionHeader "11. Export Creation" | Out-Null
                $trpcExportData = @{
                    input = @{
                        projectId = $projectId
                        export = @{
                            format = "txt"
                            name = "Test Export"
                        }
                    }
                } | ConvertTo-Json -Depth 10
                
                $export = Invoke-ApiCall -Uri "$TRPC_URL/export.createExport" -Method "POST" -Body $trpcExportData -Headers $authHeaders -Description "Create export (tRPC)" -TestName "Export Creation"
                
                # If tRPC endpoint fails, try REST endpoint
                if (-not $export) {
                    Write-ColorOutput "Trying REST export endpoint as fallback..." "Yellow"
                    $exportData = @{
                        projectId = $projectId
                        format = "txt"
                        name = "Test Export"
                    } | ConvertTo-Json
                    
                    $export = Invoke-ApiCall -Uri "$BASE_URL/exports" -Method "POST" -Body $exportData -Headers $authHeaders -Description "Create export (REST)" -TestName "Export Creation (REST)"
                }
            }
            else {
                Write-ColorOutput "Project created but could not extract ID from response" "Yellow"
                Add-TestResult "Project ID Extraction" "WARN" "Could not extract project ID from response"
            }
        }
    }
    else {
        Write-ColorOutput "Could not extract token from login response" "Red"
        Add-TestResult "Token Extraction" "FAIL" "Could not extract token from login response"
    }
}

# --------------- GENERATE REPORT ---------------
# Calculate total test statistics
$endTime = Get-Date
$duration = $endTime - $startTime
$durationFormatted = "{0:hh\:mm\:ss}" -f $duration
$passCount = ($global:testResults | Where-Object { $_.Status -eq "PASS" }).Count
$warnCount = ($global:testResults | Where-Object { $_.Status -eq "WARN" }).Count
$failCount = ($global:testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $global:testResults.Count

# First display results in console
Write-SectionHeader "Test Summary" | Out-Null
Write-Host "Total tests: $totalCount"
Write-ColorOutput "Passed: $passCount" "Green"
Write-ColorOutput "Warnings: $warnCount" "Yellow"
Write-ColorOutput "Failed: $failCount" "Red"
Write-Host "Duration: $durationFormatted"
Write-Host "Full test results saved to: $RESULTS_FILE"

# Generate the final report
try {
    $endTime = Get-Date
    $duration = $endTime - $startTime
    $durationFormatted = "{0:hh\:mm\:ss}" -f $duration
    
    # Create report content as a single string
    $reportContent = @"
# StoryForge API Test Results

**Test run at:** $(Get-Date -Format "MM/dd/yyyy HH:mm:ss")
**Duration:** $durationFormatted
**Total tests:** $totalCount
**Passed:** $passCount
**Warnings:** $warnCount
**Failed:** $failCount

## Test Details

| # | Endpoint | Status | Details |
|---|----------|--------|---------|
"@

    # Add each test result
    foreach ($result in $global:testResults) {
        $reportContent += "| $($result.Id) | $($result.Endpoint) | $($result.Status) | $($result.Details) |`n"
    }

    # Add summary
    $reportContent += "`n## Summary`n"

    if ($failCount -gt 0) {
        $reportContent += "$failCount test(s) failed. Please check the details above for more information."
    } else {
        $reportContent += "All tests passed!"
    }

    # Ensure the directory exists
    if (-not (Test-Path -Path $RESULTS_FOLDER)) {
        New-Item -ItemType Directory -Path $RESULTS_FOLDER -Force | Out-Null
        Write-Host "Created directory: $RESULTS_FOLDER"
    }

    # Use System.IO.File to write all text at once - guarantees a single operation
    [System.IO.File]::WriteAllText($RESULTS_FILE, $reportContent, [System.Text.Encoding]::UTF8)
    
    # Verify the file was created successfully
    if (Test-Path -Path $RESULTS_FILE) {
        $fileSize = (Get-Item -Path $RESULTS_FILE).Length
        Write-Host "Report file created successfully: $RESULTS_FILE ($fileSize bytes)"
    } else {
        Write-Error "Failed to create report file: $RESULTS_FILE"
    }
} catch {
    Write-Error "Error creating report: $_"
    
    # Emergency fallback - try the simplest approach possible
    try {
        Write-Host "Attempting emergency fallback report generation..."
        $simpleReport = "# StoryForge API Test Report`n`nTests run: $global:testCounter`nPassed: $global:testsPassed`nFailed: $global:testsFailed"
        Set-Content -Path $RESULTS_FILE -Value $simpleReport -Force
        Write-Host "Emergency fallback approach completed."
    } catch {
        Write-Error "All report generation methods failed: $_"
    }
} 