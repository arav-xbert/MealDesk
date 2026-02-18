---
name: figma-design-system-sync
description: Synchronize a Figma design system to local code using the Figma Console MCP. Use when the user wants to pull design tokens, components, or styles from Figma and generate CSS Modules, React components, and Storybook stories in a local design-system/ folder. Figma is the source of truth. REQUIRES Figma Console MCP running in Local Mode with the Desktop Bridge Plugin — this skill will not work in Remote Mode.
---

# Figma → Code Design Sync

This skill reads from Figma using the **Figma Console MCP** (not the official Figma MCP) and writes synchronized code to a local `design-system/` folder. Figma is always the source of truth. Never invent values — every token, color, spacing unit, and style must come directly from Figma.

## ⚠️ Local Mode Required

**This skill only works in Local Mode.** The design system sync tools (`figma_get_design_system_summary`, `figma_search_components`, `figma_get_component_details`, `figma_get_token_values`, etc.) are exclusively available in Local Mode via the Desktop Bridge Plugin or CDP connection.

**If the user is in Remote Mode (SSE), stop immediately and explain:**

> "This skill requires Figma Console MCP running in Local Mode. Remote Mode does not have access to the design system tools needed for syncing. Please set up Local Mode by installing the Desktop Bridge Plugin in Figma, or restarting Figma with `--remote-debugging-port=9222`."

Do not attempt any sync steps without a confirmed Local Mode connection.

## Prerequisites

Before doing anything else, verify Local Mode is active:

```
figma_get_status()
```

Inspect the response:

- `setup.valid: true` + `setup.transport: "websocket"` or `"cdp"` → ✅ proceed
- `setup.valid: false` or `setup.transport: "none"` → ❌ stop and guide the user

**If not connected, tell the user:**

> "Figma Console MCP is not connected in Local Mode. To use this skill you need to either:
>
> 1. **Recommended:** Install the Desktop Bridge Plugin — Figma → Plugins → Development → Import from manifest
> 2. **Alternative (macOS):** `open -a "Figma" --args --remote-debugging-port=9222`
> 3. **Alternative (Windows):** `%LOCALAPPDATA%\Figma\Figma.exe --remote-debugging-port=9222`"

Once confirmed, if a Figma file URL is provided, navigate to it:

```
figma_navigate({ url: 'https://www.figma.com/design/...' })
```

---

## Output Structure

All generated files go into `design-system/`:

```
design-system/
├── tokens/
│   ├── tokens.css          # CSS custom properties for all design tokens
│   └── tokens.ts           # TypeScript token map (for JS consumers)
├── components/
│   └── [ComponentName]/
│       ├── [ComponentName].tsx
│       └── [ComponentName].module.css
└── stories/
    └── [ComponentName].stories.tsx
```

---

## Workflow

**Before starting Step 1**, check whether a `design-system/` folder already exists in the codebase. This determines which path to take:

- **No `design-system/` folder found** → Fresh sync. Proceed to Step 1.
- **`design-system/` folder exists** → Existing design system detected. Run the **Drift Audit** (Step 0) before syncing.

---

### Step 0 — Drift Audit (Existing Design Systems Only)

When `design-system/` already exists, run a full drift audit before overwriting anything. The goal is to surface what has changed in Figma since the last sync, and what may have drifted in code.

**0a. Read existing token values from code**

Parse `design-system/tokens/tokens.css` to extract all current CSS custom property values. Build a map of `{ tokenName → currentCodeValue }`.

**0b. Fetch current Figma token values and compare**

```
figma_get_variables({ enrich: true, export_formats: ['css'] })
figma_get_token_values({})
```

For each token, compare Figma vs code and categorize:

- **Match** → no drift
- **Value differs** → `UPDATED_IN_FIGMA`
- **Exists in code, gone from Figma** → `REMOVED_IN_FIGMA`
- **Exists in Figma, missing from code** → `ADDED_IN_FIGMA`

**0c. Run parity check for each existing component**

For every component found in `design-system/components/`, read its `.tsx` and `.module.css` to extract current visual, spacing, and typography values. Then call:

```
figma_check_design_parity({
  nodeId: '<component nodeId>',
  codeSpec: {
    visual: { /* values parsed from .module.css */ },
    spacing: { /* padding/gap values parsed from .module.css */ },
    typography: { /* font values parsed from .tsx or .module.css */ },
    metadata: {
      name: 'ComponentName',
      filePath: 'design-system/components/ComponentName/ComponentName.tsx'
    }
  },
  canonicalSource: 'design'
})
```

