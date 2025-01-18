import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {Request, Response, NextFunction} from "express";

const ajv = new Ajv();
addFormats(ajv);

const createProfileSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email'
        },
        accountName: {
            type: 'string',
            minLength: 4
        }
    },
    required: ['email', 'accountName']
}

const validate = ajv.compile(createProfileSchema);

export const createProfileValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const bodyValid = validate(req.body);

    if (!bodyValid) {
        return res.status(400).send(validate.errors);
    }

    next();
}
