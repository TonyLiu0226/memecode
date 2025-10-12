export type LeetcodeUsernameResult = {
    id: string,
    lc_session: string,
    csrftoken: string,
    lc_username: string,
    difficulties?: string[] | null,
    meme_preferences?: string[] | null
}

export enum Difficulties {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD'
}

export type UserResult = {
    id: string,
    memes_left: number,
    questions_left: number,
    refresh_left: number,
    total_memes: number,
    total_ez_solved: number,
    total_md_solved: number,
    total_hd_solved: number
}

export type TopicTag = {
    name: string,
    slug: string
}

export type UserPreferences = {
    id: string,
    difficulties: string[],
    meme_preferences: string[]
}

export function getDifficultyChipClasses(difficulty?: string): string {
    if (difficulty === 'Easy') return 'border-green-400 text-green-700'
    if (difficulty === 'Medium') return 'border-yellow-400 text-yellow-700'
    if (difficulty === 'Hard') return 'border-red-400 text-red-700'
    return 'border-gray-300 text-gray-700'
}

export function getDifficultyBgClass(difficulty?: string): string {
    if (difficulty === 'Easy') return 'bg-green-100'
    if (difficulty === 'Medium') return 'bg-yellow-100'
    if (difficulty === 'Hard') return 'bg-red-100'
    return 'bg-gray-100'
}

export type GeneratedQuestion = {
    title?: string
    titleSlug?: string
    difficulty?: string
    isPaidOnly?: boolean
    status?: string
    topicTags?: TopicTag[] | null
    acRate?: number
}