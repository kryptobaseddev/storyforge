# API Testing Script for StoryForge tRPC API (PowerShell version)

# Base URL for API
$API_URL = "http://localhost:5000/api/trpc"

# Function to print section header
function Print-Header {
    param ([string]$Title)
    Write-Host "`n==== $Title ====" -ForegroundColor Yellow
}

# Function to test an endpoint
function Test-Endpoint {
    param (
        [string]$Endpoint,
        [string]$Method = "GET",
        [string]$Data = "{}",
        [string]$AuthToken = ""
    )
    
    Write-Host "`nTesting $Method $Endpoint" -ForegroundColor Yellow
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($AuthToken -ne "") {
        $headers.Add("Authorization", "Bearer $AuthToken")
    }
    
    try {
        if ($Method -eq "GET") {
            $encodedData = [System.Web.HttpUtility]::UrlEncode($Data)
            $cmdStr = "Invoke-RestMethod -Uri '$API_URL/$Endpoint`?input=$encodedData' -Method GET -Headers `$headers"
            Write-Host "Command: $cmdStr" -ForegroundColor Gray
            $response = Invoke-RestMethod -Uri "$API_URL/$Endpoint`?input=$encodedData" -Method GET -Headers $headers
        } else {
            $body = @{ input = $Data | ConvertFrom-Json } | ConvertTo-Json
            $cmdStr = "Invoke-RestMethod -Uri '$API_URL/$Endpoint' -Method $Method -Headers `$headers -Body '$body'"
            Write-Host "Command: $cmdStr" -ForegroundColor Gray
            $response = Invoke-RestMethod -Uri "$API_URL/$Endpoint" -Method $Method -Headers $headers -Body $body
        }
        
        Write-Host ($response | ConvertTo-Json -Depth 10)
        Write-Host "✓ Request successful" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "✗ Request failed: $_" -ForegroundColor Red
        return $null
    }
}

# Main test sequence
Print-Header "HEALTH CHECK"
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
    Write-Host ($health | ConvertTo-Json)
} catch {
    Write-Host "Health check failed: $_" -ForegroundColor Red
}

Print-Header "AUTH TESTS"
# Register a new user
$registerData = @{
    email = "test@example.com"
    password = "Password123!"
    name = "Test User"
} | ConvertTo-Json
$registerResponse = Test-Endpoint -Endpoint "auth.register" -Method "POST" -Data $registerData

# Login
$loginData = @{
    email = "test@example.com"
    password = "Password123!"
} | ConvertTo-Json
$loginResponse = Test-Endpoint -Endpoint "auth.login" -Method "POST" -Data $loginData

if ($loginResponse -and $loginResponse.result.data.token) {
    $token = $loginResponse.result.data.token
    Write-Host "✓ Login successful, token received" -ForegroundColor Green
    
    Print-Header "USER TESTS (AUTHENTICATED)"
    # Get user profile
    $profileResponse = Test-Endpoint -Endpoint "user.getProfile" -Method "GET" -Data "{}" -AuthToken $token
    
    Print-Header "PROJECT TESTS (AUTHENTICATED)"
    # Create a project
    $projectData = @{
        title = "Test Project"
        description = "This is a test project"
    } | ConvertTo-Json
    $projectResponse = Test-Endpoint -Endpoint "project.create" -Method "POST" -Data $projectData -AuthToken $token
    
    if ($projectResponse -and $projectResponse.result.data.id) {
        $projectId = $projectResponse.result.data.id
        Write-Host "✓ Project created successfully" -ForegroundColor Green
        
        # Get project by ID
        $getProjectData = @{
            id = $projectId
        } | ConvertTo-Json
        Test-Endpoint -Endpoint "project.getById" -Method "GET" -Data $getProjectData -AuthToken $token
        
        Print-Header "CHARACTER TESTS (AUTHENTICATED)"
        # Create a character
        $characterData = @{
            projectId = $projectId
            name = "Test Character"
            role = "Protagonist"
            description = "A test character"
        } | ConvertTo-Json
        $characterResponse = Test-Endpoint -Endpoint "character.create" -Method "POST" -Data $characterData -AuthToken $token
        
        Print-Header "PLOT TESTS (AUTHENTICATED)"
        # Create a plot
        $plotData = @{
            projectId = $projectId
            title = "Test Plot"
            description = "A test plot"
        } | ConvertTo-Json
        $plotResponse = Test-Endpoint -Endpoint "plot.create" -Method "POST" -Data $plotData -AuthToken $token
        
        Print-Header "CHAPTER TESTS (AUTHENTICATED)"
        # Create a chapter
        $chapterData = @{
            projectId = $projectId
            title = "Test Chapter"
            content = "This is test chapter content"
        } | ConvertTo-Json
        $chapterResponse = Test-Endpoint -Endpoint "chapter.create" -Method "POST" -Data $chapterData -AuthToken $token
        
        Print-Header "AI TESTS (AUTHENTICATED)"
        # Generate text using AI
        $aiData = @{
            prompt = "Generate a short story introduction"
            modelName = "gpt-3.5-turbo"
        } | ConvertTo-Json
        Test-Endpoint -Endpoint "ai.generateText" -Method "POST" -Data $aiData -AuthToken $token
        
        Print-Header "EXPORT TESTS (AUTHENTICATED)"
        # Create an export
        $exportData = @{
            projectId = $projectId
            export = @{
                format = "txt"
                name = "Test Export"
            }
        } | ConvertTo-Json
        Test-Endpoint -Endpoint "export.createExport" -Method "POST" -Data $exportData -AuthToken $token
    } else {
        Write-Host "✗ Failed to create project, skipping related tests" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Login failed, skipping authenticated tests" -ForegroundColor Red
}

Print-Header "TEST SUMMARY"
Write-Host "API test script completed. Check the results above for any errors." 