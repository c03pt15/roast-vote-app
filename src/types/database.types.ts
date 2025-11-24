export type Profile = {
    id: string;
    username: string;
    avatar_url: string | null;
    created_at: string;
};

export type Post = {
    id: string;
    user_id: string;
    image_url: string;
    caption: string | null;
    type: 'roast' | 'vote';
    created_at: string;
    vote_average?: number; // Computed
    vote_count?: number; // Computed
};

export type Vote = {
    id: string;
    user_id: string;
    post_id: string;
    rating: number;
    created_at: string;
};

export type Comment = {
    id: string;
    user_id: string;
    post_id: string;
    content: string;
    created_at: string;
};
