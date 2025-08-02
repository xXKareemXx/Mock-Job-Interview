import { prisma } from '@/lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { interviewId, questionId, transcript, duration } = req.body

    if (!interviewId || !questionId || !transcript) {
      return res.status(400).json({ 
        error: 'Interview ID, question ID, and transcript are required' 
      })
    }

    // Save the response
    const response = await prisma.response.create({
      data: {
        interviewId,
        questionId,
        transcript,
        duration: duration || null
      }
    })

    res.status(200).json({ success: true, response })

  } catch (error) {
    console.error('Error saving response:', error)
    res.status(500).json({ error: 'Failed to save response' })
  }
}