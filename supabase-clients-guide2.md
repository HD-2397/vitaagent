# 🤩 Supabase Clients in Next.js — Comparison & Use Cases

Supabase provides several helper clients tailored to different rendering contexts in Next.js. This guide breaks down **which client to use**, **where to use it**, and **why**, based on whether you're using the **App Router** or the **Pages Router**.

---

## 📊 Comparison Table

| ✅ Client Name                   | 📦 Import From                  | 🧠 Used In        | 🍪 Handles Cookies | 🚣️ Works With        | 📌 When to Use                                                                                                   |
| ------------------------------- | ------------------------------- | ----------------- | ------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `createBrowserSupabaseClient()` | `@supabase/auth-helpers-nextjs` | Client Components | ❌ No               | App + Pages Router    | Use inside client-only components (e.g., sign-in forms, buttons) where the session is managed by context.        |
| `createServerComponentClient()` | `@supabase/auth-helpers-nextjs` | Server Components | ✅ Yes              | **App Router Only**   | Use in `layout.tsx`, `page.tsx`, or other Server Components in the `app/` directory. Great for SSR with cookies. |
| `createServerClient()`          | `@supabase/auth-helpers-nextjs` | Server Functions  | ✅ Yes              | **App Router Only**   | Use in `app/api/` routes or server actions when you need full cookie/session context.                            |
| `createPagesServerClient()`     | `@supabase/auth-helpers-nextjs` | Server Functions  | ✅ Yes              | **Pages Router Only** | Use inside `pages/api/` routes or `getServerSideProps()` in the `pages/` directory.                              |

---

## 🌐 When to Use Each Supabase Client

### 1. `createBrowserSupabaseClient()`

* **Where**: Client-side React components
* **Use Cases**:

  * Sign-in and sign-up forms
  * Any UI logic that needs to access Supabase on the client
* **Notes**: Does not read cookies; session must be provided through context (e.g., `SessionContextProvider`).

### 2. `createServerComponentClient()`

* **Where**: App Router's Server Components (e.g., `page.tsx`, `layout.tsx`)
* **Use Cases**:

  * Fetching session-aware data server-side for hydration
  * Secure SSR logic with session context
* **Notes**: Reads cookies automatically; best for RSCs in App Router.

### 3. `createServerClient()`

* **Where**: App Router's server actions and `app/api/` routes
* **Use Cases**:

  * Handling file uploads
  * Working with FormData or complex server logic
  * Inserting authenticated user data
* **Notes**: Needs manual access to `cookies()` and `headers()`; full flexibility in API routes.

### 4. `createPagesServerClient()`

* **Where**: Pages Router's `pages/api/` and `getServerSideProps`
* **Use Cases**:

  * Same use cases as `createServerClient()` but for legacy Pages Router
* **Notes**: Reads cookies and headers for session context.

---

## 📊 Which One Should You Use?

| If you're using...          | Use This Client                 |
| --------------------------- | ------------------------------- |
| Client Component            | `createBrowserSupabaseClient()` |
| App Router Server Component | `createServerComponentClient()` |
| App Router API Route        | `createServerClient()`          |
| Pages Router API/SSR        | `createPagesServerClient()`     |

---

## ⚠️ Common Pitfalls

* `createBrowserSupabaseClient()` **does not** read cookies or provide sessions automatically. You must use the `SessionContextProvider`.
* `createServerComponentClient()` and `createServerClient()` **require** access to `cookies()`/`headers()` in App Router.
* `createServerClient()` **won't work** in Client Components.
* Do **not** use `formidable` with App Router's `app/api` routes. It's Node-specific and incompatible with Next.js' edge/serverless functions. Only use it with `src/pages/api`.

---

## ✨ Summary

If you're using the **App Router**, prefer `createServerComponentClient` for fetching authenticated server-side data and `createServerClient` for handling API logic or mutations.

If you're working in the **Pages Router**, stick with `createPagesServerClient` for server logic and SSR, and use `createBrowserSupabaseClient` for the frontend.

For a seamless experience, always pair your client with `SessionContextProvider` to propagate session state correctly.

---

Happy hacking with Supabase + Next.js! ✨
