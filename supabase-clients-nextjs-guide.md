
# 📘 Supabase Clients & Providers in Next.js (App Router vs Pages Router)

When using Supabase with **Next.js**, it's critical to choose the right client/provider based on:

- Whether you are in a **client component**, **server component**, or **API route**
- Whether you’re using the **App Router (`app/`)** or the **Pages Router (`pages/`)**

---

## 🧠 Core Concepts

### 1. Supabase Client
This is how you interact with Supabase features (auth, database, storage, etc.).

### 2. Execution Context
Supabase clients differ based on whether the code runs:
- In the **browser (client-side)**
- On the **server (server-side rendering, API routes, server actions)**

### 3. Routing Mode
- **Pages Router**: legacy style with `pages/`
- **App Router**: modern style with `app/`

---


## ✅ 1. `createBrowserSupabaseClient`

```ts
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

const supabase = createBrowserSupabaseClient();
```

**Where to use:**
- Inside client components (`"use client"` React components)
- For login, signup, client-side fetches

**Limitations:**
- Doesn't read cookies on SSR
- Requires `<SessionContextProvider>` to persist sessions

---

## ✅ 2. `createServerComponentClient`

```ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createServerComponentClient({ cookies });
```

**Where to use:**
- Server components in the **App Router** (`app/layout.tsx`, `app/page.tsx`)

**Strengths:**
- Reads session from cookies
- Ideal for secure SSR data fetching

---

## ✅ 3. `createServerClient`

```ts
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

const supabase = createServerClient({ cookies, headers });
```

**Where to use:**
- Inside **`app/api/`** routes
- In **server actions**

**Strengths:**
- Reads session securely via headers and cookies
- Allows mutation queries server-side (insert, delete, etc.)

---

## ✅ 4. `createPagesServerClient`

```ts
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

const supabase = createPagesServerClient({ req, res });
```

**Where to use:**
- Inside `pages/api/` routes
- In `getServerSideProps`

**Strengths:**
- Fully compatible with Pages Router
- Reads and sets auth cookies securely

---

## 🚀 Recommended Usage Based on Routing Strategy

| Use Case                        | Pages Router       | App Router         |
|---------------------------------|--------------------|--------------------|
| Client-side auth                | ✅ `createBrowserSupabaseClient` | ✅ `createBrowserSupabaseClient` |
| Server-side rendering (SSR)     | ✅ `createPagesServerClient`    | ✅ `createServerComponentClient` |
| Server API routes               | ✅ `createPagesServerClient`    | ✅ `createServerClient`          |
| Session context (hooks)         | ✅ `<SessionContextProvider>`   | ✅ `<SessionContextProvider>`   |

---

## ⚠️ Notes

- Always wrap your app with `<SessionContextProvider>` for the `useSupabaseClient()` and `useUser()` hooks to work properly.
- `createBrowserSupabaseClient` is marked **deprecated** in typings but is still the officially supported browser client for `auth-helpers-nextjs` as of now.
- For new projects using the **App Router**, prefer `createServerComponentClient` and `createServerClient`.

---

## 🧠 Final Tips

- Use the **browser client** only in `"use client"` components.
- Use the **server component client** for reading data securely during SSR.
- Use the **server API client** (`createServerClient`) when handling form submissions or file uploads via API routes.
- Always ensure cookies and headers are passed when using the server-side clients.

---
