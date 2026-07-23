# AlumniUnite Design System Guidelines

## General Design Principles

### Mobile-First Philosophy
* **Always design for mobile first** - Mobile is the primary experience, desktop is progressive enhancement
* Start with 320px viewport and scale up, never scale down from desktop
* Use the `useMobile()` hook to conditionally render mobile-optimized components
* Prioritize thumb-friendly navigation and touch interactions
* Ensure all interactive elements meet the 48px minimum touch target requirement

### Code Quality Standards
* Only use absolute positioning when necessary. Opt for responsive layouts using flexbox and grid
* Refactor code as you go to keep components clean and maintainable
* Keep file sizes small and put helper functions in separate utility files
* Use TypeScript interfaces for all props and complex data structures
* Follow the established folder structure: group components by feature/domain

### Responsive Design Approach
* Use CSS custom properties and the established spacing/typography scale
* Leverage the mobile-first breakpoints: 640px (sm), 768px (md), 1024px (lg), 1920px (2xl)
* Always test responsive behavior across iPhone, iPad, and desktop viewports
* Use conditional rendering for significantly different mobile vs desktop experiences

---

## Design System Guidelines

### Typography Scale
* **Base font size**: 16px (mobile-first for better readability)
* **Never override** the established typography hierarchy unless specifically requested
* Use semantic HTML elements (h1, h2, h3, p) to leverage default typography styles
* Font weights: 400 (normal), 500 (medium) for headings and labels
* Line height: 1.5 for body text, 1.3 for headings on mobile

### Color System
* **Primary**: #030213 (dark navy) - Use for main actions and primary elements
* **Secondary**: Light gray variants - Use for supporting content and backgrounds
* **Destructive**: #d4183d - Use sparingly for delete/warning actions only
* **Gradients**: Use subtle gradients (primary/10 to secondary/5) for enhanced visual hierarchy
* Always ensure proper contrast ratios for accessibility compliance

### Spacing System
* Use the established CSS custom properties: --spacing-1 through --spacing-20
* **Mobile spacing**: More compact with 4px, 8px, 12px, 16px base increments
* **Desktop spacing**: Scale up proportionally for larger screens
* Cards should have 16px internal padding on mobile, 20px+ on desktop

---

## Component Guidelines

### Navigation
* **Mobile**: Fixed bottom navigation with maximum 4 primary items + "More" overflow
* **Desktop**: Top horizontal navigation with full menu items
* Badge notifications must be positioned at -top-1 -right-1 with destructive color
* Navigation items should have clear, concise labels (max 8 characters for mobile)
* Use consistent iconography from lucide-react library

### Cards
* **Mobile**: 16px border-radius, 20px padding, 12px margin-bottom
* **Desktop**: Can use larger radii and padding for visual comfort
* Apply hover effects only on non-touch devices
* Use `.mobile-card` class for touch-optimized active states
* Include subtle shadows: `0 4px 12px rgba(0, 0, 0, 0.1)`

### Buttons
* **Primary**: Use for main call-to-action (one per screen section)
* **Secondary**: Outline style for alternative actions
* **Ghost**: For subtle actions and navigation items
* **Mobile**: Minimum 48px height, 12px border-radius, 16px font-size
* **Touch feedback**: Scale down to 0.95 on active state for mobile
* Always include appropriate icons when they add clarity

### Forms and Inputs
* **Font size**: 16px minimum to prevent iOS zoom
* **Height**: 48px minimum for touch accessibility
* **Padding**: 14px vertical, 16px horizontal
* **Border radius**: 12px for modern, friendly appearance
* **Focus states**: Subtle scale (1.02) and enhanced shadow
* Labels should be positioned above inputs, not as placeholders

### Badges and Status Indicators
* Use established color variants: default, secondary, destructive, outline
* Keep text concise (max 3-4 characters for counts)
* Position badges consistently at -top-1 -right-1 for notifications
* Use `capitalize` class for role/status text

---

## Layout Patterns

