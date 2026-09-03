# Implementation Preview & Clarification

## Mandatory First Step

**Always show preview and ask clarifying questions before writing any code.**

### Wrong Approach

```
User: "Add a new dashboard component"
Assistant: [Immediately starts coding without preview]
```

### Correct Approach

```
User: "Add a new dashboard component"
Assistant: "I'll help you add a new dashboard component. Here's my implementation plan:

**Preview:**
1. Create `features/dashboard/components/new-component.tsx`
2. Add TypeScript interfaces for props
3. Implement server-side translation support
4. Add component to dashboard layout

**Clarifying Questions:**
- What type of data should this component display? (e.g., stats, charts, lists)
- Should it be interactive or static content?
- Any specific styling requirements?

**Examples:**
- For stats: "Should it show patient counts, appointment metrics, or revenue data?"
- For charts: "Do you need line charts, bar charts, or pie charts?"

Please confirm this approach and answer the questions before I proceed."
```

## Memory Triggers

- When user asks to implement something → STOP and show preview
- When requirements are unclear → Ask clarifying questions with examples
- When multiple approaches exist → Present options and wait for approval
