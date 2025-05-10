# mindSpark

AI-Flashcards Web App (Quizlet Clone + AI Features) - Copilot Project File

✪ Project Name: MindSpark

Domain: mindspark.studySlogan: "Ignite your learning with AI-powered flashcards."

✪ Goal

Build a full-featured Quizlet-style flashcard web app with AI-powered features:

Image-to-flashcard conversion

Auto-generated quizzes/tests from flashcards

Flashcards extracted from study material (text, PDFs, or images)

Share sets in classrooms and compete together

Clean, modern UI inspired by Quizlet

🛡️ 1. TECHNOLOGY STACK

🔹 Frontend

Framework: React (Vite or Next.js)

Languages: JavaScript, JSX, HTML, CSS

Styling: Tailwind CSS or CSS Modules

AI Tools: GitHub Copilot for code generation

🔹 Backend

Framework: FastAPI (Python)

Languages: Python

API endpoints: Flashcards, quizzes, OCR/image upload, OpenAI integration

🔹 Database

Preferred: Supabase (PostgreSQL) or Firebase

Store:

Users

Flashcards

Sets

Quiz history

Uploaded content

Classrooms

🔹 AI Integrations

OCR: Tesseract.js (client) or Google Cloud Vision (server)

Text Processing: OpenAI GPT-4 (API)

Optional: Hugging Face models

🛠️ 2. FILE STRUCTURE

Frontend

/frontend
  /public
  /src
    /components
      - FlashcardSet.js
      - Flashcard.js
      - QuizGenerator.js
      - Navbar.js
    /pages
      - Home.jsx
      - Login.jsx
      - Dashboard.jsx
      - StudyMode.jsx
    /assets
    /api
      - apiClient.js
    App.jsx
    main.jsx
  tailwind.config.js
  vite.config.js

Backend (FastAPI)

/backend
  /app
    - main.py
    - models.py
    - database.py
    - crud.py
    - schemas.py
    - ai_tools.py
    /routes
      - flashcards.py
      - users.py
      - quizzes.py
      - uploads.py
  requirements.txt

🚧 3. FEATURE DEVELOPMENT PLAN

✅ MVP: Core Flashcard Features

User Auth

Sign up / login with Firebase or Supabase

JWT or session tokens

Create Flashcard Sets

Title, description

Add/edit/delete flashcards

Study Mode (like Quizlet)

Flip cards, shuffle

Mark known/unknown

Organization

By categories/subjects

Search and filter flashcard sets

🧠 AI-Powered Features

🔍 Feature 1: Image to Flashcards

Upload or capture image

OCR (Tesseract or Google Vision)

Extract text/vocab pairs

Auto-generate JSON flashcard set

📏 Feature 2: Flashcards from Study Material

Upload PDF, paste text, or image

OpenAI extracts key ideas

Generate flashcards automatically

🧪 Feature 3: Auto-Generated Quizzes

Select flashcard set

GPT-4 generates:

MCQs (4 options)

Fill-in-the-blank

Record results and score

🧐 Feature 4 (Optional): Smart Review

Track flashcard performance

Use spaced repetition or GPT

🏢 Classrooms & Sharing

Users can create/join classrooms

Share flashcard sets

Compete via quizzes or study battles

🎨 4. DESIGN GUIDELINES

Responsive (mobile + desktop)

Tailwind-based UI (Quizlet style)

Components:

Navbar

Flashcard grid/list

Flip viewer

Quiz interface

Dashboard/activity log

Colors: Blue, white, purple

the logo is the mindSpark/logo.pdf file

📡 5. DEPLOYMENT

Frontend: Vercel or Netlify

Backend: Render or Railway

Database: Supabase or Firebase (cloud hosted)

Env Variables:

OPENAI_API_KEY

SUPABASE_URL

SUPABASE_ANON_KEY (or Firebase config)


This file is designed to be used by GitHub Copilot as a foundational guide for building your app, step-by-step.
