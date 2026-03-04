import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env.AI_BASE_URL,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { errorTitle, errorDetail, exercise, timestamp } = body;

        if (!errorTitle) {
            return NextResponse.json({ error: "Missing error data" }, { status: 400 });
        }

        const systemPrompt = `You are FitVision AI Coach — a world-class biomechanics and fitness expert. You analyze exercise form errors detected by AI pose estimation.

Your responses should be:
- Concise and actionable (2-4 bullet points max)
- Written in a supportive, coaching tone
- Based on sports science and biomechanics principles
- Include specific corrective exercises when relevant

Format your response as JSON with this structure:
{
  "severity": "high" | "moderate" | "low",
  "summary": "One sentence summary of the issue",
  "corrections": [
    { "title": "Short title", "description": "Brief explanation", "icon": "material_icon_name" }
  ],
  "trainerNote": "A personalized coaching note (1-2 sentences)",
  "warmupTip": "A specific warm-up exercise to prevent this issue"
}`;

        const userPrompt = `Analyze this exercise form error:
- Exercise: ${exercise || "Unknown"}
- Error: ${errorTitle}
- Details: ${errorDetail || "No additional details"}
- Timestamp in session: ${timestamp || "Unknown"}

Provide corrective feedback as JSON.`;

        const response = await client.chat.completions.create({
            model: process.env.AI_MODEL || "gemini-2.5-flash-lite",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            stream: false,
        });

        const content = response.choices[0]?.message?.content || "";

        // Try to parse JSON from the response
        let parsed;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
            const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
            parsed = JSON.parse(jsonStr);
        } catch {
            // If parsing fails, return raw text as a fallback
            parsed = {
                severity: "moderate",
                summary: content.substring(0, 200),
                corrections: [
                    { title: "Review Form", description: content.substring(0, 300), icon: "fitness_center" }
                ],
                trainerNote: "Please review the AI analysis above for personalized guidance.",
                warmupTip: "Always warm up thoroughly before heavy lifts."
            };
        }

        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error("AI API Error:", error?.message || error);
        return NextResponse.json(
            { error: "AI analysis failed", detail: error?.message },
            { status: 500 }
        );
    }
}
