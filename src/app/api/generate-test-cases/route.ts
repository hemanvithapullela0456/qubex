import { NextRequest, NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

// Map languages to their corresponding test frameworks
const testFrameworks: Record<string, string> = {
  "javascript": "Jest or Mocha",
  "typescript": "Jest or Mocha",
  "python": "PyTest or Unittest",
  "java": "JUnit",
  "c": "CUnit or a custom test framework",
  "cpp": "Google Test (gtest) or a custom test framework",
  "c++": "Google Test (gtest) or a custom test framework",
};

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();
    const normalizedLang = language.toLowerCase();
    const testFramework = testFrameworks[normalizedLang] || "a suitable test framework";

    // Construct AI prompt
    const prompt = `You are an expert in writing unit tests for different languages.
    Given the following ${normalizedLang} function:
    
    ${code}
    
    Write complete test cases using ${testFramework}. Ensure they are properly formatted and executable.`;
    

    // Generate test cases using Cohere API
    const response = await cohere.generate({
      prompt,
      model: "command",
      maxTokens: 500,
      truncate: "END",
    });

    const generatedText = response.generations[0]?.text.trim() || "No test cases generated.";

    return NextResponse.json({
      testCases: generatedText,
    });
  } catch (error) {
    console.error("Error generating test cases:", error);
    return NextResponse.json(
      { error: "Failed to generate test cases" },
      { status: 500 }
    );
  }
}
