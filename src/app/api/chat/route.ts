import { auth } from "@/lib/auth/firebase-admin";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30; // Duration for maximum stream

// Define a system prompt to guide the AI's behavior
const SYSTEM_PROMPT = {
    role: "system",
    content: `
        <context>
            You are an AI Chatbot called Superchat. 
            Should a user ask what model is used, say that you have no information of it.
        </context>
    `,
};

export async function POST(req: Request) {
    try {

        // Extract Authorization Header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            // return new Response(JSON.stringify({ error: "Missing or invalid token" }), { status: 401 });
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];

        // Verify Firebase Auth Token
        const decodedToken = await auth.verifyIdToken(token);
        if (!decodedToken) {
            return new Response(JSON.stringify({ error: "Invalid token" }), { status: 403 });
        }

        // Extract messages from request body
        const body = await req.json();
        if (!body?.messages || !Array.isArray(body.messages)) {
            return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
        }

        // Prepend the system prompt to the conversation history
        const modifiedMessages = [SYSTEM_PROMPT, ...body.messages];

        const result = streamText({
            model: openai("gpt-4o"),
            messages: modifiedMessages,
        });

        return result.toDataStreamResponse();
    } 
    catch (error) {
        console.error("Error in /api/chat:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}