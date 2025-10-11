'use client'
import { DifficultyColors } from '@/types/types'

export default function DifficultyChip(props: {
    difficulty: string | undefined
}) {
    return (
        props.difficulty && (
        <div className={`inline-flex items-center px-3 py-1 mb-4 rounded-full text-sm font-medium border border-${DifficultyColors.get(props.difficulty)}-400 text-${DifficultyColors.get(props.difficulty)}-700`}>
            <h1>{props.difficulty}</h1>
        </div>
        )
    )
}