# ShadCN MCP Server Usage Guide

## Overview
The ShadCN MCP (Model Context Protocol) server enables automatic generation and installation of shadcn/ui components directly within the development workflow. This integration streamlines UI development by providing instant access to a comprehensive component library.

## Usage Rules

### Planning Rule
When asked to plan using anything related to shadcn:
- Use the MCP server during planning
- Apply components wherever components are applicable
- Consider the component ecosystem for the entire feature
- Plan for accessibility and responsive design

### Implementation Rule
When implementing:
- First call the demo tool to see how it is used
- Then implement it so that it is implemented correctly
- Also install the components. Don't write the files yourself
- Let the MCP handle component generation and dependencies

### Component Selection Guidelines
1. **Always prefer shadcn/ui components** over custom implementations
2. **Check available components** before creating custom solutions
3. **Use component composition** to build complex interfaces
4. **Follow shadcn/ui patterns** for consistency

## MCP Commands

### Basic Usage
```
# Generate a component
Use shadcn MCP to create a [component-name]

# View component demo
Show me the demo for [component-name] using shadcn MCP

# Install multiple components
Use shadcn MCP to install button, card, and dialog components
```

### Advanced Usage
```
# Create a complete form with validation
Use shadcn MCP to create a form with input, label, button, and form components

# Build a data table with sorting and filtering
Use shadcn MCP to implement a data-table with all required dependencies

# Design a dashboard layout
Use shadcn MCP to create a dashboard with sidebar, header, and card components
```

## Best Practices

### 1. Component-First Approach
- Always check if a shadcn/ui component exists before writing custom code
- Use the MCP to explore available components
- Leverage component variants and props

### 2. Consistent Styling
- shadcn/ui uses Tailwind CSS classes
- Maintain the default styling system
- Use CSS variables for theming

### 3. Accessibility
- All shadcn/ui components are accessible by default
- Don't override ARIA attributes unless necessary
- Test keyboard navigation

### 4. Performance
- Components are optimized for performance
- Use lazy loading for heavy components
- Implement proper code splitting

## Integration with Projects

### Next.js Projects
```
# Ensure Next.js compatibility
Use shadcn MCP with Next.js app router support

# Server components
Request server-compatible components when needed
```

### React Projects
```
# Standard React setup
Use shadcn MCP for React components with TypeScript
```

### Vue/Other Frameworks
```
# Note: shadcn/ui is React-specific
Consider alternative component libraries for non-React projects
```

## Common Workflows

### 1. Building a Form
```
1. Use shadcn MCP to install form, input, label, button
2. Use shadcn MCP to show form validation demo
3. Implement with react-hook-form and zod
```

### 2. Creating a Data Dashboard
```
1. Use shadcn MCP to install card, charts, tabs
2. Use shadcn MCP for responsive grid layouts
3. Add real-time data updates
```

### 3. Implementing Authentication UI
```
1. Use shadcn MCP for dialog/modal components
2. Use shadcn MCP for form components
3. Add loading states and error handling
```

## Troubleshooting

### Component Not Installing
- Ensure you're in the correct project directory
- Check if dependencies are up to date
- Verify TypeScript configuration

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check for CSS conflicts
- Verify component imports

### Type Errors
- shadcn/ui components are TypeScript-first
- Check for proper type imports
- Update TypeScript version if needed

## MCP Server Configuration
```json
{
  "shadcn-mcp": {
    "command": "npx",
    "args": ["-y", "@shadcn-mcp/mcp"]
  }
}
```

## Important Notes

### Timezone Considerations
- System operates on Chicago time
- Client websites may require different timezones
- Configure timezone per project requirements
- Use appropriate date/time components

### Project Structure
- Components installed to `components/ui/`
- Utilities in `lib/utils.ts`
- Styles use Tailwind CSS
- TypeScript definitions included

### Version Management
- shadcn/ui follows semver
- Check for updates regularly
- Test component updates in development
- Maintain consistency across projects

## Resources
- Official shadcn/ui docs: https://ui.shadcn.com
- Component examples: Available through MCP demo tool
- Tailwind CSS docs: https://tailwindcss.com
- React docs: https://react.dev

---
**Remember**: Let the MCP handle component generation. Focus on implementation and business logic rather than recreating existing components.