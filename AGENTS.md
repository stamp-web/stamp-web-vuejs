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

- For selecting models, dates, currency codes, enumerations like conditions, grades use the components in the `inputs`
  folder
- For popup alert or confirm we use the 'Prompt.ts' component in the `src/components` folder
- For grids and tables we use the DataGridComponent in the `src/components/table` folder. It is based on ag-grid.
- The `src/components/renderers` folder contains the cell renderers for the DataGridComponent
- The `src/components/buttons` folder contains the buttons used for actions

## Commands

- Install deps: `npm i`
- Run tests: `npm run test:e2e`
- Run dev: `npm run dev`

## Testing

- All new visual features that result in a view should have at least 1 test
- All changes should have a unit test created.
- Unit tests go in `__tests__` next to the source file and are written with Jest.
- E2E tests go in e2e/tests and are written with Playright.
- Each visual page as a component in the e2e/pages folder for each of the pages
- There are helpers in e2e/helpers to create objects using the rest API.

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
- Add TypeScript types for all new functions and interfaces
- Follow existing patterns in the file you're editing

### Ask First

- Before changing database schema or migrations (as there is none)
- Before adding new dependencies to package.json
- Before modifying CI/CD pipeline configuration

### Never Do

- Never commit .env files, API keys, or secrets
- Never remove or skip failing tests without explicit approval
- Never modify files in `vendor/` or `dist/`