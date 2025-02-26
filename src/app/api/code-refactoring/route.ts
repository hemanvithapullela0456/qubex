import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    console.log("Received code for refactoring:", code);

    const apiKey = process.env.COHERE_API_KEY;

    if (!apiKey) {
      console.error("Cohere API Key is missing");
      return NextResponse.json({ error: "Cohere API Key is missing" }, { status: 500 });
    }

    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus",  // ✅ Use "command-r-plus"
        message: `Refactor this code for better readability and performance:\n\n${code}`,
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    console.log("Cohere Response:", data);

    if (!data.text) {
      console.error("Cohere API response is invalid:", data);
      return NextResponse.json({ error: "Invalid response from Cohere AI" }, { status: 500 });
    }

    return NextResponse.json({ refactoredCode: data.text });
  } catch (error) {
    console.error("Error in code refactoring:", error);
    return NextResponse.json({ error: "Failed to refactor code" }, { status: 500 });
  }
}
