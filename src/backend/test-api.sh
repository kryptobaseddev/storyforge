#!/bin/bash
# API Testing Script for StoryForge tRPC API

# Base URL for API
API_URL="http://localhost:5000/api/trpc"

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section header
print_header() {
  echo -e "\n${YELLOW}==== $1 ====${NC}"
}

# Function to test an endpoint
test_endpoint() {
  local endpoint=$1
  local method=${2:-GET}
  local data=${3:-"{}"}
  local auth_token=${4:-""}
  
  echo -e "\n${YELLOW}Testing $method $endpoint${NC}"
  
  local auth_header=""
  if [ -n "$auth_token" ]; then
    auth_header="-H \"Authorization: Bearer $auth_token\""
  fi
  
  if [ "$method" = "GET" ]; then
    cmd="curl -s $API_URL/$endpoint?input=$data"
  else
    cmd="curl -s -X $method $API_URL/$endpoint -H \"Content-Type: application/json\" -d '{\"input\": $data}'"
  fi
  
  if [ -n "$auth_header" ]; then
    cmd="$cmd $auth_header"
  fi
  
  echo "Command: $cmd"
  eval $cmd | jq '.'
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Request successful${NC}"
  else
    echo -e "${RED}✗ Request failed${NC}"
  fi
}

# Main test sequence
print_header "HEALTH CHECK"
curl -s http://localhost:5000/api/health | jq '.'

print_header "AUTH TESTS"
# Register a new user
test_endpoint "auth.register" "POST" "{\"email\":\"test@example.com\",\"password\":\"Password123!\",\"name\":\"Test User\"}"

# Login
response=$(curl -s -X POST $API_URL/auth.login -H "Content-Type: application/json" -d '{"input": {"email":"test@example.com","password":"Password123!"}}')
echo $response | jq '.'
token=$(echo $response | jq -r '.result.data.token')

if [ "$token" != "null" ] && [ -n "$token" ]; then
  echo -e "${GREEN}✓ Login successful, token received${NC}"
  
  print_header "USER TESTS (AUTHENTICATED)"
  # Get user profile
  test_endpoint "user.getProfile" "GET" "{}" "$token"
  
  print_header "PROJECT TESTS (AUTHENTICATED)"
  # Create a project
  project_response=$(curl -s -X POST $API_URL/project.create -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d '{"input": {"title":"Test Project","description":"This is a test project"}}')
  echo $project_response | jq '.'
  project_id=$(echo $project_response | jq -r '.result.data.id')
  
  if [ "$project_id" != "null" ] && [ -n "$project_id" ]; then
    echo -e "${GREEN}✓ Project created successfully${NC}"
    
    # Get project by ID
    test_endpoint "project.getById" "GET" "{\"id\":\"$project_id\"}" "$token"
    
    print_header "CHARACTER TESTS (AUTHENTICATED)"
    # Create a character
    character_response=$(curl -s -X POST $API_URL/character.create -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "{\"input\": {\"projectId\":\"$project_id\",\"name\":\"Test Character\",\"role\":\"Protagonist\",\"description\":\"A test character\"}}")
    echo $character_response | jq '.'
    
    print_header "PLOT TESTS (AUTHENTICATED)"
    # Create a plot
    plot_response=$(curl -s -X POST $API_URL/plot.create -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "{\"input\": {\"projectId\":\"$project_id\",\"title\":\"Test Plot\",\"description\":\"A test plot\"}}")
    echo $plot_response | jq '.'
    
    print_header "CHAPTER TESTS (AUTHENTICATED)"
    # Create a chapter
    chapter_response=$(curl -s -X POST $API_URL/chapter.create -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "{\"input\": {\"projectId\":\"$project_id\",\"title\":\"Test Chapter\",\"content\":\"This is test chapter content\"}}")
    echo $chapter_response | jq '.'
    
    print_header "AI TESTS (AUTHENTICATED)"
    # Generate text using AI
    test_endpoint "ai.generateText" "POST" "{\"prompt\":\"Generate a short story introduction\",\"modelName\":\"gpt-3.5-turbo\"}" "$token"
    
    print_header "EXPORT TESTS (AUTHENTICATED)"
    # Create an export
    test_endpoint "export.createExport" "POST" "{\"projectId\":\"$project_id\",\"export\":{\"format\":\"txt\",\"name\":\"Test Export\"}}" "$token"
  else
    echo -e "${RED}✗ Failed to create project, skipping related tests${NC}"
  fi
else
  echo -e "${RED}✗ Login failed, skipping authenticated tests${NC}"
fi

print_header "TEST SUMMARY"
echo -e "API test script completed. Check the results above for any errors." 