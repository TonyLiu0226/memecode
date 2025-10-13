'use client'
import { TopicTag } from '@/types/types'
import DifficultyChip from './chips/DifficultyChip'
import { getDifficultyBgClass } from '@/types/types'
import TopicChip from './chips/TopicChip'
import { useState, useEffect } from 'react'
import CheckSolvedButton from './buttons/CheckSolvedButton'

export default function QuestionInfo(props: {
    username: string
    mediaType: string[]
}) {
    const handleResult = (memeURL: { url: string, type: string } | { error: string }) => {
        if (typeof window === 'undefined') return
        try {
            if ('error' in memeURL) {
                localStorage.removeItem('memeURL')
                localStorage.removeItem('memeType')
                localStorage.setItem('memeError', JSON.stringify(memeURL.error))
                window.dispatchEvent(new Event('memeErrorUpdated'))
                window.dispatchEvent(new Event('memeURLUpdated'))
                window.dispatchEvent(new Event('memeTypeUpdated'))
            }
            else {
                localStorage.setItem('memeURL', JSON.stringify(memeURL.url))
                localStorage.setItem('memeType', JSON.stringify(memeURL.type))
                localStorage.removeItem('memeError')
                window.dispatchEvent(new Event('memeErrorUpdated'))
                window.dispatchEvent(new Event('memeURLUpdated'))
                window.dispatchEvent(new Event('memeTypeUpdated'))
            }
        } catch (error) {
          localStorage.removeItem('memeURL')
          localStorage.removeItem('memeType')
          localStorage.setItem('memeError', JSON.stringify(error))
          window.dispatchEvent(new Event('memeErrorUpdated'))
          window.dispatchEvent(new Event('memeURLUpdated'))
          window.dispatchEvent(new Event('memeTypeUpdated'))
          console.error('Error saving meme to localStorage', error)
        }
    }
    
    const [question, setQuestion] = useState<{ title?: string; titleSlug?: string; difficulty?: string; isPaidOnly?: boolean; status?: string; topicTags?: TopicTag[] | null, acRate?: number } | null>(null)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const read = () => {
            const raw = localStorage.getItem('lastQuestion')
            setQuestion(raw ? JSON.parse(raw) : null)
            const rawErr = localStorage.getItem('lastQuestionError')
            setError(rawErr ? JSON.parse(rawErr) : null)
        }

        // initial read
        read()

        // update on cross-tab storage events and custom in-tab event
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'lastQuestion') read()
            if (e.key === 'lastQuestionError') read()
        }
        const onCustom = () => read()
        window.addEventListener('storage', onStorage)
        window.addEventListener('lastQuestionUpdated', onCustom)
        window.addEventListener('lastQuestionErrorUpdated', onCustom)
        return () => {
            window.removeEventListener('storage', onStorage)
            window.removeEventListener('lastQuestionUpdated', onCustom)
            window.removeEventListener('lastQuestionErrorUpdated', onCustom)
        }
    }, [])
    if (error) {
        return (
            <div className="mt-10 mb-10 flex px-10 py-5 rounded-md flex-col align-center justify-center w-fit mx-auto bg-red-50 border border-red-200">
                <p className="text-red-700">{error}</p>
            </div>
        )
    }
    if (!question) return null
    const bgClass = getDifficultyBgClass(question.difficulty)
    return (
        <div className={`mt-10 mb-10 flex px-10 py-5 rounded-md flex-col align-center justify-center w-fit mx-auto ${bgClass}`}>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{question.title}</h1>
            <div>
                <DifficultyChip difficulty={question.difficulty} />
            </div>
            <h2 className="text-md font-medium text-gray-700 mb-2">Topics:</h2>
            <div>
                {question.topicTags?.map((topic) => (
                    <TopicChip topic={topic.name} key={topic.name} />
                ))}
            </div>
            
            <p className="text-md font-bold text-gray-900 mb-2">Acceptance Rate: {question.acRate?.toFixed(2)}%</p>
            <a className="text-md font-medium text-teal-900 mb-2" href={`https://leetcode.com/problems/${question.titleSlug}`}>View Question</a>
            <CheckSolvedButton buttonText="I've solved this question!" username={props.username} questionTitle={question.title || ''} mediaType={props.mediaType} onResult={handleResult} />
        </div>
    )
}