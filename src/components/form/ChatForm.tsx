"use client";

import { appData } from "@/app";
import { Send } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export type AIModel = "gpt-4o" | "o1-mini" | "o3-mini";

export default function ChatForm(
  { handleSubmit, input, handleInputChange, aiModel, setAiModel} : 
  { handleSubmit: any, 
    input: string, 
    handleInputChange: any, 
    aiModel: AIModel, 
    setAiModel: Dispatch<SetStateAction<AIModel>>}
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
          required
        />

      {/* <select 
        className="k-model-selector"
        name="ai-model-selector" 
        id="ai-model-selector"
        value={aiModel}
        onChange={(e) => setAiModel(e.target.value as AIModel)}
        disabled
      >
        <option value="gpt-4o">gpt-4o</option>
        <option value="o1-mini">o1-mini</option>
        <option value="o3-mini">o3-mini</option>
      </select> */}

        <button
          type="submit"
          className="h-10 w-11 mt-[10px] me-2 hover:bg-gray-50 active:bg-gray-100 rounded-3xl cursor-pointer"
        >
          <Send strokeWidth="1.5" size="19" className="mx-auto text-center" />
        </button>
      </form>
      
      <span className="text-xs block text-gray-300 text-center mb-1">
        {process.env.NEXT_PUBLIC_APP_NAME} version {appData.version}
      </span>
    </div>
  )
}
