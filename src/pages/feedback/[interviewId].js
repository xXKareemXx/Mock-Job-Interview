import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function FeedbackPage() {
  const router = useRouter()
  const { interviewId } = router.query

  const [feedback, setFeedback] = useState(null)
  const [interview, setInterview] = useState(null)
  const [responses, setResponses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')

  const fetchFeedback = useCallback(async () => {
    try {
      const response = await fetch(`/api/${interviewId}/feedback`)
      
      if (!response.ok) throw new Error('Failed to fetch feedback')

      const data = await response.json()
      setFeedback(data.feedback)
      setInterview(data.interview)
      setResponses(data.responses)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching feedback:', error)
      setIsLoading(false)
    }
  }, [interviewId])

  useEffect(() => {
    if (interviewId) {
      fetchFeedback()
    }
  }, [interviewId, fetchFeedback])

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score) => {
    if (score >= 8) return 'bg-green-100'
    if (score >= 6) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your interview...</p>
        </div>
      </div>
    )
  }

  if (!feedback || !interview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Feedback Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the feedback for this interview.
          </p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
            Start New Interview
          </Link>
        </div>
      </div>
    )
  }

  const jobTypeFormatted = interview.jobType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Interview Feedback
        </h1>
        <p className="text-gray-600">
          {jobTypeFormatted} • {new Date(interview.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Score Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBackground(feedback.overallScore)} mb-4`}>
            <span className={`text-4xl font-bold ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore.toFixed(1)}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Overall Performance Score
          </h2>
          <p className="text-gray-600">
            {feedback.overallScore >= 8 ? 'Excellent performance! You\'re well-prepared for interviews.' :
             feedback.overallScore >= 6 ? 'Good performance with room for improvement.' :
             'You need more practice!'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b">
          {[
            { key: 'summary', label: 'Summary' },
            { key: 'detailed', label: 'Detailed Analysis' },
            { key: 'responses', label: 'Your Responses' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
            </div>
            <p className="text-gray-700">{feedback.strengths}</p>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
            </div>
            <p className="text-gray-700">{feedback.improvements}</p>
          </div>
        </div>
      )}

      {activeTab === 'detailed' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{feedback.detailedAnalysis}</p>
          </div>
        </div>
      )}

      {activeTab === 'responses' && (
        <div className="space-y-6">
          {responses.map((response, index) => (
            <div key={response.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {response.question.order}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                      {response.question.category}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    {response.question.questionText}
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{response.transcript}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-12 text-center space-x-4">
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200">
          Start New Interview
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Print Feedback
        </button>
      </div>
    </div>
  )
}