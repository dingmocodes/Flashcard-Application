import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check
const saveFiles: Map<string, unknown> = new Map<string, unknown>();
const savedScores: string[] = [];

/**
 * Dummy route that just returns a hello message to the client.
 * @param req The request object
 * @param res The response object
 */
export const dummy = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing or invalid "name" parameter');
    return;
  }

  res.send({msg: `Hi, ${name}!`});
};

/** Handles request for /save by storing the given file. */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.body.name);
  if (name === undefined) {
    res.status(400).send({message: 'required argument "name" was missing'});
    return;
  }

  const file = req.body.file;
  if (file === undefined) {
    res.status(400).send({message: 'required argument "file" was missing'});
    return;
  }

  saveFiles.set(name, file);

  res.status(200).send({message: `Saved file ${name}`});
}

/** Handles request for /saveScore by storing the given file. */
export const saveScore = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.body.name);
  if (name === undefined) {
    res.status(400).send({message: 'required argument "name" was missing'});
    return;
  }

  const nameDeck = first(req.body.nameDeck);
  if (nameDeck === undefined) {
    res.status(400).send({message: 'required argument "nameDeck" was missing'});
    return;
  }

  const correct = req.body.correct;
  if (correct === undefined || !(typeof correct === 'number')) {
    res.status(400).send({message: 'required argument "correct" was missing'});
    return;
  }

  const incorrect = req.body.incorrect;
  if (incorrect === undefined || !(typeof incorrect === 'number')) {
    res.status(400).send({message: 'required argument "incorrect" was missing'});
    return;
  }
  const total: number = correct + incorrect;
  const percentageCorrect = Math.round(correct / total * 100);
  const result: string = name + ", " + nameDeck + ": " + percentageCorrect;
  savedScores.push(result);

  res.status(200).send({message: `Saved score ${name}`});
}

/** Handles request for /load by returning the file requested. */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send({message: 'required argument "name" was missing'});
    return;
  }
  if (!saveFiles.has(name)) {
    res.status(400).send({message: 'no file previously saved with given name'});
    return;
  } else {
    res.status(200).send({value: saveFiles.get(name)});
  }
}

/** Handles request for /list by returning all saved files. */
export const list = (_req: SafeRequest, res: SafeResponse): void => {
  if (!saveFiles || !saveFiles.keys || typeof saveFiles.keys !== 'function') {
    res.status(200).send({ list: [] });
    return;
  }
  res.status(200).send({list: Array.from(saveFiles.keys())});
}

/** Handles request for /listScore by returning all saved files. */
export const listScore = (_req: SafeRequest, res: SafeResponse): void => {
  if (!savedScores || savedScores.length === 0) {
    res.status(200).send({ list: [] });
    return;
  }
  res.status(200).send({list: savedScores});
}

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
