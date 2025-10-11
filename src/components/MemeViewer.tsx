'use client'
type MediaType = 'video' | 'image'
import { useState, useEffect } from 'react'

type VideoProps = {
    type?: 'video'
    poster?: string
    autoPlay?: boolean
    controls?: boolean
    loop?: boolean
    muted?: boolean
    playsInline?: boolean
    preload?: 'auto' | 'metadata' | 'none'
}

type ImageProps = {
    type: 'image'
    alt?: string
}

export default function MemeViewer(props: VideoProps | ImageProps) {
    
    const [resolvedType, setResolvedType] = useState<MediaType | null>(null)
    const [memeURL, setMemeURL] = useState<string | null>(null)

    useEffect(() => {
        const read = () => {
            const raw = localStorage.getItem('memeURL')
            setMemeURL(raw ? JSON.parse(raw) : null)
            const rawType = localStorage.getItem('memeType')
            setResolvedType(rawType ? JSON.parse(rawType) : null)
        }

        // initial read
        read()

        // update on cross-tab storage events and custom in-tab event
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'memeURL') read()
            if (e.key === 'memeType') read()
        }
        const onCustom = () => read()
        window.addEventListener('storage', onStorage)
        window.addEventListener('memeURLUpdated', onCustom)
        window.addEventListener('memeTypeUpdated', onCustom)
        return () => {
            window.removeEventListener('storage', onStorage)
            window.removeEventListener('memeURLUpdated', onCustom)
            window.removeEventListener('memeTypeUpdated', onCustom)
        }
    }, [memeURL])

    if (!memeURL) return null

    if (resolvedType && resolvedType.includes('image')) {
        const altText = (props as ImageProps).alt || 'Image'
        return (
            <div className="w-full h-auto flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">CONGRATS! Here is ur meme xP</h1>
                <img src={memeURL} alt={altText} className="w-full h-auto rounded-md" />
            </div>
        )
    }

    const {
        poster,
        autoPlay = false,
        controls = true,
        loop = false,
        muted = false,
        playsInline = true,
        preload = 'metadata',
    } = props as VideoProps

    if (resolvedType && resolvedType.includes('video')) {
    return (
        <div className="w-full h-auto flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">CONGRATS! Here is ur meme xP</h1>
            <video
                src={memeURL}
                poster={poster}
                autoPlay={autoPlay}
                controls={controls}
                loop={loop}
                muted={muted}
                playsInline={playsInline}
                preload={preload}
                className="w-full h-auto rounded-md"
                />
            </div>
        )
    }
}

