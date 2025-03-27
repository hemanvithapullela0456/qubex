export interface ErrorDetail {
    title: string;
    line: string;
    code: string;
    fixedCode: string;
    description: string;
  }
  
  export interface Suggestion {
    title: string;
    code: string;
    explanation: string;
  }
  
  export interface BestPractice {
    title: string;
    code: string;
    explanation: string;
  }
  
  export interface Documentation {
    overview: string;
    functions: string[];
    notes: string;
  }
  export interface FixBugsResponse {
    errors: { title: string; line: number; description: string; code: string; fixedCode: string }[];
    suggestions: { title: string; code: string; explanation: string }[];
    bestPractices: { title: string; code: string; explanation: string }[];
  }
  
  