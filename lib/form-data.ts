export interface WeaponItem {
    name: string
    description: string
    title: string | null
    icon: string | null
}

export interface DiscItem {
    name: string
    description: string
    icon: string | null
}

export interface SkillItem {
    title: string
    description: string
    explanation: string
    demo: string | null
}

export interface MindscapeItem {
    num: number
    description: string
}

export interface TeamCharacter {
    name: string
}

export interface TeamItem {
    name: string
    description: string | null
    characters: TeamCharacter[]
}

export interface ExtraSection {
    title: string
    description: string
}

export interface StatMainItem {
    pos: number
    stat_priority: string
}

export interface FormData {
    author: string
    last_updated: string
    character: {
        name: string
        rarity: number
        banner: string | null
    }
    description: string
    weapons: WeaponItem[]
    discs: {
        four_pieces: DiscItem[]
        two_pieces: DiscItem[]
        extra_sections: ExtraSection[]
    } | null
    stat: {
        main_stats: StatMainItem[]
        sub_stats: string
        baseline_stats: string
        extra_sections: ExtraSection[]
    } | null
    skill_priority: {
        priorities: string[][]
        description: string
    } | null
    skills: SkillItem[]
    mindscapes: MindscapeItem[]
    team: {
        teams: TeamItem[]
        extra_sections: ExtraSection[]
    } | null
    rotation: {
        title: string
        description: string
    } | null
}

export const defaultFormData: FormData = {
    author: "",
    last_updated: new Date().toISOString().split("T")[0],
    character: {
        name: "",
        rarity: 5,
        banner: null,
    },
    description: "",
    weapons: [],
    discs: null,
    stat: null,
    skill_priority: null,
    skills: [],
    mindscapes: [],
    team: null,
    rotation: null,
}
