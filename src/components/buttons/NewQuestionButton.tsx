import { UserResult } from '@/types/types'

export default function NewQuestionButton(props: {
    buttonText: string
    username: string
    data: UserResult
}) {
    const generateQuestion = () => {

    }

    return (
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => {
            generateQuestion()
        }}>
            {props.buttonText || 'New Question'}
        </button>
    )
}