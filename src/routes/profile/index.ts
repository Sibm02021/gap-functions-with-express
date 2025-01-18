import {Router, Request, Response} from "express";
import {User} from "../../types";
import {CreateProfile} from "../../types/dtos";
import {Knex} from "knex";
import {createProfileValidator} from "../../validators";

export function profileRouter(
    client: Knex
) {

    const router = Router();

    router.get('/', async (req: Request, res: Response)=> {

        try {

            const result = await client<User>('users')
                .where('spotify_user_id', req.userId)
                .select()
                .first();

            if (!result) {
                return res.status(404).send('User not found');
            }

            return res.status(200).send(result);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Failed to connect to database');
        }
    });

    router.post('/', createProfileValidator,  async (req: Request, res: Response)=> {

        try {

            const createProfileDto = <CreateProfile>req.body;

            await client('users')
                .insert({
                    spotify_user_id: req.userId,
                    email: createProfileDto.email,
                    account_name: createProfileDto.accountName
                });

            return res.sendStatus(201);

        } catch (error) {
            return res.sendStatus(500);
        }
    });

    return router;

}