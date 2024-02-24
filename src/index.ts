import express, {Request, Response} from 'express';
import * as functions from "@google-cloud/functions-framework";

const app = express();

app.get("/message", (req: Request, res: Response) => {
    res.status(200).send("Hello, World!");
});

app.get("/messages", (req: Request, res: Response) => {
    res.status(200).send(["Hello, World!", "Goodbye, World!"]);
});

app.post("/message", (req: Request, res: Response) => {
    res.status(201).send("Added message");
});

functions.http('messagesAPI', app);
