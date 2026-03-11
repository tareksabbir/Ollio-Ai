---
name: UI Generation Skill & Design Guidelines
description: Ultimate operational procedures and design aesthetics for the UI generative agent
---

# UI Generation Agent: Core Operations & Design Aesthetics

This document contains the ultimate guidelines for creating high-quality, production-grade frontend interfaces while maintaining token efficiency and avoiding destructive behaviors in the Next.js sandbox environment.

## PART 1: Frontend Design & Aesthetics

This skill guides the creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

### Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

### Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Use CSS variables or Tailwind configured colors.
- **Motion**: Use animations for effects and micro-interactions. Framer Motion is highly encouraged in React. Focus on high-impact moments (e.g., staggered reveals `animation-delay` on page load).
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth. Add contextual effects: gradient meshes, noise textures, layered transparencies, dramatic shadows, custom cursors, etc.

_NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial), cliched color schemes (purple gradients on white), or predictable layouts._ Match implementation complexity to the aesthetic vision.

---

## PART 2: Operational Rules & Token Efficiency

### 1. Context & Efficiency (Token Optimization)

- **Read Before Write**: ALWAYS use `readFiles` to check the current file contents before deciding to `createOrUpdateFiles`.
- **Targeted Edits**: Only rewrite the segments of the code that need to change. Do NOT rewrite the entire file from scratch if you are only making a small addition.
- **Concise Thoughts**: Keep your reasoning brief. Avoid unnecessary apologies or narrative text. Get straight to the tool call.

### 2. React & Next.js Best Practices

- **Client Components**: Any file that uses React Hooks (`useState`, `useEffect`, etc.) or DOM event handlers (`onClick`, `onChange`) MUST have `'use client'` at the very top of the file.
- **Valid Imports**: Always verify that the hooks and components you use are properly imported from their respective libraries (e.g., `import { useState } from "react";`).
- **Hydration**: Avoid using `window` or `document` during the initial server render. Protect browser APIs inside `useEffect` logic.

### 3. Avoiding Destructive Behaviors

- **Preserve Existing Logic**: When modifying an existing component to add a feature, ensure prior functionalities and exports remain intact.
- **Incremental Development**: This is not a fresh start. Add features alongside existing code. Don't remove working code unless explicitly asked to replace it.
- **Do Not Hallucinate Dependencies**: Stick to standard React, Next.js, and available UI components unless you explicitly install new ones via terminal.

## Standard Operating Procedure (SOP)

1. **Analyze**: Identify the user's request, aesthetic tone, and cross-reference with existing files.
2. **Inspect**: Call `readFiles` on the specific files relevant to the request.
3. **Plan**: Formulate the minimal necessary changes and bold design choices.
4. **Execute**: Call `createOrUpdateFiles` to apply the changes or use the `terminal` to install dependencies.
5. **Summarize**: Conclude the task with a concise `<task_summary>` detailing exactly what was updated.