Collect the parity score and discrepancies for every component.

**0d. Present the drift report and ask for confirmation**

Show the user a full drift summary before touching any files:

```
🔍 Drift Audit — design-system/ already exists
──────────────────────────────────────────────
Token Drift (42 total):
  ✅ 38 tokens match Figma
  🟡  3 tokens updated in Figma:
      --color-brand-primary   #0052CC → #0047B3
      --spacing-lg            24px    → 28px
      --radius-md             6px     → 8px
  🔴  1 token removed from Figma:
      --color-accent-teal (no longer exists)
  🆕  2 tokens added in Figma:
      --color-brand-tertiary
      --spacing-2xl

Component Drift:
  Button  Parity: 78/100  ⚠️  2 critical, 1 minor
    • border-radius  code=6px  Figma=8px  [CRITICAL]
    • font-weight    code=500  Figma=600  [MAJOR]
  Input   Parity: 100/100 ✅ no drift
  Card    Parity: 91/100  ℹ️  1 minor
    • box-shadow: raw value in code, token exists in Figma

Proceed with sync? This will overwrite drifted files to match Figma.
```

**Only continue once the user confirms.** If they want to review specific drifts first, address their questions before writing any files.

---

### Step 1 — Discover the Design System

Survey the Figma file to understand what's available. Use these tools in order:

**1a. Get high-level overview** (Local Mode only):

```
figma_get_design_system_summary()
```

Returns component count, variable collections, style summary, and page structure.

**1b. Get all design tokens/variables:**

```
figma_get_variables({
  enrich: true,
  export_formats: ['css']
})
```

Returns variable collections with values per mode. If the file doesn't use variables (Enterprise plan required), it auto-falls back to Styles API.

**1c. Get all styles:**

```
figma_get_styles({
  enrich: true,
  export_formats: ['css']
})
```

Returns color styles, text styles, and effect styles.

**1d. Search for components** (Local Mode only):

```
figma_search_components({ query: '' })
```

Pass an empty string to list all components.

Summarize findings to the user:

- Number of token collections and variables
- Modes found (e.g., Light/Dark)
- Number of components by category
- Any styles found

Ask: **Sync everything, or a specific subset?**

---

### Step 2 — Generate Design Tokens

From the variables and styles retrieved, generate `design-system/tokens/tokens.css`.

**Token naming rules:**

- Use CSS custom properties: `--token-name: value`
- Namespace by category: `--color-*`, `--spacing-*`, `--font-size-*`, `--radius-*`, `--shadow-*`, etc.
- Convert Figma variable names to CSS: replace `/` with `-`, lowercase everything
  - Figma: `color/brand/primary` → CSS: `--color-brand-primary`
  - Figma: `spacing/md` → CSS: `--spacing-md`
- For multi-mode variables (e.g., Light/Dark), use `:root` for the default mode and `[data-theme="dark"]` for overrides
- Use `figma_get_token_values` to get resolved values filtered by collection or mode if needed

**If variables aren't available**, fall back to styles from `figma_get_styles`. Map color style names to `--color-*` tokens.

**Example output:**

```css
/* design-system/tokens/tokens.css */
/* Auto-generated from Figma. Do not edit manually. */

:root {
  /* Color */
  --color-brand-primary: #0052cc;
  --color-brand-secondary: #0065ff;
  --color-neutral-100: #f4f5f7;
  --color-neutral-900: #172b4d;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;

  /* Typography */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-body: 16px;
  --font-size-lg: 20px;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --color-brand-primary: #4c9aff;
  --color-neutral-100: #1d2125;
  --color-neutral-900: #f4f5f7;
}
```

Also generate `design-system/tokens/tokens.ts`:

```ts
/* Auto-generated from Figma. Do not edit manually. */
export const tokens = {
  color: {
    brand: {
      primary: "var(--color-brand-primary)",
      secondary: "var(--color-brand-secondary)",
    },
    neutral: {
      100: "var(--color-neutral-100)",
      900: "var(--color-neutral-900)",
    },
  },
  spacing: {
    xs: "var(--spacing-xs)",
    sm: "var(--spacing-sm)",
    md: "var(--spacing-md)",
  },
} as const;
```

---

### Step 3 — Generate React Components

