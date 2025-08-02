import { useState, useEffect, useRef, useCallback} from 'react'
import { useRouter } from 'next/router'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export default function InterviewPage() {
  const router = useRouter()
  const { jobType } = router.query

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [interview, setInterview] = useState(null)
  const [questions, setQuestions] = useState([])
  const [responses, setResponses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasStarted, setHasStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [voices, setVoices] = useState([]);
  
  const synthRef = useRef(null);
  const hasStartedRef = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  // Initialize interview
  const startInterview = useCallback(async () => {
    try {
      const response = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobType })
      })
      
      console.log('Starting interview for jobType:', jobType)
      if (!response.ok) throw new Error('Failed to start interview')
      
      const data = await response.json()
      setInterview(data.interview)
      setQuestions(data.questions)
      setIsLoading(false)
    } 
    catch (error) {
      console.error('Error starting interview:', error.message)
      setIsLoading(false)
    }
  }, [jobType])

  useEffect(() => {
    if (jobType && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startInterview()
    }
  }, [jobType, startInterview])


  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const hasResponse = transcript.trim().length > 0 || responses[currentQuestionIndex]

  // Initialize Speech Synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if(synthRef.current) {
          synthRef.current.cancel();
      }
    }

    // if (!synthRef.current) return;

    // const loadVoices = () => {
    //   const loadedVoices = synthRef.current.getVoices();
    //   if (loadedVoices.length > 0) {
    //     setVoices(loadedVoices);
    //   }
    // };

    // // Populate voices
    // synthRef.current.addEventListener('voiceschanged', loadVoices);
    // loadVoices(); // Call it manually too

    // return () => {
    //   synthRef.current.removeEventListener('voiceschanged', loadVoices);
    // };
  }, []);

  // Speak question
  const speakText = useCallback((text) => {
    if (!synthRef.current || !audioEnabled) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    // const voices = synthRef.current.getVoices();
    // const preferredVoice = voices.find(voice => 
    //   voice.lang.startsWith('en') && (
    //     voice.name.toLowerCase().includes('premium') ||
    //     voice.name.toLowerCase().includes('neural') ||
    //     voice.name.toLowerCase().includes('google')
    //   )
    // ) || voices.find(voice => voice.lang.startsWith('en')); // Try to find any voice speaking in English
    
    // if (preferredVoice) {
    //   utterance.voice = preferredVoice;
    // }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    // utterance.onerror = (error) => {
    //   console.error('Speech synthesis error:', error.message);
    //   setIsSpeaking(false);
    // };
    
    if (synthRef.current.getVoices().length === 0) {
      setTimeout(synthRef.current.speak(utterance), 300);
    } else {
      synthRef.current.speak(utterance)
    }

  }, [audioEnabled]);

  useEffect(() => {
    if (audioEnabled && currentQuestion) {
      const questionText = `Question ${currentQuestionIndex + 1}: ${currentQuestion.text}`;
      speakText(questionText);
    }
  }, [audioEnabled, currentQuestion, currentQuestionIndex, speakText]);


  const startRecording = () => {
    if (!browserSupportsSpeechRecognition || listening) return

    resetTranscript()
    setStartTime(Date.now())
    SpeechRecognition.startListening({ continuous: true })
    setIsRecording(true)
  }

  
  const stopRecording = async () => {
    SpeechRecognition.stopListening()
    setIsRecording(false)
  }


  const nextQuestion = async () => {
    if (transcript.trim() && interview && questions[currentQuestionIndex]) {
      const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

      try {
        // Save response to database
        await fetch('/api/response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interviewId: interview.id,
            questionId: questions[currentQuestionIndex].id,
            transcript: transcript.trim(),
            duration
          })
        })
        // Add to local responses
        const newResponses = [...responses]
        newResponses[currentQuestionIndex] = transcript.trim()
        setResponses(newResponses)

      } catch (error) {
        console.error('Error saving response:', error.message)
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      resetTranscript()
    } else {
      completeInterview()
    }
  }


  const completeInterview = async () => {
    if (!interview) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId: interview.id })
      })

      if (!response.ok) throw new Error('Failed to complete interview')

      router.push(`/feedback/${interview.id}`)
    } catch (error) {
      console.error('Error completing interview:', error.message)
      setIsLoading(false)
    }
  }


  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Setting up your interview...</p>
        </div>
      </div>
    )
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Browser Not Supported
          </h2>
          <p className="text-gray-600">
            Your browser doesn&apos;t support speech recognition. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No Questions Found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn&apos;t find questions for this job type.
          </p>
        </div>
      </div>
    )
  }


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
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
      <div className="card mb-8">
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
                <p className="text-lg font-medium text-red-600 mb-2">Recording...</p>
                <p className="text-gray-600">Speak clearly and take your time</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">Ready to Record</p>
                <p className="text-gray-600">Click the button below to start recording</p>
              </div>
            )}
          </div>

          <div className="space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Stop Recording
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transcript Display */}
      {(transcript || responses[currentQuestionIndex]) && (
        <div className="card mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Your Response:</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              {transcript || responses[currentQuestionIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Next Question */}
      <div className="flex justify-end items-center">
        <button
          onClick={nextQuestion}
          disabled={!hasResponse || isRecording}
          className={`font-medium py-2 px-6 rounded-lg transition-colors duration-200 ${
            !hasResponse || isRecording
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete Interview' : 'Next Question'}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p> You can&apos;t go back if you go to the next question. </p>
        <p> Take your time to think before recording. You can re-record your response. </p>
      </div>
    </div>
  )
}