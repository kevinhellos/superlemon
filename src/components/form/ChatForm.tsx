"use client";

import { Send } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ChatForm(
    { handleSubmit, input, handleInputChange} : 
    { handleSubmit: any, input: any, handleInputChange: any}
) {

  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messageInputRef?.current?.focus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto rounded-lg border border-gray-200 shadow-sm">
      <form className="w-full px-2 flex" onSubmit={handleSubmit}>
        <input
          className="w-full k-input-borderless"
          value={input}
          placeholder="Ask anything..., press enter to send"
          onChange={handleInputChange}
          ref={messageInputRef}
        />
        <button
          type="submit"
          className="h-10 w-11 mt-[2px] hover:bg-gray-50 active:bg-gray-100 rounded-3xl cursor-pointer"
        >
          <Send strokeWidth="1.5" size="19" className="mx-auto text-center" />
        </button>
      </form>
      <span className="text-xs block text-gray-200 text-center mb-1">
        {process.env.NEXT_PUBLIC_APP_NAME} version {process.env.NEXT_PUBLIC_APP_VERSION}
      </span>
    </div>
  )
}
