export type LeetcodeUsernameResult = {
    id: string,
    lc_username: string
}

export enum Difficulties {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard'
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