'use client'
import { UserResult, TopicTag } from '@/types/types'

export default function NewQuestionButton(props: {
    buttonText: string
    username: string
    data: UserResult
    lc_session: string
    csrftoken: string
    difficulties?: string[]
    generateQuestion: (args: { lc_session: string; csrftoken: string; difficulties: string[] }) => Promise<{ title?: string; titleSlug?: string; difficulty?: string; isPaidOnly?: boolean; status?: string; topicTags?: TopicTag[] | null, acRate?: number }>
    onResult?: (question: { title?: string; titleSlug?: string; difficulty?: string; isPaidOnly?: boolean; status?: string; topicTags?: TopicTag[] | null, acRate?: number }) => void
}) {
    return (
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={async () => {
            // Use difficulties provided via props (from Supabase), fall back to empty array
            const difficulties = Array.isArray(props.difficulties) ? props.difficulties : []
            const question = await props.generateQuestion({ lc_session: props.lc_session, csrftoken: props.csrftoken, difficulties })
            if (props.onResult) props.onResult(question)
        }}>
            {props.buttonText || 'New Question'}
        </button>
    )
}