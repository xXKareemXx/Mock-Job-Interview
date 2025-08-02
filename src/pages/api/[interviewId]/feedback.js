import { prisma } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { interviewId } = req.query

    if (!interviewId || typeof interviewId !== 'string') {
      return res.status(400).json({ error: 'Interview ID is required' })
    }

    // Get interview with feedback and responses
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        feedback: true,
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

    if (!interview.feedback) {
      return res.status(404).json({ error: 'Feedback not yet available' })
    }

    res.status(200).json({
      interview: {
        id: interview.id,
        jobType: interview.jobType,
        createdAt: interview.createdAt,
        completedAt: interview.completedAt
      },
      feedback: interview.feedback,
      responses: interview.responses.map(r => ({
        id: r.id,
        transcript: r.transcript,
        question: {
          questionText: r.question.questionText,
          category: r.question.category,
          order: r.question.order
        }
      }))
    })

  } catch (error) {
    console.error('Error fetching feedback:', error)
    res.status(500).json({ error: 'Failed to fetch feedback' })
  }
}