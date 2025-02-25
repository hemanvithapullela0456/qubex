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
    errors: ErrorDetail[];
    suggestions: Suggestion[];
    bestPractices: BestPractice[];
    documentation: Documentation;
    timestamp: string;
  }
  