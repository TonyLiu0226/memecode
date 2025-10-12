'use client'
import { getDifficultyChipClasses } from '@/types/types'

export default function DifficultyChip(props: {
    difficulty: string | undefined
}) {
    const classes = getDifficultyChipClasses(props.difficulty)
    return (
        props.difficulty && (
        <div className={`inline-flex items-center px-3 py-1 mb-4 rounded-full text-sm font-medium border ${classes}`}>
            <h1>{props.difficulty}</h1>
        </div>
        )
    )
}