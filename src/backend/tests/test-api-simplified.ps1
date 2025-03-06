# Simplified API Test Script for StoryForge

# Base URL
$BASE_URL = "http://localhost:5000/api"

# Helper function for section headers
function HeaderSection($title) {
    Write-Host "`n===== $title =====" -ForegroundColor Yellow
}

# Function to call API with error handling
function CallApi {
    param (
        [string]$Uri,
        [string]$Method = "GET",
        [string]$Body = $null,
        [hashtable]$Headers = @{"Content-Type" = "application/json"},
        [string]$Description = "API call"
    )
    
    Write-Host "Attempting: $Description..." -NoNewline
    
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
        return $response
    }
    catch {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        
        # Try to extract more information from the error
        try {
            $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "  Details: $($errorObj.message) (Code: $($errorObj.code))" -ForegroundColor Red
        }
        catch {
            # If we can't parse JSON, just show the full error
            Write-Host "  Full error: $_" -ForegroundColor Red
        }
        
        return $null
    }
}

# 1. Test health endpoint
HeaderSection "Health Check"
$health = CallApi -Uri "$BASE_URL/health" -Description "Health check"
if ($health) {
    Write-Host "Health status: $($health.status)"
    Write-Host "Database: $($health.services.database.status)"
}

# 2. Test Swagger UI
HeaderSection "Swagger UI"
try {
    $swagger = Invoke-WebRequest -Uri "$BASE_URL/docs/" -Method GET
    Write-Host "Swagger UI accessible: $($swagger.StatusCode -eq 200)" -ForegroundColor Green
}
catch {
    Write-Host "Swagger UI not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test user registration
HeaderSection "User Registration"
$userData = @{
    email = "test@example.com"
    password = "Password123!"
    username = "testuser"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

$register = CallApi -Uri "$BASE_URL/auth/register" -Method "POST" -Body $userData -Description "User registration"
if (-not $register) {
    Write-Host "Registration may have failed because user already exists, continuing with login" -ForegroundColor Cyan
}

# 4. Test login
HeaderSection "User Login"
$loginData = @{
    email = "test@example.com"
    password = "Password123!"
} | ConvertTo-Json

$login = CallApi -Uri "$BASE_URL/auth/login" -Method "POST" -Body $loginData -Description "User login"

# Extract token
$token = $null
if ($login) {
    if ($login.token) { $token = $login.token }
    elseif ($login.data -and $login.data.token) { $token = $login.data.token }
    elseif ($login.result -and $login.result.data -and $login.result.data.token) { $token = $login.result.data.token }

    if ($token) {
        Write-Host "Token received: $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Green
        
        # Set up headers for authenticated requests
        $authHeaders = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $token"
        }
        
        # 5. Test user profile
        HeaderSection "User Profile"
        $profile = CallApi -Uri "$BASE_URL/users/profile" -Method "GET" -Headers $authHeaders -Description "Get user profile"
        if ($profile) {
            Write-Host "Profile data:" -ForegroundColor Cyan
            Write-Host ($profile | ConvertTo-Json -Depth 2)
        }
        
        # 6. Test endpoints discovery - print all available endpoints
        HeaderSection "API Endpoints Discovery"
        Write-Host "Checking for available endpoints in Swagger documentation..."
        try {
            $swaggerDoc = Invoke-RestMethod -Uri "$BASE_URL/docs/swagger-ui-init.js" -Method GET
            if ($swaggerDoc -match '"paths"\s*:\s*({[^}]+})') {
                $pathsData = $matches[1]
                Write-Host "Found API paths in Swagger documentation"
                Write-Host $pathsData
            }
            else {
                Write-Host "Could not extract paths from Swagger documentation" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "Could not access Swagger documentation: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # 7. Create a project - try to use the correct endpoint
        HeaderSection "Create Project"
        
        # Prepare a valid project object according to schema
        $projectData = @{
            title = "Test Project"
            description = "Test project created via API test script"
            genre = "fantasy"
            targetAudience = "middle grade"
            narrativeType = "Novel"
            tone = "Neutral"
            style = "Neutral"
            targetLength = @{
                type = "Words"
                value = 50000
            }
        } | ConvertTo-Json
        
        # First try the RESTful endpoint
        $project = CallApi -Uri "$BASE_URL/projects" -Method "POST" -Body $projectData -Headers $authHeaders -Description "Create project (RESTful endpoint)"
        
        # If that fails, try the tRPC endpoint with the correct format
        if (-not $project) {
            Write-Host "Trying tRPC endpoint instead..." -ForegroundColor Yellow
            
            # For tRPC, we need to wrap the input in an "input" property
            $trpcData = @{
                input = $projectData | ConvertFrom-Json
            } | ConvertTo-Json -Depth 10
            
            $project = CallApi -Uri "$BASE_URL/trpc/project.create" -Method "POST" -Body $trpcData -Headers $authHeaders -Description "Create project (tRPC endpoint)"
        }
        
        if ($project) {
            $projectId = $null
            if ($project.id) { $projectId = $project.id }
            elseif ($project.data -and $project.data.id) { $projectId = $project.data.id }
            elseif ($project.result -and $project.result.data -and $project.result.data.id) { $projectId = $project.result.data.id }
            
            if ($projectId) {
                Write-Host "Project created with ID: $projectId" -ForegroundColor Green
            }
            else {
                Write-Host "Project created but could not extract ID from response:" -ForegroundColor Yellow
                Write-Host ($project | ConvertTo-Json -Depth 2)
            }
        }
    }
    else {
        Write-Host "Could not extract token from response:" -ForegroundColor Red
        Write-Host ($login | ConvertTo-Json -Depth 2)
    }
}

# Summary
HeaderSection "Test Summary"
Write-Host "API tests completed" 