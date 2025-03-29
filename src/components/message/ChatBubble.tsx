import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
// import "highlight.js/styles/github-dark.css";
import "highlight.js/styles/github.css"; // Light mode syntax highlighting
import { useEffect } from "react";

export default function ChatBubble({ id, role, text }: { id: string; role: string; text: string }) {
  useEffect(() => {
    document.querySelectorAll("code").forEach((el) => {
      hljs.highlightElement(el as HTMLElement);
    });
  }, [text]);

  return (
    <div className={`${role === "user" ? "chat-bubble bg-gray-100 rounded-lg" : ""}`} key={id}>
      {role === "user" ? (
        text
      ) : (
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ children, ...props }) {
              return (
                <code className={`hljs text-sm`} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {text}
        </Markdown>
      )}
    </div>
  );
}