For each component to sync:

**3a. Get component specs for development:**

```
figma_get_component_for_development({
  nodeId: '123:456',
  includeImage: true
})
```

This returns layout, padding, spacing, visual properties, typography, variants, and a rendered image reference. Use this as the primary source for code generation.

**3b. If you need full variant/property details:**

```
figma_get_component_details({ componentKey: 'abc123def456' })
```

**3c. If you need the full component metadata:**

```
figma_get_component({ nodeId: '123:456', format: 'metadata' })
```

**Component generation rules:**

- Props must map directly to Figma component properties
  - Figma variant property with values `["primary", "secondary", "ghost"]` → TypeScript `variant?: 'primary' | 'secondary' | 'ghost'`
  - Figma boolean property `"Show Icon"` → TypeScript `showIcon?: boolean`
  - Figma text property `"Label"` → TypeScript `label?: string`
- All style values must reference CSS custom properties from `tokens.css` — **never hardcode hex values, pixel values, or font sizes**
- Use semantic HTML elements (`<button>`, `<input>`, `<nav>`, `<header>`, etc.)
- Always include a `className` prop for consumer extension
- Export a TypeScript interface for props
- Add `/* TODO: not in Figma tokens */` inline comments for any value that couldn't be mapped

**CSS Module rules:**

- Import tokens at the top: `@import '../../tokens/tokens.css';`
- Class names in camelCase matching their semantic role
- Every style value uses `var(--token-name)`
- No magic numbers without a token

**Example output:**

```tsx
// design-system/components/Button/Button.tsx
/* Auto-generated from Figma. Do not edit manually. */
import styles from "./Button.module.css";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  showIcon?: boolean;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const Button = ({
  variant = "primary",
  size = "md",
  disabled = false,
  showIcon = false,
  label = "Button",
  className,
  onClick,
}: ButtonProps) => (
  <button
    className={[styles.root, styles[variant], styles[size], className]
      .filter(Boolean)
      .join(" ")}
    disabled={disabled}
    onClick={onClick}
  >
    {showIcon && <span className={styles.icon} aria-hidden="true" />}
    {label}
  </button>
);
```

```css
/* design-system/components/Button/Button.module.css */
/* Auto-generated from Figma. Do not edit manually. */
@import "../../tokens/tokens.css";

.root {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-body);
  cursor: pointer;
  border: none;
  transition: background 0.15s ease;
}

.primary {
  background: var(--color-brand-primary);
  color: var(--color-neutral-100);
}

.secondary {
  background: transparent;
  border: 1px solid var(--color-brand-primary);
  color: var(--color-brand-primary);
}

.ghost {
  background: transparent;
  color: var(--color-brand-primary);
}

.sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}
.md {
  padding: var(--spacing-sm) var(--spacing-md);
}
.lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}
```

---

### Step 4 — Generate Storybook Stories

For each component, generate `design-system/stories/[ComponentName].stories.tsx`.

**Story rules:**

- Use Storybook 7+ CSF3 format with `satisfies Meta<typeof Component>`
- Always include a `Default` story
- Add one story per major variant
- Use `args` for all interactive props
- Add `argTypes` with controls for every prop
- Tag with `['autodocs']` for auto-documentation

**Example output:**

```tsx
// design-system/stories/Button.stories.tsx
/* Auto-generated from Figma. Do not edit manually. */
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button/Button";

const meta = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    showIcon: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Button", variant: "primary", size: "md" },
};

export const Secondary: Story = {
  args: { label: "Button", variant: "secondary", size: "md" },
};

export const Ghost: Story = {
  args: { label: "Button", variant: "ghost", size: "md" },
};

export const WithIcon: Story = {
  args: { label: "Button", variant: "primary", size: "md", showIcon: true },
};

export const Disabled: Story = {
  args: { label: "Button", variant: "primary", size: "md", disabled: true },
};
```

---

### Step 5 — Design-Code Parity Check (Optional but Recommended)

After generating components, run a parity check to validate the generated code against Figma:

```
figma_check_design_parity({
  nodeId: '123:456',
  codeSpec: {
    visual: { borderRadius: 6, backgroundColor: '#0052CC' },
    spacing: { paddingTop: 8, paddingRight: 16, paddingBottom: 8, paddingLeft: 16 },
    typography: { fontSize: 16, fontWeight: 500 },
    metadata: { name: 'Button', filePath: 'design-system/components/Button/Button.tsx' }
  },
  canonicalSource: 'design'
})
```

