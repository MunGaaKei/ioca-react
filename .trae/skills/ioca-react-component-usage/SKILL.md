---
name: "ioca-react-component-usage"
description: "Guides usage of @ioca/react components by mining this repo’s exports, types, and docs demos. Invoke when user asks how to use any ioca-react component or hook."
---

# IOCA React Component Usage

Use this skill to answer “How do I use X?” questions for this component library by grounding the answer in the repository’s actual exports, props types, and docs demos.

## What to Use as Source of Truth

1. Public exports
    - Check `packages/index.ts` to confirm what is exported from the library entry.
    - Note: the library entry imports the global styles via `import "./css/index.css";`, so usage questions may need to mention CSS inclusion.

2. Implementation + types
    - For a component `X`, inspect:
        - `packages/components/x/index.tsx` (component entry and subcomponents)
        - `packages/components/x/type.ts` (props and public types)
    - If the question is about runtime behavior, read the main implementation file(s) in the same folder (e.g. `input.tsx`, `modal.tsx`).

3. Documentation demos + API tables
    - Prefer docs examples because they encode intended usage:
        - `docs/pages/x/prop.tsx` usually contains:
            - `D*` demo sources (`demo`, `code`, `lang`)
            - `P*` API arrays (prop name/desc/type/default/required)
        - `docs/pages/x/index.tsx` shows how demos are presented and which sections matter.
    - In docs, components are often imported from an alias:
        - `@p` points to `./packages` (see `vite.config.ts`)

## How to Respond (Output Contract)

When asked about a component/hook, produce a repo-grounded answer with this structure:

1. Import
    - Show the import form the user should use (library import) and, if relevant, the docs import alias form.

2. Minimal working example
    - Provide 1 small example taken from (or consistent with) `docs/pages/<component>/prop.tsx`.

3. Key props / API
    - List the most relevant props with their types/defaults based on the `P*` API arrays and/or `type.ts`.

4. Related subcomponents and patterns
    - If the component has namespace subcomponents (e.g. `Input.Number`, `Button.Group`), mention them and show one example.

5. Common pitfalls (only if applicable)
    - Examples: controlled vs uncontrolled, required CSS import, theme interactions, refs.

Keep explanations short; prefer showing correct code.

## Fast Navigation Cheatsheet

- Component list / public exports: `packages/index.ts`
- Components source: `packages/components/<name>/`
- Docs page: `docs/pages/<name>/index.tsx`
- Docs demos + API: `docs/pages/<name>/prop.tsx`
- Theme hook: `packages/js/useTheme/`
- Preview hook: `packages/js/usePreview/`

## Examples (How to Ground Answers)

### Example: “How to use Input?”

Grounding path:

- Demos + API: `docs/pages/input/prop.tsx`
- Types: `packages/components/input/type.ts`

Answer format:

- Import: `import { Input } from "@ioca/react";`
- Example: show `Input`, `Input.Number`, `Input.Range`, `Input.Textarea` patterns mirroring the docs demos.

### Example: “How to open a Modal?”

Grounding path:

- Demos: `docs/pages/modal/prop.tsx` (typically shows `visible` state + `onClose`)
- Types: `packages/components/modal/type.ts`

Answer format:

- Controlled `visible` example with `Button` triggering `setVisible(true)` and `Modal` closing via `onClose`.
