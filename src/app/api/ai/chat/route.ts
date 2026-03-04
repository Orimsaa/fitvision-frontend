import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    try {
        const client = new OpenAI({
            apiKey: process.env.AI_API_KEY,
            baseURL: process.env.AI_BASE_URL,
        });

        const body = await request.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Missing messages array" }, { status: 400 });
        }

        const systemMessage = {
            role: "system" as const,
            content: `You are FitVision AI Coach — a world-class fitness and biomechanics expert powered by advanced AI.

Your role:
- Help users improve their exercise form
- Answer questions about fitness, exercise technique, injury prevention, and workout programming
- Provide science-backed advice on biomechanics and movement patterns
- Be encouraging, supportive, and motivational
- Keep responses concise and practical (not too long)

Exercises you specialize in: Bench Press, Squat, Deadlift (but can discuss any exercise)

Rules:
- Always prioritize safety
- If someone describes pain, recommend they see a medical professional
- Use bullet points and short paragraphs for readability
- You can use emoji sparingly for friendliness
- Reply in the same language the user is using (Thai or English)`
        };

        const response = await client.chat.completions.create({
            model: process.env.AI_MODEL || "gemini-2.5-flash-lite",
            messages: [systemMessage, ...messages],
            stream: false,
        });

        const content = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
        return NextResponse.json({ message: content });
    } catch (error: any) {
        console.error("Chat API Error:", error?.message || error);
        return NextResponse.json(
            { error: "Chat failed", detail: error?.message },
            { status: 500 }
        );
    }
}
