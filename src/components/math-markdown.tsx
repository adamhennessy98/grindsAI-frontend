import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export function MathMarkdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={["math-markdown", className].filter(Boolean).join(" ")}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        skipHtml
        components={{
          p: ({ children }) => <p className="m-0 mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="my-3 list-disc pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 list-decimal pl-5">{children}</ol>,
          li: ({ children }) => <li className="my-1">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          code: ({ children }) => (
            <code className="rounded bg-black/[0.05] px-1 py-0.5 font-mono text-[0.92em] dark:bg-white/[0.08]">
              {children}
            </code>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
