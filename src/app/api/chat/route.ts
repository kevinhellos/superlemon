import { auth } from "@/lib/auth/firebase-admin";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 60; // Duration for maximum stream

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

        // Models:
        // gpt-4o
        // o1-mini
        // o3-mini
        const result = streamText({
            // model: openai(body.model),
            model: openai(body.model || "gpt-4o"), // Force to use gpt-4o for now
            messages: modifiedMessages,
        });

        // return result.toDataStreamResponse();

        // Disable the API chat for now
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    } 
    catch (error: any) {
        console.error("[SERVER ERROR]: error in /api/chat: " + error);

        // Handle error codes
        if (error.code.includes("auth/id-token-expired")) {
            return new Response(JSON.stringify({ error: "Relogin required" }), { status: 500 });
        }

        else {
            return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
        }
    }
}