export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export function mergeMessages(existingMessages: any[], newMessages: any[]) {
  const messageMap = new Map();
  [...existingMessages, ...newMessages].forEach((msg) => {
    messageMap.set(msg.id, msg);
  });
  return Array.from(messageMap.values());
}

export function setAuthToken(token: string) {
  if (!token) return;
  localStorage.setItem("token", token);
}