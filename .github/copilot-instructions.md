Follow these rules strictly:

## UI & COMPONENTS

- ALWAYS use shadcn/ui components first.
- Only create custom components if shadcn does not provide an equivalent.
- Maintain clean, modern UI with proper spacing and hierarchy.
- Use variables for colors, fonts, and spacing to ensure consistency from globals.css.
- need dark mode support, anytime create an UI add the dark version of it too.

## INTERACTIVITY (CRITICAL)

- NOTHING should be static or dead.
- Every button must have an onClick handler with meaningful behavior.
- Every form must:
  - Be fully controlled (React state)
  - Validate inputs (basic validation at minimum)
  - Show loading state (spinner)
  - Simulate API call with setTimeout
  - Show success/error feedback (toast or message)

## NAVIGATION

- Use Next.js App Router conventions.
- All links must navigate to real pages (create pages if needed).
- Use `useRouter()` for programmatic navigation.

## STATE & UX

- Use React hooks properly.
- Show loading states, empty states, and error states.
- Use skeletons or spinners where appropriate.

## TYPE SAFETY

- Use strict TypeScript types everywhere.
- Avoid `any`.
- Define interfaces/types for:
  - Props
  - API responses
  - Form data

## CODE QUALITY

- No TypeScript errors.
- No unused variables.
- No console.logs in final code.
- Keep components modular and reusable.

## MOCK BACKEND BEHAVIOR

- Simulate API calls using async functions + setTimeout.
- Handle both success and failure cases.
