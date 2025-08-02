import { prisma } from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { interviewId } = req.body

    if (!interviewId) {
      return res.status(400).json({ error: 'Interview ID is required' })
    }

    // Get interview with responses and questions
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        responses: {
          include: {
            question: true
          },
          orderBy: {
            question: {
              order: 'asc'
            }
          }
        }
      }
    })

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' })
    }

    // Generate feedback using OpenAI
    const feedback = await generateFeedback(interview)

    // Update interview status
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    })

    // Save feedback
    const savedFeedback = await prisma.feedback.create({
      data: {
        interviewId,
        overallScore: feedback.overallScore,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        detailedAnalysis: feedback.detailedAnalysis
      }
    })

    res.status(200).json({
      success: true,
      feedback: savedFeedback
    })

  } catch (error) {
    console.error('Error completing interview:', error)
    res.status(500).json({ error: 'Failed to complete interview' })
  }
}

async function generateFeedback(interview) {
  const responses = interview.responses.map((r) => ({
    question: r.question.questionText,
    answer: r.transcript,
    category: r.question.category
  }))

  const jobTypeFormatted = interview.jobType
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const prompt = `
    You are a career coach and expert interviewer for the job type below. Analyze the following interview responses and provide detailed feedback.

    Job Type: ${jobTypeFormatted}
    Interview Responses: ${responses.map((r, i) => `Q${i + 1} (${r.category}): ${r.question} Answer: ${r.answer}`).join('\n')}

    Please respond *only* with this valid JSON-only feedback. Do not include any additional commentary, markdown formatting, or explanation text.
    {
      "overallScore": <number between 1-10>,
      "strengths": "<brief summary of strengths>",
      "improvements": "<brief summary of areas for improvement>",
      "detailedAnalysis": "<detailed analysis with specific examples and suggestions>"
    }

    Evaluate based on:
    - Clarity and structure of responses
    - Relevance to the questions asked
    - Depth and specificity of examples
    - Communication skills and confidence
    - Technical knowledge (where applicable)
    - Professional demeanor

    Be concise but actionable.
  `

  try {
    const completion = await openai.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7, // Controls the creativity or randomness of the response.
      max_tokens: 1000
    })

    const feedbackText = completion.choices[0]?.message?.content

    // See everything returned
    console.log('Raw OpenAI response:', JSON.stringify(completion, null, 2))
    console.log('Raw feedback text:', feedbackText)

    if (!feedbackText) {
      throw new Error('No feedback generated')
    }

    return JSON.parse(feedbackText)

  } catch (error) {
    console.error('Error generating feedback:', error.message)
    // Return default feedback if OpenAI fails
    return {
      overallScore: 7.0,
      strengths: 'Reasonable clarity and completion of all responses.',
      improvements: 'Add more specific examples and tighten structure.',
      detailedAnalysis: 'Generally satisfactory. Improve by giving structured, confident responses using the STAR method.',
    }
  }
}