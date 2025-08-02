import Link from 'next/link'
import { useState } from 'react'

const jobTypes = [
  {
    id: 'software-developer',
    title: 'Software Developer',
    description: 'Technical and behavioral questions for software engineering roles',
    questions: 6
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Analytics, statistics, and data interpretation questions',
    questions: 6
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    description: 'Strategy, campaign management, and leadership questions',
    questions: 6
  }
]

export default function Home() {
  const [selectedJob, setSelectedJob] = useState('')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mb-8 -mx-6 -mt-12 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Mock Interview AI</h1>
      </div>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Practice Your Interview Skills
        </h1>
        <p className="text-l text-gray-600 max-w-2xl mx-auto">
          Get ready for your next job interview with AI-powered mock interviews. 
          Receive detailed feedback on your responses and improve your performance.
        </p>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Choose Your Interview Type
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {jobTypes.map((job) => (
            <div
              key={job.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                selectedJob === job.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedJob(job.id)}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600 mb-3">{job.description}</p>
              <div className="text-sm text-gray-500">
                {job.questions} questions • ~15-20 minutes
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">What to expect:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              6 carefully selected questions relevant to your role
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Voice recognition for natural conversation flow
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Detailed feedback with strengths and improvement areas
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Professional scoring to track your progress
            </li>
          </ul>
        </div>

        <div className="text-center">
          {selectedJob ? (
            <Link
              href={`/interview/${selectedJob}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Start Interview
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 font-medium py-3 px-8 rounded-lg cursor-not-allowed"
            >
              Select an interview type to continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}