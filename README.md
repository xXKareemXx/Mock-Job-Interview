# Mock Job Interview

A conversational AI-powered mock interview platform built with Next.js, React, and Groq API. Practice your interview skills with speech recognition and get detailed AI feedback.

## Features

- **Multiple Job Types** - Software Developer, Data Analyst, Marketing Manager
- **Voice Recognition**: Natural speech-to-text for realistic interview experience
- **Audio Playback** - Text-to-speech for question delivery
- **AI-powered feedback** - Get detailed analysis powered by Groq (OpenAI-compatible)
- **Performance scoring** - Receive scores and actionable insights
- **Progress Tracking** - Visual progress indicators and response history

## Simple Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│ • React Components   │ • /api/start         │ • Interviews    │
│ • Speech Recognition │ • /api/response      │ • Questions     │
│ • Speech Synthesis   │ • /api/complete      │ • Responses     │
│ • State Management   │ • /api/feedback      │ • Feedback      │
└──────────────────────┴──────────────────────┴─────────────────┘
                                │
                        ┌─────────────────┐
                        │   AI Service    │
                        │   (Groq/Llama)  │
                        └─────────────────┘
```

## Tech Stack

- **Frontend**: Next.js 15 (Pages Router), React, JavaScript, Tailwind CSS
- **Speech Recognition**: `react-speech-recognition` (Web Speech API)
- **Text-to-Speech**: `speechSynthesis` Web API
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Groq API (OpenAI-compatible)
- **Deployment**: Vercel-ready

## Database Schema

```sql
- Interview: User session with job type and status
- Questions: Pre-seeded questions by job type and category
- Responses: User answers with transcripts and duration
- Feedback: AI-generated analysis with scoring
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Groq API key

### Installation

1. **Clone and install dependencies**
   ```bash
    git clone <your-repo>
    cd mock-job-interview
    npm install
   ```

2. **Set up PostgreSQL database**
   ```bash
    createdb mock_interview_db
   ```

3. **Set up environment variables**
   ```bash
    cp .env
   ```

   Edit `.env` with your credentials:
   ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/mock_interview_db"
    GROQ_API_KEY=your-groq-api-key-here
   ```

4. **Set up database**
   ```bash
    npm run db:setup 
   ```

   This will:
   - Generate Prisma client
   - Push schema to database
   - Seed with sample questions

5. **Start development server**
   ```bash
    npm run dev
   ```

Visit `http://localhost:3000` to start practicing!

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/start` | POST | Initialize new interview session |
| `/api/response` | POST | Save user response to question |
| `/api/complete` | POST | Finalize interview and generate feedback |
| `/api/[interviewId]/feedback` | GET | Retrieve interview results |

### Core Models

- **Interview**: Tracks interview sessions
- **Question**: Stores interview questions by job type
- **Response**: User answers to questions
- **Feedback**: AI-generated feedback and scores

## User Flow

1. **Job Selection**: Choose from Software Developer, Data Analyst, or Marketing Manager
2. **Interview Start**: Initialize interview session with 6 curated questions
3. **Question Delivery**: AI reads questions aloud
4. **Response Recording**: Voice-to-text capture with visual feedback
5. **Progress Tracking**: Visual progress bar and question navigation
6. **Interview Completion**: Automatic submission after final question
7. **AI Analysis**: Groq processes responses for detailed feedback
8. **Results Review**: Comprehensive feedback with scoring and suggestions

## Testing Browser Compatibility

**Supported:**
- Chrome/Chromium
- Safari 14+
- Edge 79+

**Limited Support:**
- Firefox (speech recognition varies)
