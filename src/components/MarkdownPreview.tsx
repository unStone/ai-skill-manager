import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/atom-one-dark.css';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ node, ...props }: any) => (
            <h1 className="text-3xl font-bold mt-6 mb-4 text-slate-900 dark:text-white" {...props} />
          ),
          h2: ({ node, ...props }: any) => (
            <h2 className="text-2xl font-bold mt-5 mb-3 text-slate-900 dark:text-white" {...props} />
          ),
          h3: ({ node, ...props }: any) => (
            <h3 className="text-xl font-bold mt-4 mb-2 text-slate-900 dark:text-white" {...props} />
          ),
          p: ({ node, ...props }: any) => (
            <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }: any) => (
            <ul className="list-disc list-inside mb-4 text-slate-700 dark:text-slate-300" {...props} />
          ),
          ol: ({ node, ...props }: any) => (
            <ol className="list-decimal list-inside mb-4 text-slate-700 dark:text-slate-300" {...props} />
          ),
          li: ({ node, ...props }: any) => (
            <li className="mb-2" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono text-slate-900 dark:text-slate-100" {...props}>
                  {children}
                </code>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          },
          pre: ({ node, ...props }: any) => (
            <pre className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
          ),
          blockquote: ({ node, ...props }: any) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-slate-600 dark:text-slate-400" {...props} />
          ),
          table: ({ node, ...props }: any) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-600" {...props} />
            </div>
          ),
          th: ({ node, ...props }: any) => (
            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-left" {...props} />
          ),
          td: ({ node, ...props }: any) => (
            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2" {...props} />
          ),
          a: ({ node, ...props }: any) => (
            <a className="text-blue-500 hover:underline" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
