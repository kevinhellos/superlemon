export default function ChatBubble(
  { id, role, text, } : 
  { id: string, role: string, text: string }
) {
  return (
    <div
      className={`${role === "user" ? "chat-bubble bg-gray-100 rounded-lg" : ""}`}
      key={`${id}`}
    >
      {text}
    </div>
  )
}
