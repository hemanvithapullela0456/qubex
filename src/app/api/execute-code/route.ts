import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    console.log("RapidAPI Key from .env.local:", process.env.RAPIDAPI_KEY);

    const { source_code, language_id } = await req.json();

    console.log("Received Request:", { language_id });

    if (!source_code || !language_id) {
      return NextResponse.json(
        { error: "source_code and language_id are required" },
        { status: 400 }
      );
    }

    const submissionResponse = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code,
        language_id,
        stdin: "", // Modify this to pass test case input if needed
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const token = submissionResponse.data.token;
    console.log("Submission Token:", token);

    let result;
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      result = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      console.log("Polling Result:", result?.data);

      if (result?.data?.status?.id > 2) break;
    }

    if (!result?.data) {
      return NextResponse.json({ error: "Execution failed: No response from Judge0" });
    }

    // Check for execution errors
    if (result?.data?.status?.id !== 3) {
      return NextResponse.json({
        error: result?.data?.stderr || "Execution failed",
        status: result?.data?.status,
      });
    }

    console.log("Final Execution Result:", result.data);
    return NextResponse.json({
      stdout: result.data.stdout || "No output",
      stderr: result.data.stderr || "",
      execution_time: result.data.time,
    });
  } catch (error: any) {
    console.error("Execution Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Execution failed" },
      { status: 500 }
    );
  }
}
