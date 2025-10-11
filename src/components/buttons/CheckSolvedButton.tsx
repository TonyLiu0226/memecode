'use client'
import { checkSolved, getMeme } from '@/app/actions'
// types unused here
import { useState, useEffect } from 'react'

export default function NewQuestionButton(props: {
    buttonText: string
    username: string
    questionTitle: string
    onResult: (memeURL: { url: string, type: string }) => void
}) {

    const [solved, setSolved] = useState<boolean | null>(null)
    useEffect(() => {
        setSolved(null)
    }, [props.username, props.questionTitle])
    console.log(solved)
    return (
        <>
        {(solved === null || solved === false) && (
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={async () => {
            const isSolved = await checkSolved({ username: props.username, questionTitle: props.questionTitle })
            if (isSolved) {
                console.log('Question solved')
                setSolved(true)
                const memeURL = await getMeme()
                props.onResult(memeURL)
            }
            else {
                console.log('Question not solved')
                setSolved(false)
            }
        }}>
            I&apos;ve solved this question!
        </button>
        )}
        {solved !== null && (
            <div className={`mt-4 text-gray-500 ${solved ? 'text-green-500' : 'text-red-500'}`}>
                {solved ? 'Question solved' : 'Lol nope you havent solved this question yet, please check again when you\'ve actually done it'}
            </div>
        )}
        </>
    )
}