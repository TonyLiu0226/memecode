'use client'
import NewQuestionButton from '../buttons/NewQuestionButton'
import { UserResult } from '@/types/types'

export default function QuestionTracker(props: {
    username: string,
    data: UserResult
}) {
    return (
            <div className={`bg-blue-50 p-4 rounded-lg`}>
              <h3 className={`text-lg font-medium text-blue-900`}>Today&apos;s Challenge</h3>
              <p className={`text-blue-700 mt-2`}>Complete your daily LeetCode problem to unlock memes!</p>
              <NewQuestionButton buttonText="Get New Question" username={props.username} data={props.data} />
            </div>
    )
}