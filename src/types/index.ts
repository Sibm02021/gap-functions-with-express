interface User {
    id: number;
    spotify_user_id: string;
    email: string;
    account_name: string;
}

interface SharedPlaylist {
    id: number;
    spotify_playlist_id: string;
    owner_id: string;
    playlist_name: string;
    created_at: Date;
    updated_at: Date;
}

interface WanderedPlaylist {
    id: number;
    playlist_id: number;
    recommended_to: string;
    recommended_at: Date;
    has_viewed: boolean;
}

export {
    User,
    SharedPlaylist,
    WanderedPlaylist
}