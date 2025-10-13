'use client'
type MediaType = 'video' | 'image'
import { useState, useEffect } from 'react'

export default function MemeViewer() {
    
    const [resolvedType, setResolvedType] = useState<MediaType | null>(null)
    const [memeURL, setMemeURL] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const read = () => {
            const raw = localStorage.getItem('memeURL')
            setMemeURL(raw ? JSON.parse(raw) : null)
            const rawType = localStorage.getItem('memeType')
            setResolvedType(rawType ? JSON.parse(rawType) : null)
            const rawError = localStorage.getItem('memeError')
            setError(rawError ? JSON.parse(rawError) : null)
        }

        // initial read
        read()

        // update on cross-tab storage events and custom in-tab event
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'memeURL') read()
            if (e.key === 'memeType') read()
            if (e.key === 'memeError') read()
        }
        const onCustom = () => read()
        window.addEventListener('storage', onStorage)
        window.addEventListener('memeURLUpdated', onCustom)
        window.addEventListener('memeTypeUpdated', onCustom)
        window.addEventListener('memeErrorUpdated', onCustom)
        return () => {
            window.removeEventListener('storage', onStorage)
            window.removeEventListener('memeURLUpdated', onCustom)
            window.removeEventListener('memeTypeUpdated', onCustom)
            window.removeEventListener('memeErrorUpdated', onCustom)
        }
    }, [memeURL])

    if (!memeURL) return null

    if (error) {
        return (
            <div className="w-full h-auto flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">ERROR</h1>
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (resolvedType && resolvedType.includes('image')) {
        const altText = 'Image'
        return (
            <div className="w-full h-auto flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">CONGRATS! Here is ur meme xP</h1>
                <img src={memeURL} alt={altText} className="w-full h-auto rounded-md" />
            </div>
        )
    }

    const proops ={
        poster: '',
        autoPlay: false,
        controls: true,
        loop: false,
        muted: false,
        playsInline: true,
        preload: 'metadata',
    }

    if (resolvedType && resolvedType.includes('video')) {
    return (
        <div className="w-full h-auto flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">CONGRATS! Here is ur meme xP</h1>
            <video
                src={memeURL}
                poster={proops.poster}
                autoPlay={proops.autoPlay}
                controls={proops.controls}
                loop={proops.loop}
                muted={proops.muted}
                playsInline={proops.playsInline}
                preload={proops.preload}
                className="w-full h-auto rounded-md"
                />
            </div>
        )
    }
}

