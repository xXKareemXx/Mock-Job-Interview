import { prisma } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { jobType, userId } = req.body

    if (!jobType) {
      return res.status(400).json({ error: 'Job type is required' })
    }

    // Generate a user ID if not provided (for demo purposes)
    const finalUserId = userId || uuidv4()

    // Create new interview
    const interview = await prisma.interview.create({
      data: {
        userId: finalUserId,
        jobType,
        status: 'in_progress'
      }
    })

    // Get questions for this job type
    const questions = await prisma.question.findMany({
      where: { jobType },
      orderBy: { order: 'asc' }
    })

    res.status(200).json({
      interview,
      questions: questions.map(q => ({
        id: q.id,
        text: q.questionText,
        order: q.order,
        category: q.category
      }))
    })

  } catch (error) {
    console.error('Error starting interview:', error)
    res.status(500).json({ error: 'Failed to start interview' })
  }
}