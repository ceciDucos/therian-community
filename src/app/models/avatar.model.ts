export interface AvatarConfig {
    animalBase: string;
    style: string;
    colors: {
        primary: string;
        secondary: string;
        accent?: string;
    };
    marks: string[];
    accessories: string[];
}

export interface Avatar {
    id: string;
    user_id: string;
    animal_base: string;
    style: string;
    config: AvatarConfig;
    image_url?: string;
    is_active: boolean;
    created_at: string;
}
