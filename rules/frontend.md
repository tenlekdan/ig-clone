# gitlab-duo-rules/frontend.md

## Context

This document outlines the frontend development rules for GitLab Duo, a React-based application. These guidelines enforce a consistent, high-quality, and scalable codebase. We prioritize developer experience, performance, and maintainability by leveraging a specific tech stack: **React, TypeScript, React Query, React Window, Axios, Bootstrap CSS, ECharts, GitLab, and our internal library `xyz`**. All rules are designed to align with these technologies and the GitLab CI/CD workflow, including integration with GitLab Duo's AI features.

---

## 1. Component Architecture

### Guidelines

* **Structure**: Organize the `src` directory by feature, not by type. A typical feature directory, like `src/features/chat`, should contain all its related components, hooks, and logic. This co-location improves discoverability and reduces file-hopping. For complex components, consider splitting them into **container** (logic) and **presentational** (UI) components to reduce cognitive load and improve testability.
* **Naming**: Use `PascalCase` for all component file names and their corresponding exports (e.g., `ChatWindow.tsx`). Use `camelCase` for custom hooks (e.g., `useChatState.ts`) and `kebab-case` for CSS Modules (`chat-window.module.css`).
* **Single Responsibility Principle**: Each component must have a single, well-defined responsibility. A `ChatWindow` component might render the chat interface, while a smaller `ChatMessage` component handles a single message.
* **Props**: Use TypeScript interfaces to define `props` for every component. This ensures type safety, provides a clear contract for how a component is used, and improves IDE support.
* **Internal Library (`xyz`)**: Utilize components and utilities from our internal `xyz` library to maintain a consistent UI and avoid re-implementing common functionality.

project structure(guidlines)
├── src/
│   ├── api/
│   │   ├── index.ts              # Centralized Axios instance
│   │   └── featureApi.ts         # API functions for a specific feature
│   ├── hooks/
│   │   ├── useSomeHook.ts        # Custom React hooks
│   │   └── useApiCall.ts
│   ├── types/
│   │   ├── apiTypes.ts           # TypeScript interfaces for API responses
│   │   └── componentTypes.ts     # TypeScript interfaces for component props
│   ├── utility/
│   │   ├── helpers.ts            # General helper functions (e.g., date formatting)
│   │   └── validation.ts         # Validation utilities
│   ├── context/
│   │   ├── AuthContext.tsx       # Context providers and hooks
│   │   └── ThemeContext.tsx
│   ├── view/
│   │   ├── feature1/             # Feature-specific components
│   │   │   ├── Feature1Component.tsx
│   │   │   └── sub-components/
│   │   ├── feature2/
│   │   │   └── Feature2Component.tsx
│   │   ├── common/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Spinner.tsx
│   │   └── containers/           # Layout components
│   │       ├── MainLayout.tsx
│   │       └── AuthLayout.tsx
│   ├── config/
│   │   └── appConfig.ts          # Application-wide configuration (e.g., API URLs)
│   ├── metadata/
│   │   └── featureMetadata.ts    # Data for populating forms, dropdowns, etc.
│   └── styles/
│       ├── _mixins.scss          # SCSS mixins
│       ├── _variables.scss       # SCSS variables
│       └── global.scss           # Global styles
└── ...

---

## 2. TypeScript and Clean Coding

### Guidelines

* **TypeScript Strictness**: All new code must be written in TypeScript with strict mode enabled in `tsconfig.json`. This includes explicit typing for all function parameters, return values, and state variables. Avoid using the `any` type; prefer `unknown` with type guards.
* **DRY Principle**: Avoid code duplication. Create reusable components, custom hooks, and utility functions for shared logic.
* **Small Functions**: Keep functions focused and small, ideally under 20 lines. This enhances readability and makes unit testing easier.
* **Constants**: Centralize all application-wide constants, such as API endpoints and feature flags, in `src/config/constants.ts` to ensure a single source of truth.
* **ESLint & Formatting**: The codebase must adhere to the **Airbnb React style guide** via ESLint. This is enforced in the CI pipeline to maintain a consistent style.

---

## 3. Data Fetching (React Query & Axios)

### Guidelines

