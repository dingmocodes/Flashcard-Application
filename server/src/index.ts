import express, { Express } from "express";
import bodyParser from 'body-parser';
import { load, save, saveScore, list, listScore } from "./routes";


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/save", save);
app.post("/api/saveScore", saveScore);
app.get("/api/load", load);
app.get("/api/list", list);
app.get("/api/listScore", listScore);
app.listen(port, () => console.log(`Server listening on ${port}`));