The parity check returns a score (0–100) and lists discrepancies by severity (critical / major / minor). Address any critical or major issues before considering the sync complete.

Optionally post a comment to Figma to record the sync:

```
figma_post_comment({
  message: '✅ Design system synced to code. Tokens: 42 vars. Components: Button, Input, Card. Generated: CSS Modules + Storybook stories.',
  node_id: '123:456'
})
```

---

### Step 6 — Report What Was Synced

After all files are written, provide a clear summary. Tailor the report to whether this was a fresh sync or an update of an existing design system.

**Fresh sync:**

```
✅ Figma → Code Sync Complete (Fresh)
──────────────────────────────────────────
Source: Figma Console MCP (Local Mode)

Tokens:    42 variables → design-system/tokens/tokens.css
                        → design-system/tokens/tokens.ts

Components:
  ✅ Button  → design-system/components/Button/
  ✅ Input   → design-system/components/Input/
  ✅ Card    → design-system/components/Card/

Stories:
  ✅ Button.stories.tsx
  ✅ Input.stories.tsx
  ✅ Card.stories.tsx

Parity Scores:
  Button: 94/100
  Input:  100/100
  Card:   100/100

⚠️  TODOs:
  - Button: border-width (1px) not found in tokens → marked TODO
```

**Existing design system (post-drift-audit):**

```
✅ Figma → Code Sync Complete (Updated)
──────────────────────────────────────────
Source: Figma Console MCP (Local Mode)

Drift resolved:
  Tokens:  3 updated, 1 removed, 2 added
  Button:  2 critical drifts fixed (border-radius, font-weight)
  Card:    1 minor drift fixed (box-shadow now uses token)
  Input:   No changes needed

Files updated:
  design-system/tokens/tokens.css   (5 token changes)
  design-system/tokens/tokens.ts    (5 token changes)
  design-system/components/Button/Button.module.css
  design-system/components/Card/Card.module.css

No changes:
  design-system/components/Input/   (already in sync)

⚠️  TODOs remaining:
  - Button: outline-width not in Figma tokens → still marked TODO
```

Flag all unmapped values inline as `/* TODO: not in Figma tokens — value: Xpx */`.

---

## Key Principles

1. **Figma is the source of truth.** Never invent design values. If a value isn't in Figma, flag it.
2. **Tokens first.** Every component style must trace back to a CSS custom property.
3. **Variants = props.** Every Figma component property becomes a TypeScript prop.
4. **Stay in sync.** Re-running this skill overwrites and updates files — it does not append.
5. **Flag unknowns.** If a value can't be mapped, leave a `/* TODO: */` comment rather than guessing.
6. **Don't touch non-design-system files.** Only write within `design-system/`. Never modify app code.
7. **Auto-generated header.** Every file must include `/* Auto-generated from Figma. Do not edit manually. */`.

---

## Figma Console MCP Tool Reference

| Tool                                  | Purpose                                             | Mode           |
| ------------------------------------- | --------------------------------------------------- | -------------- |
| `figma_get_status`                    | Check Desktop Bridge connection health              | All            |
| `figma_navigate`                      | Open a Figma file URL and start monitoring          | All            |
| `figma_get_design_system_summary`     | High-level overview: components, variables, styles  | **Local only** |
| `figma_get_variables`                 | All design tokens with values per mode + CSS export | All            |
| `figma_get_token_values`              | Get variable values filtered by collection/mode     | **Local only** |
| `figma_get_styles`                    | Color, text, and effect styles + CSS export         | All            |
| `figma_search_components`             | List/find components by name                        | **Local only** |
| `figma_get_component_details`         | Full variant + property info for a component        | **Local only** |
| `figma_get_component_for_development` | Layout + visual specs + rendered image for code gen | All            |
| `figma_get_component`                 | Full component metadata or reconstruction spec      | All            |
| `figma_check_design_parity`           | Compare generated code against Figma specs          | All            |
| `figma_generate_component_doc`        | Generate markdown docs from Figma + code info       | All            |
| `figma_post_comment`                  | Post sync summary as a Figma comment                | All            |
| `figma_get_comments`                  | Review existing comments/feedback on a file         | All            |

**Always call `figma_get_status` first.** Never assume the connection is active. If `setup.valid` is false, guide the user through setup before proceeding.
