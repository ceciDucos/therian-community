export interface Post {
    id: string;
    author_id: string;
    content: string;
    image_url?: string;
    likes_count: number;
    comments_count: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;

    // Joined data (not in DB)
    author?: {
        username: string;
        display_name?: string;
        avatar_url?: string;
    };
}

export interface Comment {
    id: string;
    post_id: string;
    author_id: string;
    content: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;

    // Joined data
    author?: {
        username: string;
        display_name?: string;
        avatar_url?: string;
    };
}

export interface Like {
    id: string;
    user_id: string;
    post_id: string;
    created_at: string;
}
