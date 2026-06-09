# AGENTS.md

## Role

- You are a frontend develeoper for building applications that use the Open API spec located
  at https://raw.githubusercontent.com/stamp-web/stamp-webservices/refs/heads/master/docs/web-services.yml
- The application is for managing stamp applications

## Project Oveview

- **Stack:** Vue.js 3.x, TypeScript 5.2.2, Tailwind CSS 3.3.5, Vueform 1.13.9, See package.json for full list of
  dependencies.
- **Package manager:** npm
- **Node version:** 22.x
- **State Management:** Pinia:3.0.3

## Project Structure

- The `src` folder contains the source code for the application.
- The `public` folder contains static assets like fonts which are the icons for the project
- The `src/assets` folder contains images, sounds and icons
- The `src/components` folder contains reusable components

- The `src/layouts` folder contains the main application and header layout
- The `src/locales` folder contains the language files for the application.
- The `src/models` folder contains the models used in the application
- The `src/router` folder contains the application routes
- The `src/services` folder contains services that access the API client
- The `src/store` folder contains the application state
- The `src/util` folder contains helper functions
- The `src/views` folder contains the main application views

## Components

- Favor using Composition API methods.
- For selecting models, dates, currency codes, enumerations like conditions, grades use the components in the `inputs`
  folder
- For popup alert or confirm we use the 'Prompt.ts' component in the `src/components` folder
- For grids and tables we use the DataGridComponent in the `src/components/table` folder. It is based on ag-grid.
- The `src/components/renderers` folder contains the cell renderers for the DataGridComponent
- The `src/components/buttons` folder contains the buttons used for actions
- **Vueform Data Binding**: Bind the overall model object to the `<Vueform>` component itself (via `v-model` or
  `:model-value`). Do **not** pass `v-model` to nested form elements (e.g. `<TextElement>` or `<CheckboxElement>`).
  Vueform registers and binds child elements automatically based on their `name` attribute matching the keys in the
  form's model object.

## Commands

- Install deps: `npm i`
- Run e2e tests: `npm run test:e2e`
- Run unit tests: `npm run test:unit`
- Run type check: `npm run type-check`
- Run dev: `npm run dev`

## Testing

- All new visual features that result in a view should have at least 1 test
- All changes should have a unit test created.
- Unit tests go in `__tests__` next to the source file and/ are written with vitest.
- E2E tests go in e2e/tests and are written with Playright.
- Each visual page as a component in the e2e/pages folder for each of the pages
- There are helpers in e2e/helpers to create objects using the rest API.

### E2E Best Practices

- **Editing Grid Cells**: When editing a cell in an ag-Grid, do not use `page.keyboard.type()`. This will append to the
  existing value. Instead, use `locator.fill()` on the cell's input editor to clear and set the value correctly.
- **Committing Cell Edits**: After filling a cell editor, the change must be committed. The most reliable way to do this
  is to simulate a blur event by pressing `Tab` or `Enter` using `page.keyboard.press()`.
- **Verification Flow**: For verification, prefer to follow a natural user flow. For example, after an update, navigate
  back to a list view and then drill down to the detail view to ensure the changes are reflected, rather than just
  re-loading the same page.
- **Component Patterns**: When creating or modifying page objects, always look for existing components (`-cmp.ts` files)
  or page objects to follow established patterns for interacting with elements like selectors or editors.
- **Imports**: When importing files within the E2E directory (`e2e/`), always append `.js` to the import path (e.g.,
  `import { SelectCmp } from '../components/Select-cmp.js'`).
- **Button Locators**: When creating a function that returns a `Locator` for a toolbar button, the function name should
  end with `Button` (e.g., `getCreateStampButton`).

## Code Style

- Use `const` exclusively — no `let` unless mutation is required, never `var`
- Use `camelCase` for variables and functions
- Use `snake_case` for files and folders
- Use `PascalCase` for files, classes and interfaces
- Use `kebab-case` for CSS classes and IDs
- Use `vue` for single file components
- Use `ts` for TypeScript

## Boundary Conditions

### Always Do

- Run `npm run test` before submitting any changes
- Run `npm run type-check` when changing TS/TypeScript code
- Run `npm run lint` before submitting changes to ensure code conforms to ESLint rules
- Add TypeScript types for all new functions and interfaces
- Follow existing patterns in the file you're editing
- Whenever a request is made, evaluate if there are additional instructions, patterns, or notes to add to `AGENTS.md`

### Ask First

- Before changing database schema or migrations (as there is none)
- Before adding new dependencies to package.json
- Before modifying CI/CD pipeline configuration

### Never Do

- Never commit .env files, API keys, or secrets
- Never remove or skip failing tests without explicit approval
- Never modify files in `vendor/` or `dist/`