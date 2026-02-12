export interface Product {
    id: string;
    name: string;
    description?: string;
    category: 'mascaras' | 'colas_orejas' | 'rodilleras_quadrobics' | 'digitales';
    price?: number;
    image_url?: string;
    external_link?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface EmbeddedVideo {
    id: string;
    platform: 'youtube' | 'tiktok' | 'instagram';
    video_id: string;
    embed_url: string;
    title: string;
    description?: string;
    added_by: string;
    created_at: string;
}

export interface Report {
    id: string;
    reporter_id: string;
    content_type: 'post' | 'comment' | 'profile';
    content_id: string;
    reason: string;
    status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
    admin_notes?: string;
    reviewed_by?: string;
    created_at: string;
    reviewed_at?: string;
}
