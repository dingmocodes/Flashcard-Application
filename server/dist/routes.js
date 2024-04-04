"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listScore = exports.list = exports.load = exports.saveScore = exports.save = exports.dummy = void 0;
const saveFiles = new Map();
const savedScores = [];
/**
 * Dummy route that just returns a hello message to the client.
 * @param req The request object
 * @param res The response object
 */
const dummy = (req, res) => {
    const name = first(req.query.name);
    if (name === undefined) {
        res.status(400).send('missing or invalid "name" parameter');
        return;
    }
    res.send({ msg: `Hi, ${name}!` });
};
exports.dummy = dummy;
/** Handles request for /save by storing the given file. */
const save = (req, res) => {
    const name = first(req.body.name);
    if (name === undefined) {
        res.status(400).send({ message: 'required argument "name" was missing' });
        return;
    }
    const file = req.body.file;
    if (file === undefined) {
        res.status(400).send({ message: 'required argument "file" was missing' });
        return;
    }
    saveFiles.set(name, file);
    res.status(200).send({ message: `Saved file ${name}` });
};
exports.save = save;
/** Handles request for /saveScore by storing the given file. */
const saveScore = (req, res) => {
    const name = first(req.body.name);
    if (name === undefined) {
        res.status(400).send({ message: 'required argument "name" was missing' });
        return;
    }
    const nameDeck = first(req.body.nameDeck);
    if (nameDeck === undefined) {
        res.status(400).send({ message: 'required argument "nameDeck" was missing' });
        return;
    }
    const correct = req.body.correct;
    if (correct === undefined || !(typeof correct === 'number')) {
        res.status(400).send({ message: 'required argument "correct" was missing' });
        return;
    }
    const incorrect = req.body.incorrect;
    if (incorrect === undefined || !(typeof incorrect === 'number')) {
        res.status(400).send({ message: 'required argument "incorrect" was missing' });
        return;
    }
    const total = correct + incorrect;
    const percentageCorrect = Math.round(correct / total * 100);
    const result = name + ", " + nameDeck + ": " + percentageCorrect;
    savedScores.push(result);
    res.status(200).send({ message: `Saved score ${name}` });
};
exports.saveScore = saveScore;
/** Handles request for /load by returning the file requested. */
const load = (req, res) => {
    const name = first(req.query.name);
    if (name === undefined) {
        res.status(400).send({ message: 'required argument "name" was missing' });
        return;
    }
    if (!saveFiles.has(name)) {
        res.status(400).send({ message: 'no file previously saved with given name' });
        return;
    }
    else {
        res.status(200).send({ value: saveFiles.get(name) });
    }
};
exports.load = load;
/** Handles request for /list by returning all saved files. */
const list = (_req, res) => {
    if (!saveFiles || !saveFiles.keys || typeof saveFiles.keys !== 'function') {
        res.status(200).send({ list: [] });
        return;
    }
    res.status(200).send({ list: Array.from(saveFiles.keys()) });
};
exports.list = list;
/** Handles request for /listScore by returning all saved files. */
const listScore = (_req, res) => {
    if (!savedScores || savedScores.length === 0) {
        res.status(200).send({ list: [] });
        return;
    }
    res.status(200).send({ list: savedScores });
};
exports.listScore = listScore;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param) => {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSxNQUFNLFNBQVMsR0FBeUIsSUFBSSxHQUFHLEVBQW1CLENBQUM7QUFDbkUsTUFBTSxXQUFXLEdBQWEsRUFBRSxDQUFDO0FBRWpDOzs7O0dBSUc7QUFDSSxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQWdCLEVBQUUsR0FBaUIsRUFBUSxFQUFFO0lBQ2pFLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQzVELE9BQU87S0FDUjtJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsT0FBTyxJQUFJLEdBQUcsRUFBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDO0FBUlcsUUFBQSxLQUFLLFNBUWhCO0FBRUYsMkRBQTJEO0FBQ3BELE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBZ0IsRUFBRSxHQUFpQixFQUFRLEVBQUU7SUFDaEUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1FBQ3RCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLHNDQUFzQyxFQUFDLENBQUMsQ0FBQztRQUN4RSxPQUFPO0tBQ1I7SUFFRCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMzQixJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDdEIsR0FBRyxDQUFDLE1BQU0s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