### Grid Systems
* **Mobile**: Single column layouts with full-width cards
* **Tablet**: 2-column grids for optimal content density
* **Desktop**: 3-4 column grids with appropriate max-widths
* Use CSS Grid over Flexbox for complex layouts
* Maintain consistent gaps: 12px mobile, 16px+ desktop

### Content Organization
* Group related functionality in card components
* Use clear visual hierarchy with proper heading levels
* Implement progressive disclosure for complex features
* Prioritize primary actions in mobile interfaces

### Safe Areas and Platform Considerations
* Use `iphone-safe` class for devices with notches/dynamic islands
* Implement proper padding for mobile headers and bottom navigation
* Account for system UI elements in scroll calculations
* Test on actual devices when possible

---

## Interactive Elements

### Touch Interactions
* All buttons must have active states with scale transforms
* Provide immediate visual feedback for all touch interactions
* Use subtle animations (0.2s duration) for state changes
* Avoid hover effects on touch devices

### Loading States
* Show skeleton screens for data loading
* Use the established loading animation pattern with bouncing dots
* Provide progress indicators for long-running operations
* Always communicate current system status to users

### Error Handling
* Use destructive color for error states
* Provide clear, actionable error messages
* Implement proper form validation with inline feedback
* Use toast notifications for system-level messages

---

## Accessibility Requirements

### Touch Targets
* Minimum 48px × 48px for all interactive elements
* Provide adequate spacing between touch targets (8px minimum)
* Ensure touch targets don't overlap or create accidental activation

### Visual Design
* Maintain 4.5:1 contrast ratio for normal text
* Maintain 3:1 contrast ratio for large text and UI elements
* Use color plus additional indicators (icons, text) for status
* Support both light and dark modes consistently

### Keyboard and Screen Reader Support
* Ensure all interactive elements are keyboard accessible
* Use semantic HTML elements for screen reader compatibility
* Provide appropriate ARIA labels and descriptions
* Test with actual assistive technologies

---

## Platform-Specific Guidelines

### iOS Considerations
* Use 16px font-size minimum to prevent zoom
* Implement proper safe area handling
* Follow iOS Human Interface Guidelines for navigation patterns
* Use appropriate system fonts and spacing

### Android Considerations
* Support various screen densities and sizes
* Follow Material Design principles for familiar interactions
* Ensure proper touch ripple effects
* Test across different Android versions and manufacturers

### Desktop Enhancement
* Progressive enhancement from mobile base
* Utilize larger screen real estate effectively
* Support keyboard shortcuts for power users
* Provide hover states and desktop-specific interactions

---

## Data Formatting Standards

* **Dates**: Use "Jun 10" format for consistency
* **Time**: 12-hour format with AM/PM
* **Numbers**: Use toLocaleString() for proper formatting
* **Currency**: Include currency symbol and proper decimal places
* **Relative time**: "2 days ago" format for recent items

---

## Performance Guidelines

* Optimize images using appropriate formats and sizes
* Implement lazy loading for long lists and image galleries
* Use skeleton screens to improve perceived performance
* Minimize JavaScript bundle size for mobile users
* Test performance on low-end devices and slow networks

---

## Alumni Platform Specific Guidelines

### Role-Based Design
* **Student**: Focus on discovery, learning, and connection features
* **Alumni**: Emphasize giving back, networking, and professional growth
* **Admin**: Prioritize data management, analytics, and moderation tools
* Use role-specific navigation items and conditional feature access

### Content Standards
* **Profile photos**: Use Avatar component with proper fallbacks
* **Company logos**: Display at consistent sizes with proper aspect ratios
* **Event images**: Optimize for mobile viewing and fast loading
* **Status indicators**: Use consistent color coding across all features

### Feature-Specific Patterns
* **Messaging**: Use chat-like interfaces with proper message bubbles
* **Events**: Display dates prominently with clear RSVP calls-to-action
* **Job postings**: Include salary ranges, company info, and application deadlines
* **Directory**: Implement efficient filtering and search functionality
* **Analytics**: Use charts and graphs that work well on mobile screens

### Notification Strategy
* Use badge counts sparingly - only for actionable items
* Implement progressive notification disclosure
* Provide clear notification management and preferences
* Support both in-app and push notification systems