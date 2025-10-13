'use client'
import { getMeme } from '@/app/actions'
// types unused here
import { useState } from 'react'

export default function NextMemeButton(props: {
    buttonText: string
    onResult: (memeURL: { url: string, type: string } | { error: string }) => void
    mediaType: string[]
}) {
    const [error, setError] = useState<string | null>(null)

    return (
        <>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={async () => {
            const memeURL = await getMeme({ mediaType: props.mediaType })
            if ('error' in memeURL) {
                console.error('Error getting meme', memeURL.error)
                props.onResult({ error: memeURL.error || 'Error getting meme' })
                setError(memeURL.error || 'Error getting meme')
                return
            }
            props.onResult({url: memeURL.url, type: memeURL.type})
        }}>
            {props.buttonText}
        </button>
        </>
    )
}