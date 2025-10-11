'use client'
import { TopicTag } from '@/types/types'
import DifficultyChip from './chips/DifficultyChip'
import TopicChip from './chips/TopicChip'
import { useState, useEffect } from 'react'
import { DifficultyColors } from '@/types/types'

export default function QuestionInfo() {
    const [question, setQuestion] = useState<{ title?: string; titleSlug?: string; difficulty?: string; isPaidOnly?: boolean; status?: string; topicTags?: TopicTag[] | null, acRate?: number } | null>(null)
    useEffect(() => {
        const read = () => {
            const raw = localStorage.getItem('lastQuestion')
            setQuestion(raw ? JSON.parse(raw) : null)
        }

        // initial read
        read()

        // update on cross-tab storage events and custom in-tab event
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'lastQuestion') read()
        }
        const onCustom = () => read()
        window.addEventListener('storage', onStorage)
        window.addEventListener('lastQuestionUpdated', onCustom)
        return () => {
            window.removeEventListener('storage', onStorage)
            window.removeEventListener('lastQuestionUpdated', onCustom)
        }
    }, [])
    if (!question) return null
    return (
        <div className={`mt-10 mb-10 flex flex-col align-center justify-center w-fit mx-auto bg-${question.difficulty && DifficultyColors.get(question.difficulty)}-300`}>
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
        </div>
    )
}