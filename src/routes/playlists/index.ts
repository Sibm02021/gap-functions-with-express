import {Request, Response, Router} from "express";
import {Knex} from "knex";
import {SharedPlaylist, WanderedPlaylist} from "../../types";
import {CreateSharedPlaylists} from "../../types/dtos";

export function playlistsRouter(
    client: Knex
) {

    const router = Router();

    router.get('/shared', async (req: Request, res: Response) => {

        try {

            const result = await client<SharedPlaylist>('shared_playlists')
                .where('owner_id', req.userId)
                .select();

            return res.status(200).send(result);

        } catch (error) {
            return res.sendStatus(500);
        }
    });


    router.post('/shared', async (req: Request, res: Response) => {

        try {

            const createSharedPlaylistsDto = <CreateSharedPlaylists>req.body;

            await Promise.all(createSharedPlaylistsDto.playlists.map(async (playlist) => {
                await client('shared_playlists')
                    .insert({
                        spotify_playlist_id: playlist.playlistId,
                        owner_id: req.userId,
                        playlist_name: playlist.playlistName
                    });
            }));

            return res.sendStatus(201);

        } catch (error) {
            return res.sendStatus(500);
        }
    });

    router.put('/shared', async (req: Request, res: Response)=> {
        try {

            const existingSharedPlaylists = await client<SharedPlaylist>('shared_playlists')
                .where('owner_id', req.userId)
                .select();
            const updatedSharedPlaylists = <CreateSharedPlaylists>req.body;

            const existingPlaylistIds = new Set(existingSharedPlaylists.map(playlist => playlist.spotify_playlist_id));

            const playlistsToAdd = updatedSharedPlaylists.playlists.filter(playlist => !existingPlaylistIds.has(playlist.playlistId));
            const playlistsToRemove = existingSharedPlaylists.filter(playlist => !updatedSharedPlaylists.playlists.some(updatedPlaylist => updatedPlaylist.playlistId === playlist.spotify_playlist_id));

            await Promise.all(playlistsToAdd.map(async playlist => {
                await client('shared_playlists')
                    .insert({
                        spotify_playlist_id: playlist.playlistId,
                        owner_id: req.userId,
                        playlist_name: playlist.playlistName
                    });
            }));

            // TODO - Might be better to do a soft delete by setting the deleted at as recommendations will still reference
            await Promise.all(playlistsToRemove.map(async playlist => {
                await client('shared_playlists')
                    .insert({
                        spotify_playlist_id: playlist.spotify_playlist_id,
                        owner_id: req.userId,
                        playlist_name: playlist.playlist_name
                    });
            }));

            const sharedPlaylists = await client('shared_playlists')
                .where('owner_id', req.userId)
                .select();

            return res.status(200).send(sharedPlaylists);
        } catch (error) {
            return res.sendStatus(500);
        }
    });

    router.get('/wandered', async (req: Request, res: Response) => {

        try {

            const wanderedPlaylists = await client('wandered_playlists')
                .where('recommended_to', req.userId)
                .select();

            return res.status(200).send(wanderedPlaylists);
        } catch (error) {
            return res.sendStatus(500);
        }
    });


    return router;
}