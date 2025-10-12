'use client'
import { UserResult, GeneratedQuestion } from '@/types/types'
import { useState } from 'react'

export default function NewQuestionButton(props: {
    buttonText: string
    username: string
    data: UserResult
    lc_session: string
    csrftoken: string
    difficulties?: string[]
    generateQuestion: (args: { lc_session: string; csrftoken: string; difficulties: string[] }) => Promise<GeneratedQuestion | { error: unknown }>
    onResult?: (question: GeneratedQuestion) => void
}) {
    const [loading, setLoading] = useState(false)
    // Errors are routed to QuestionInfo via localStorage + custom event
    return (
        <div>
            <button
                disabled={loading}
                className={`mt-4 px-4 py-2 rounded text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={async () => {
                    setLoading(true)
                    try {
                        const difficulties = Array.isArray(props.difficulties) ? props.difficulties : []
                        const result = await props.generateQuestion({ lc_session: props.lc_session, csrftoken: props.csrftoken, difficulties })
                        if ('error' in result) {
                            if (typeof window !== 'undefined') {
                                const message = String((result as { error: unknown }).error || 'Failed to generate question')
                                localStorage.setItem('lastQuestionError', JSON.stringify(message))
                                window.dispatchEvent(new Event('lastQuestionErrorUpdated'))
                            }
                            return
                        }
                        // Clear any previous error and notify listeners
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('lastQuestionError')
                            window.dispatchEvent(new Event('lastQuestionErrorUpdated'))
                        }
                        if (props.onResult) props.onResult(result)
                    } catch (e) {
                        if (typeof window !== 'undefined') {
                            const message = e instanceof Error ? e.message : 'Unexpected error while generating question'
                            localStorage.setItem('lastQuestionError', JSON.stringify(message))
                            window.dispatchEvent(new Event('lastQuestionErrorUpdated'))
                        }
                    } finally {
                        setLoading(false)
                    }
                }}
            >
                {loading ? 'Loading…' : (props.buttonText || 'New Question')}
            </button>
        </div>
    )
}