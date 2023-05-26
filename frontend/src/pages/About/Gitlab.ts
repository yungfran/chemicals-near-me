export interface Commit {
    author_name: string
}

export interface Issue {
    closed_at: string | null
    assignees: Array<Member>
}

export interface Member {
    id: number
    name: string
    avatar_url: string
    access_level: number
}

export interface User {
    bio: string
}

export const headers = { 'PRIVATE-TOKEN' : 'xAkodjstCso_zjTRz888' };