* **Centralized APIs**: All API endpoints and client configurations must be defined in `src/api/` and use **Axios**. Use a centralized Axios instance with interceptors for authentication and error handling.
* **`useQuery` for Caching**: Use `useQuery` for all GET requests. React Query handles caching, re-fetching, and background updates, significantly improving performance and developer experience.
* **`useMutation` for Changes**: Use `useMutation` for non-GET requests (e.g., POST, PUT, DELETE). This provides predictable state updates and robust error handling.
* **`xyz` Integration**: Leverage the API utilities provided by our `xyz` library (e.g., `xyz.apiClient`) for standardized request configurations. Wrap these utilities in React Query hooks for a unified data-fetching approach.
* **Optimistic Updates**: For a better user experience on mutations, implement optimistic updates to provide instant feedback while ensuring data integrity.

---

## 4. Virtualization (React Window)

### Guidelines

* **Large Lists**: Use `FixedSizeList` or `VariableSizeList` from **React Window** for all lists containing more than 50 items. This renders only the visible items, drastically improving performance and memory usage.
* **Accessibility**: Always include a `ref` and appropriate `aria` attributes to ensure the virtualized list is accessible to screen readers and keyboard navigation.
* **Data Integration**: Combine React Window with React Query's infinite queries for large datasets that require pagination or infinite scrolling.

---

## 5. Styling (Bootstrap CSS)

### Guidelines

* **Utility Classes**: Prefer using **Bootstrap's utility classes** (e.g., `p-3`, `d-flex`, `text-center`) for layout and rapid styling. This reduces custom CSS and promotes consistency.
* **Custom Styles**: For component-specific styles that Bootstrap cannot provide, create **CSS Modules** files (`.module.css`) in a `src/styles` directory. This scopes the styles and prevents conflicts. You can also leverage Bootstrap's theming via SCSS variable overrides.
* **No Inline Styles**: Avoid inline styles (`style={{...}}`) as they are difficult to maintain, override, and do not adhere to our styling conventions. Only use them for dynamic, runtime values (e.g., `style={{ width: dynamicWidth }}`).

---

## 6. ECharts Integration

### Guidelines

* **Reusable Components**: Encapsulate ECharts logic within dedicated, reusable components.
* **`useRef` & `useEffect`**: Use `useRef` to create a reference to the DOM element for the chart and `useEffect` to initialize the chart instance. The dependency array should contain props that trigger chart updates.
* **Debounced Resizing**: Implement a debounced resize handler to update charts only after the browser window has stopped resizing. This prevents performance bottlenecks.
* **Accessibility**: Provide a text alternative for charts using `aria-label` or a similar attribute to describe the chart's purpose for screen readers.

---

## 7. Accessibility (a11y)

### Guidelines

* **WCAG 2.1**: All components and UI must comply with WCAG 2.1 standards.
* **Color Contrast**: Ensure a minimum color contrast ratio of 4.5:1.
* **Semantic HTML**: Use semantic HTML tags (`<nav>`, `<header>`, `<footer>`, `<main>`, etc.) to provide meaning to the page structure for screen readers and search engines.
* **ARIA Attributes**: Use ARIA attributes (`aria-label`, `aria-labelledby`) to enhance accessibility for interactive elements that lack a clear text label.
* **Keyboard Navigation**: Ensure all interactive elements are reachable and usable via keyboard navigation.
* **Testing**: Use tools like `axe DevTools` and perform manual testing with screen readers (NVDA, VoiceOver) before merging.

---

## 8. Scalability and Optimization

### Guidelines

* **Memoization**: Use `useMemo` for computationally expensive calculations and `useCallback` for functions passed as props to child components. This prevents unnecessary re-renders.
* **Code Splitting**: Use `React.lazy` and `Suspense` for route-based or component-based code splitting. This reduces the initial bundle size and speeds up page load times.
* **Image Optimization**: Optimize all images for the web. Use responsive image sizes (`srcset`) and add `loading="lazy"` to defer image loading until they are in the viewport.
* **Bundle Monitoring**: The CI/CD pipeline will include a step with **Webpack Bundle Analyzer** to monitor and report on bundle size, flagging any significant regressions.

---

## 9. Testing

### Guidelines

* **Unit Tests**: Write unit tests for all components and custom hooks using **Jest** and **React Testing Library**. Focus on testing user behavior and component output rather than internal implementation details.
* **End-to-End Tests**: Use **Cypress** for end-to-end testing of critical user flows.
* **Code Coverage**: Aim for **80%+ code coverage**. The coverage report will be a required CI/CD artifact.




    