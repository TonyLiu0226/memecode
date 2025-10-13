'use client'
type MediaType = 'video' | 'image'
import { useState, useEffect } from 'react'
import NextMemeButton from './buttons/NextMemeButton'

export default function MemeViewer(props: {
    mediaType: string[]
}) {
    
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

    const handleResult = (memeURL: { url: string, type: string } | { error: string }) => {
        if (typeof window === 'undefined') return
        try {
            if ('error' in memeURL) {
                localStorage.removeItem('memeURL')
                localStorage.removeItem('memeType')
                localStorage.setItem('memeError', JSON.stringify(memeURL.error))
                window.dispatchEvent(new Event('memeErrorUpdated'))
                window.dispatchEvent(new Event('memeURLUpdated'))
                window.dispatchEvent(new Event('memeTypeUpdated'))
            }
            else {
                localStorage.setItem('memeURL', JSON.stringify(memeURL.url))
                localStorage.setItem('memeType', JSON.stringify(memeURL.type))
                localStorage.removeItem('memeError')
                window.dispatchEvent(new Event('memeErrorUpdated'))
                window.dispatchEvent(new Event('memeURLUpdated'))
                window.dispatchEvent(new Event('memeTypeUpdated'))
            }
        } catch (error) {
          localStorage.removeItem('memeURL')
          localStorage.removeItem('memeType')
          localStorage.setItem('memeError', JSON.stringify(error))
          window.dispatchEvent(new Event('memeErrorUpdated'))
          window.dispatchEvent(new Event('memeURLUpdated'))
          window.dispatchEvent(new Event('memeTypeUpdated'))
          console.error('Error saving meme to localStorage', error)
        }
    }

    if (!memeURL) return null

    if (error) {
        return (
            <div className="w-full h-auto flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">ERROR</h1>
                <p className="text-red-500">{error}</p>
                <NextMemeButton buttonText="TRY AGAIN" mediaType={props.mediaType} onResult={handleResult} />
            </div>
        )
    }

    if (resolvedType && resolvedType.includes('image')) {
        const altText = 'Image'
        return (
            <div className="w-full h-auto flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">CONGRATS! Here is ur meme xP</h1>
                <img src={memeURL} alt={altText} className="w-full h-auto rounded-md" />
                <NextMemeButton buttonText="NEXT MEME 👏👏" mediaType={props.mediaType} onResult={handleResult} />
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
                <button className="mt-4 w-1/2 mx-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => {
                    window.location.reload()
                }}>
                    <NextMemeButton buttonText="NEXT MEME 👏👏" mediaType={props.mediaType} onResult={handleResult} />
                    
                </button>
            </div>
        )
    }
}

