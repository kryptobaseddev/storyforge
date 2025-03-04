# StoryForge - Development Guidelines

## Development Rules

1. **Structured Approach**: 
   - Follow the project roadmap in order
   - Complete each phase before moving to the next
   - Check off items as they are completed
   - Document any deviations or changes to the plan

2. **Code Organization**:
   - Follow component-based architecture
   - Use feature folders for related functionality
   - Maintain separation of concerns (frontend/backend)
   - Document the purpose of each module/component

3. **Incremental Development**:
   - Implement one feature at a time
   - Test each feature before moving to the next
   - Commit code frequently with descriptive messages
   - Track progress against the roadmap

4. **Documentation**:
   - Document all major components and their interactions
   - Update project documentation as features are implemented
   - Add comments to complex code sections
   - Maintain up-to-date API documentation

5. **User Experience Focus**:
   - Design with kid-friendly interfaces in mind
   - Use large, clear components and intuitive layouts
   - Ensure accessibility for various age groups
   - Maintain consistent visual language throughout

## Coding Standards

### Frontend (React)
- Use functional components with hooks
- Implement proper state management
- Create reusable components
- Follow shadcn/UI component patterns
- Use Tailwind CSS for styling
- Maintain responsive design principles

### Backend (Node.js/Express)
- Organize routes by feature
- Implement proper error handling
- Use middleware for common functionality
- Document API endpoints with examples
- Implement security best practices

### Database (MongoDB)
- Follow schema designs from the dev plan
- Validate data at the model level
- Optimize queries for performance
- Implement proper indexing

### AI Integration
- Manage context efficiently to minimize token usage
- Implement fallbacks for API failures
- Cache responses when appropriate
- Monitor and log AI interactions

## Development Workflow

1. **Planning**:
   - Review the dev plan for the current task
   - Document the approach in projectDocs
   - Define acceptance criteria

2. **Implementation**:
   - Develop the feature according to the plan
   - Follow coding standards
   - Add tests as appropriate

3. **Testing**:
   - Test functionality manually
   - Verify against acceptance criteria
   - Check for edge cases and errors

4. **Documentation**:
   - Update project documentation
   - Document API changes
   - Record any lessons learned

5. **Review**:
   - Review code for quality and standards
   - Check against the roadmap
   - Plan next steps

## Progress Tracking

- Update the project roadmap as tasks are completed
- Document challenges and solutions
- Track time spent on each feature
- Identify bottlenecks and optimization opportunities 