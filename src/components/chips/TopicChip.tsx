'use client'


export default function TopicChip(props: {
    topic: string | undefined
}) {
    return (
        props.topic && (
        <div className={`inline-flex items-center px-3 py-1 mb-4 rounded-full text-sm font-medium border border-gray-400 text-gray-700`}>
            <h1>{props.topic}</h1>
        </div>
        )
    )
}