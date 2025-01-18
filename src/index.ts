import express, {Request, Response} from 'express';
import validateToken from './auth';
import {playlistsRouter, profileRouter} from "./routes";
import knex from "knex";
import path from "path";

const app = express();

const knexConfig = require(path.join(__dirname, '../knexfile'));

const start = async () => {

    try {

        const client = knex(knexConfig);
        await client.migrate.latest();

        app.use(express.json());
        app.use('/health', (req: Request, res: Response) => {
            res.send('OK');
        });

        app.use('/api/profile', validateToken, profileRouter(client));
        app.use('/api/playlists', validateToken, playlistsRouter(client));
        app.listen(process.env.PORT || 3000, () => {
            console.log('Server running on port 3000');
        });

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start()