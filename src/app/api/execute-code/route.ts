import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function POST(req: Request) {
  try {
    console.log("RapidAPI Key from .env.local:", process.env.RAPIDAPI_KEY);

    const { source_code, language_id } = await req.json();

    console.log("Input:", { source_code, language_id });

    if (!source_code || !language_id) {
      return NextResponse.json(
        { error: "source_code and language_id are required" },
        { status: 400 }
      );
    }

    const submissionResponse = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      { source_code, language_id },
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

    console.log("Final Execution Result:", result?.data);
    return NextResponse.json(result?.data || { error: "No response from Judge0" });
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Execution failed" },
      { status: 500 }
    );
  }
}