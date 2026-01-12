# Velnora

**The Developer-First Microfrontend Runtime.**

Velnora is a next-generation platform for building scalable, independent microfrontends without the headaches. Built on Vite, Node, and TypeScript, it orchestrates fully isolated applications within a single shell—giving you the freedom to mix frameworks, share code safely, and ship faster.

---

## Why Velnora?

Modern frontend development is complex. You have legacy apps, strict SSR requirements, and a mix of various framework versions. Velnora solves the chaos by treating every app as its own universe.

### 🚀 True Independence
Run different frameworks (React, Vue, Svelte, etc.) or different versions of the same framework side-by-side. Upgrade your legacy dashboard without breaking your new analytics page. Each app manages its own dependency graph, ensuring zero conflicts.

### ✨ Zero Boilerplate DX
Focus on your code, not the glue. Velnora's intelligent plugins automatically inject lifecycle methods like `mount` and `render` at build time.
*   **No manual entry points.**
*   **No complex wiring.**
*   Just write standard `client/app.tsx` or use the `appDir` router, and Velnora handles the rest.

### 🧩 Smart Code Sharing
Share UI libraries without the typical "version hell." Shared components bind to the *consumer's* framework version, not the producer's. Reuse your Design System everywhere, regardless of the app's framework version.

### ⚡ Framework-Agnostic Routing
A powerful Router Core orchestrates navigation across your entire platform. Move seamlessly between apps (`/dashboard` → `/settings`) with a unified browser history and zero page reloads.

### 🔗 Borderless Communication
Micro apps in Velnora are not just isolated UI islands. They seamlessly connect client and server logic.
*   **Unified Graph**: Client-side logic can transparently invoke server-side handlers.
*   **Typed Contracts**: Define your API surface once and get full type-safety across the boundary.
*   **Velnora Handles the Plumbing**: No need to manually configure Express/Fastify routes or CORS. It's just function calls.

---

## How It Works

Velnora rethinks the microfrontend architecture to prioritize stability and developer experience.

### 1. The Apps (Microfrontends)
All applications in Velnora, including the Host, share a unified architecture.
*   **Uniform Functionality**: Any app can be configured to serve the root path (`/`) and act as the main entry point.
*   **Autonomous Builds**: Each app is built independently.
*   **Resolution Scopes**: Dependencies are resolved relative to the specific app, ensuring complete isolation.
*   **CSR & SSR**: Full support for both Client-Side and Server-Side Rendering.

### 2. The Composition
When a user navigates, Velnora dynamically loads the correct app and composes the output—whether it's a client-side mount or a server-side HTML stream.

---

## Architecture at a Glance

| Feature | Implementation | benefit |
| :--- | :--- | :--- |
| **Routing** | Global Router Core | Consistent navigation without page reloads. |
| **Isolation** | Unique Resolution Scopes | Different framework versions coexist perfectly. |
| **SSR** | Per-App Renderer | No conflicts on the server; robust SEO. |
| **Data** | Borderless Handlers | Seamless, typed client-server communication. |
| **Registry** | `@velnora:applications` | Zero-configuration app discovery. |

---

## What Velnora Is Not

*   ❌ **It is NOT Module Federation.** We do not force shared singletons or webpack-specific constraints.
*   ❌ **It is NOT a Monolith.** Your apps are decoupled at build time and deploy time.
*   ❌ **It is NOT "Just a Router."** It is a complete lifecycle runtime that handles the hard parts of orchestration for you.

---

**Ready to build the future of frontend?**
Dive into the `examples/` directory to see Velnora in action.
