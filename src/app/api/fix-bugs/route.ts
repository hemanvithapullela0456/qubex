import { NextRequest } from "next/server";
import { processCodeWithAI } from "../../lib/aiCodeController"; // Ensure correct import path

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json(); // Parse request body

    if (!code || !language) {
      return new Response(JSON.stringify({ error: "Code and language are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Received Code:", code);
    console.log("Language:", language);

    // Process the code using AI
    const result = await processCodeWithAI(code, language);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Failed to process code" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
