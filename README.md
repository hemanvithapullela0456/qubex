
# <img src="public/image.png" alt="Qubex Logo" width="70" align="center"/> Qubex - AI-Powered Intelligent IDE  

> **Code Faster, Fix Smarter**  

A next-generation **AI-powered code editor** that enhances development efficiency with **AI-driven code completion, debugging, test case generation, and refactoring.** .Built with **Next.js (App Router)**, **Monaco Editor**, **Cohere AI**, **Google Gemini API**, and **Google Vertex AI**, Qubex streamlines coding workflows for **developers, students, and professionals**.

---

## ✨ Features  

### 🔹 **Core Features**  
 **📝 Code Editor** – A **Monaco-powered** editor with **syntax highlighting**, **auto-indentation**, and **bracket matching**.  
 **🤖 AI Code Assistance** – Get **real-time intelligent code suggestions** from **Cohere AI** and **Google Gemini API**.  
 **🔍 AI Debugging Assistant** – Detect and fix **syntax & logical errors** instantly using **Google Vertex AI**.  
 **🛠️ Automated Test Case Generation** – AI **analyzes** functions and generates **reliable test cases**.  
 **📝 Code Refactoring** – Improve code **readability, efficiency, and maintainability** with **Google Vertex AI**.  
 **📂 File Management** – **Create, rename, and delete files** with an intuitive file explorer.  
 **🌎 Multi-Language Support** – Supports **C, C++, Python, JavaScript, TypeScript, Java**, and more.  

### 🎨 **UI/UX Enhancements**  
 **📑 Sidebar Navigation** – Expandable/collapsible **sidebar for smooth navigation**.  
 **🎭 Theme Toggle** – Easily switch between **Dark** 🌙 and **Light** ☀️ themes.  
 **📌 Dropdown Output View** – **Collapsible** execution output panel for a better user experience.  

---

## 🛠️ Tech Stack  

| **🔧 Technology**        | **📌 Purpose**                                   |  
|----------------------|-------------------------------------------|  
| **⚡ Next.js (App Router)** | Frontend & API backend                     |  
| **🟦 TypeScript**       | Type safety & improved development experience  |  
| **📝 Monaco Editor**    | Rich code editing features                   |  
| **🤖 Cohere AI API**    | AI-driven code assistance & debugging         |  
| **🌟 Google Gemini API** | AI-powered code suggestions                  |  
| **🔍 Google Vertex AI** | AI debugging & code refactoring               |  
| **🚀 Judge0 API**       | Multi-language code execution                 |  
| **🎨 Tailwind CSS**     | UI styling & responsiveness                   |  

---

## 🚀 Installation & Setup  

### 1️⃣ **Clone the repository**  
```bash
git clone https://github.com/hemanvithapullela0456/qubex.git
cd qubex
```

### 2️⃣ **Install dependencies**  
```bash
npm install
# or
yarn install
```

### 3️⃣ **Set up environment variables**  
Create a `.env.local` file and add the following:  
```env
NEXT_PUBLIC_COHERE_API_KEY=your_cohere_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_VERTEX_API_KEY=your_google_vertex_ai_key
NEXT_PUBLIC_JUDGE0_API_KEY=your_judge0_api_key
```

### 4️⃣ **Run the development server**  
```bash
npm run dev
# or
yarn dev
```

The IDE will be available at **[http://localhost:3000](http://localhost:3000)**.  

---

## 📌 API Endpoints & Feature Descriptions  

### 🔹 **1. Execute Code 🚀**  
- **Description**: Run code in multiple languages using the **Judge0 API**.  
- **Route**: `POST /api/execute-code`  

<img src="public/image1.png" alt="Execute Code" width="600" />  

### 🔹 **2. AI Bug Fixing 🤖**  
- **Description**: Detect and fix **syntax & logical errors** instantly using **Google Vertex AI**.  
- **Route**: `POST /api/ai-bug-fixing`  

<img src="public/image2.png" alt="AI Bug Fixing" width="600" />  

### 🔹 **3. Generate Test Cases 🛠️**  
- **Description**: AI generates **comprehensive test cases** based on function logic.  
- **Different frameworks per language:**  
  - **JavaScript**: Jest  
  - **C**: CUnit  
  - **C++**: Google Test (GTest)  
  - **Python**: PyTest  
  - **Java**: JUnit  
- **Route**: `POST /api/generate-test-cases`  

<img src="public/image3.png" alt="Generate Test Cases" width="600" />  

### 🔹 **4. Code Refactoring 🔄**  
- **Description**: Optimize code structure, formatting, and readability using **Google Vertex AI**.  
- **Route**: `POST /api/code-refactoring`  

<img src="public/image4.png" alt="Code Refactoring" width="600" />  

---

## 🎯 Future Enhancements 

 **🖥️ Real-time collaboration** – Live multi-user coding via **WebSockets**.  
 **📜 AI-powered documentation** – Auto-generate **function/method documentation**.  
 **🗂️ Multi-file execution** – Run multiple files **simultaneously**.  
 **📡 GitHub Integration** – Save & sync code directly with **GitHub**.  
 **🔐 Google OAuth Authentication** – Secure user login.  
 **🤖 More AI-powered explanations** – **Google Gemini AI** for explaining complex coding concepts.  

---

## 🔒 Security & Privacy 

🔹 **No Permanent Storage** – User code is **not stored permanently**.  
🔹 **Secure Processing** – AI processing is done **securely via Google Vertex AI encryption**.  
🔹 **Authentication (Upcoming)** – **Google OAuth** for safe user login.  


---

## 📜 License 📄  

This project is **MIT Licensed**.  

---
