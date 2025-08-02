import React, { useState, useEffect } from 'react';

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
];

const mockQuestions = {
  'software-developer': [
    {
      id: '1',
      text: 'Tell me about yourself and your background in software development.',
      category: 'general'
    },
    {
      id: '2',
      text: 'Describe a challenging technical problem you solved recently. What was your approach?',
      category: 'technical'
    },
    {
      id: '3',
      text: 'How do you handle code reviews and feedback from your peers?',
      category: 'behavioral'
    }
  ],
  'data-analyst': [
    {
      id: '1',
      text: 'Tell me about your background and experience in data analysis.',
      category: 'general'
    },
    {
      id: '2',
      text: 'Walk me through your process for cleaning and preparing messy data for analysis.',
      category: 'technical'
    },
    {
      id: '3',
      text: 'Describe a time when your analysis revealed unexpected insights. How did you communicate this to stakeholders?',
      category: 'behavioral'
    }
  ],
  'marketing-manager': [
    {
      id: '1',
      text: 'Tell me about your background and experience in marketing.',
      category: 'general'
    },
    {
      id: '2',
      text: 'Describe a successful marketing campaign you led. What made it successful?',
      category: 'technical'
    },
    {
      id: '3',
      text: 'How do you handle disagreements with stakeholders about marketing strategy?',
      category: 'behavioral'
    }
  ]
};

export default function MockInterviewDemo() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedJob, setSelectedJob] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startInterview = () => {
    if (!selectedJob) return;
    setCurrentView('interview');
    setCurrentQuestionIndex(0);
    setResponses([]);
  };

  const simulateRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setCurrentResponse('');
    } else {
      setIsRecording(false);
      // Simulate transcription
      const sampleResponses = [
        "I have been working as a software developer for about 3 years, focusing mainly on web applications using React and Node.js. I'm passionate about creating user-friendly interfaces and solving complex problems.",
        "Recently, I faced a performance issue where our application was taking too long to load user data. I analyzed the database queries, implemented proper indexing, and optimized the API calls, which reduced load time by 60%.",
        "I welcome code reviews as learning opportunities. I always review feedback carefully, ask questions when I don't understand suggestions, and make sure to implement the changes thoughtfully."
      ];
      
      setCurrentResponse(sampleResponses[currentQuestionIndex] || "This is a sample response to demonstrate the interview flow.");
    }
  };

  const saveResponse = () => {
    if (!currentResponse.trim()) return;
    
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = currentResponse;
    setResponses(newResponses);
  };

  const nextQuestion = () => {
    saveResponse();
    const questions = mockQuestions[selectedJob];
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentResponse('');
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    saveResponse();
    
    // Mock feedback generation
    const mockFeedback = {
      overallScore: 7.8,
      strengths: "Clear communication, good technical knowledge, and structured responses. You provided specific examples which demonstrate your experience well.",
      improvements: "Try to elaborate more on the business impact of your technical decisions. Consider using the STAR method for behavioral questions.",
      detailedAnalysis: "Your responses show solid technical competency and professional experience. The first answer effectively outlined your background and current focus areas. Your technical problem-solving example was well-structured and showed good analytical thinking. For behavioral questions, consider adding more context about the outcomes and lessons learned."
    };
    
    setFeedback(mockFeedback);
    setCurrentView('feedback');
  };

  const resetDemo = () => {
    setCurrentView('home');
    setSelectedJob('');
    setCurrentQuestionIndex(0);
    setResponses([]);
    setCurrentResponse('');
    setIsRecording(false);
    setFeedback(null);
  };

  if (currentView === 'home') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-12">
              {/* <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div> */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Mock Job Interview</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Practice your interview skills with AI-powered feedback
              </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Choose Your Interview Type
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {jobTypes.map((job) => (
              <div
                key={job.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                  selectedJob === job.id
                    ? 'border-blue-500 bg-blue-50'
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
            </ul>
          </div>

          <div className="text-center">
            {selectedJob ? (
              <button
                onClick={startInterview}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
              >
                Start Interview
              </button>
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
    );
  }

  if (currentView === 'interview') {
    const questions = mockQuestions[selectedJob];
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const hasResponse = currentResponse.trim().length > 0;

    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {currentQuestion.category}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.text}
              </h2>
            </div>
          </div>
        </div>

        {/* Recording Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <div className="text-center">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
              isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
            }`}>
              <svg 
                className={`w-12 h-12 ${isRecording ? 'text-red-600' : 'text-gray-400'}`} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </div>
            
            <div className="mb-4">
              {isRecording ? (
                <div>
                  <p className="text-lg font-medium text-red-600 mb-2">
                    Recording... {recordingTime}s
                  </p>
                  <p className="text-gray-600">Speak clearly and take your time</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Ready to Record</p>
                  <p className="text-gray-600">Click the button below to start your response</p>
                </div>
              )}
            </div>

            <div className="space-x-4">
              <button
                onClick={simulateRecording}
                className={`font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>
          </div>
        </div>

        {/* Response Display */}
        {currentResponse && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Your Response:</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{currentResponse}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setCurrentResponse(responses[currentQuestionIndex - 1] || '');
              }
            }}
            disabled={currentQuestionIndex === 0}
            className={`font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={!hasResponse}
            className={`font-medium py-2 px-6 rounded-lg transition-colors duration-200 ${
              !hasResponse
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete Interview' : 'Next Question'}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 This is a demo - click &quot;Start Recording&quot; to simulate voice input with sample responses</p>
        </div>
      </div>
    );
  }

  if (currentView === 'feedback') {
    const getScoreColor = (score) => {
      if (score >= 8) return 'text-green-600';
      if (score >= 6) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreBackground = (score) => {
      if (score >= 8) return 'bg-green-100';
      if (score >= 6) return 'bg-yellow-100';
      return 'bg-red-100';
    };

    const jobTypeFormatted = selectedJob
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b mb-8 -mx-6 -mt-6 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Mock Interview AI</h1>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Feedback
          </h1>
          <p className="text-gray-600">
            {jobTypeFormatted} • {new Date().toLocaleDateString()}
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
               'Keep practicing - you\'re on the right track!'}
            </p>
          </div>
        </div>

        {/* Feedback Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
            </div>
            <p className="text-gray-700">{feedback.strengths}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
            </div>
            <p className="text-gray-700">{feedback.improvements}</p>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
          <p className="text-gray-700 whitespace-pre-line">{feedback.detailedAnalysis}</p>
        </div>

        {/* Actions */}
        <div className="text-center space-x-4">
          <button
            onClick={resetDemo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Start New Interview
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Print Feedback
          </button>
        </div>

        {/* <div className="mt-8 text-center text-sm text-gray-500">
          <p>🎉 Demo completed! In the real app, this feedback would be generated by AI based on your actual responses.</p>
        </div> */}
      </div>
    );
  }
}