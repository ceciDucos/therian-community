export interface Profile {
    id: string;
    username: string;
    display_name?: string;
    pronouns?: string;
    exploration_status?: 'exploring' | 'defined' | 'prefer_not_say';
    theriotype?: string;
    bio?: string;
    personal_boundaries?: string;
    interests?: string[];
    external_links?: Record<string, string>;
    privacy_settings?: PrivacySettings;
    avatar_id?: string;
    avatar_url?: string;
    is_admin?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface PrivacySettings {
    theriotype: 'public' | 'members_only' | 'private';
    pronouns: 'public' | 'members_only' | 'private';
    bio: 'public' | 'members_only' | 'private';
    interests: 'public' | 'members_only' | 'private';
    external_links: 'public' | 'members_only' | 'private';
}
