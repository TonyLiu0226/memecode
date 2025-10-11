'use client'
import NewQuestionButton from '../buttons/NewQuestionButton'
import { UserResult, TopicTag } from '@/types/types'

export default function QuestionTracker(props: {
    username: string,
    lc_session: string,
    csrftoken: string,
    data: UserResult
    generateQuestion: (args: { lc_session: string; csrftoken: string; difficulties: string[] }) => Promise<{ title?: string; titleSlug?: string; difficulty?: string; isPaidOnly?: boolean; status?: string; topicTags?: TopicTag[] | null }>
}) {
    const handleResult = (question: { title?: string; titleSlug?: string; difficulty?: string; isPaidOnly?: boolean; status?: string; topicTags?: TopicTag[] | null }) => {
        if (typeof window === 'undefined') return
        try {
            const payload = {
                title: question?.title || '',
                titleSlug: question?.titleSlug || '',
                difficulty: question?.difficulty || '',
                isPaidOnly: question?.isPaidOnly || false,
                status: question?.status || '',
                topicTags: question?.topicTags || [],
            }
            localStorage.setItem('lastQuestion', JSON.stringify(payload))
        } catch {
          console.error('Error saving question to localStorage')
        }
    }

    return (
            <div className={`bg-blue-50 p-4 rounded-lg`}>
              <h3 className={`text-lg font-medium text-blue-900`}>Today&apos;s Challenge</h3>
              <p className={`text-blue-700 mt-2`}>Complete your daily LeetCode problem to unlock memes!</p>
              <NewQuestionButton buttonText="Get New Question" username={props.username} data={props.data} lc_session={props.lc_session} csrftoken={props.csrftoken} generateQuestion={props.generateQuestion} onResult={handleResult}/>
            </div>
    )
}