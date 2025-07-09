<!-- @format -->

# 💼 VitaAgent – Agentic Resume Critique & Job Match Assistant

VitaAgent is a GenAI-powered web application that helps job seekers analyze, improve, and tailor their resumes for specific job roles. Built with LangChain agents, OpenAI/Groq LLMs, and a full-stack Next.js architecture, VitaAgent delivers a personalized, intelligent, and iterative resume critique experience.

## ✨ Features

- 📄 **Resume Upload & Parsing**
  Upload resumes in PDF format. Extract and store structured resume text for AI processing.

- 🧠 **Agentic Critique & Job Match**
  An intelligent AI assistant that:

  - Critiques resumes based on job descriptions
  - Scores ATS match quality
  - Suggests actionable rewrite strategies and improvements
  - Prioritizes answering user-submitted questions when provided

- 🚣️ **Custom Question Support**
  Users can submit specific questions along with their resume and job description. The AI will tailor its response accordingly, using the Strategy tool when relevant.

- 📊 **Context-Aware Reasoning**
  Uses LangChain.js agents with tools like:

  - ResumeCritiqueTool
  - ATSScoreTool
  - StrategySuggestionTool
  - TrimContentTool (for token optimization)

- 🔐 **User Authentication & Secure Storage**
  Auth flow powered by **Supabase Auth**
  Resume uploads stored in **Supabase Storage** and metadata persisted in Supabase DB.

## 🧱 Tech Stack

| Layer           | Tech                                             |
| --------------- | ------------------------------------------------ |
| Frontend        | Next.js (App Router), Tailwind CSS, shadcn/ui    |
| Backend/API     | Next.js API routes                               |
| AI / GenAI      | OpenAI (gpt-4-turbo, gpt-3.5), Groq (LLaMA3-70B) |
| Agent Framework | LangChain.js & custom tools                      |
| Storage         | Supabase Storage                                 |
| Database        | Supabase Postgres (`resume_uploads` table)       |
| Auth            | Supabase Auth                                    |

## ✨ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/vitaagent.git
cd vitaagent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
GROQ_API_KEY=your-groq-api-key
```

### 4. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🚀

## 🛠️ LangChain Agent Tools

| Tool                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| `ResumeCritiqueTool` | Detailed analysis of resume vs job description |
| `ATSScoreTool`       | Quantitative match score (simulates ATS)       |
| `StrategyTool`       | Suggests high-impact rewrites and strategies   |
| `TrimContentTool`    | Reduces input length to avoid LLM token limits |

## 🧑‍💼 Use Case

1. User uploads a resume PDF.
2. User provides a job description.
3. Optionally, the user submits a question they'd like the assistant to focus on.
4. The assistant answers the question first (if present), then analyzes the resume and JD using critique and scoring tools.

---

## 💬 Contact

Built with ❤️ by Hardik.

If you're hiring or collaborating on GenAI tools, [let's connect](mailto:hardik.dalmia@gmail.com)!
