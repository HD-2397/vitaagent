/** @format */

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#1e1e1e] text-gray-400 text-sm px-4 py-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-center sm:text-left">
          © {new Date().getFullYear()} Hardik • Built with ❤️ using Next.js,
          LangChain, and shadcn/ui
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-center sm:text-right">
          <span>
            Context trimming by <span className="text-white">OpenAI</span>
          </span>
          <span className="hidden sm:inline">|</span>
          <span>
            Critique by <span className="text-white">Groq LLaMA 3 (70B)</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
