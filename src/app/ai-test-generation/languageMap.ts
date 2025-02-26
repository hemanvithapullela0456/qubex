const testLanguageMap: Record<string, string> = {
    "javascript": "javascript", // Jest / Mocha
    "typescript": "javascript", // Jest / Mocha (Treat TS as JS)
    "python": "python", // PyTest / Unittest
    "java": "java", // JUnit
    "c": "c", // CUnit / Custom testing
    "cpp": "cpp", // Google Test (gtest) / Custom testing
  };
  
  export default testLanguageMap;
  