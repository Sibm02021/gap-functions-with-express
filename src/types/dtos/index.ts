export interface CreateProfile {
    email: string;
    accountName: string;
}

interface CreateSharedPlaylist {
    playlistName: string;
    playlistId: string;
}

export interface CreateSharedPlaylists {
    playlists: CreateSharedPlaylist[];
}