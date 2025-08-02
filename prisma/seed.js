import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  // Software Developer Questions
  {
    jobType: 'software-developer',
    questionText: 'Tell me more about yourself.',
    order: 1,
    category: 'general'
  },
  {
    jobType: 'software-developer',
    questionText: 'Describe a challenging technical problem you solved recently. What was your approach?',
    order: 2,
    category: 'technical'
  },
  {
    jobType: 'software-developer',
    questionText: 'How do you handle code reviews and feedback from your peers?',
    order: 3,
    category: 'behavioral'
  },
  {
    jobType: 'software-developer',
    questionText: 'Explain a time when you had to learn a new technology quickly. How did you approach it?',
    order: 4,
    category: 'behavioral'
  },
  {
    jobType: 'software-developer',
    questionText: 'How do you ensure your code is maintainable and scalable?',
    order: 5,
    category: 'technical'
  },
  {
    jobType: 'software-developer',
    questionText: 'Do you have any questions?',
    order: 6,
    category: 'engagement'
  },

  // Marketing Manager Questions
  {
    jobType: 'marketing-manager',
    questionText: 'Tell me more about yourself.',
    order: 1,
    category: 'general'
  },
  {
    jobType: 'marketing-manager',
    questionText: 'Describe a successful marketing campaign you led. What made it successful?',
    order: 2,
    category: 'technical'
  },
  {
    jobType: 'marketing-manager',
    questionText: 'How do you handle disagreements with stakeholders about marketing strategy?',
    order: 3,
    category: 'behavioral'
  },
  {
    jobType: 'marketing-manager',
    questionText: 'Tell me about a time when a marketing campaign didn\'t perform as expected. How did you handle it?',
    order: 4,
    category: 'behavioral'
  },
  {
    jobType: 'marketing-manager',
    questionText: 'How do you measure the success of your marketing initiatives?',
    order: 5,
    category: 'technical'
  },
  {
    jobType: 'marketing-manager',
    questionText: 'Do you have any questions?',
    order: 6,
    category: 'engagement'
  },

  // Data Analyst Questions
  {
    jobType: 'data-analyst',
    questionText: 'Tell me more about yourself.',
    order: 1,
    category: 'general'
  },
  {
    jobType: 'data-analyst',
    questionText: 'Describe a complex dataset you worked with. How did you clean and analyze it?',
    order: 2,
    category: 'technical'
  },
  {
    jobType: 'data-analyst',
    questionText: 'How do you communicate your findings to non-technical stakeholders?',
    order: 3,
    category: 'behavioral'
  },
  {
    jobType: 'data-analyst',
    questionText: 'Tell me about a time when your analysis led to a significant business impact.',
    order: 4,
    category: 'behavioral'
  },
  {
    jobType: 'data-analyst',
    questionText: 'What tools and technologies do you prefer for data analysis and why?',
    order: 5,
    category: 'technical'
  },
  {
    jobType: 'data-analyst',
    questionText: 'Do you have any questions?',
    order: 6,
    category: 'engagement'
  }
]

async function main() {
  console.log('Start seeding...')
  
  for (const question of questions) {
    await prisma.question.create({
      data: question
    })
  }
  
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })