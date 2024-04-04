import { List, cons, nil } from './list';
//import { isRecord } from './record';

export type Deck = {readonly name: string, 
                    readonly front: List<string>, 
                    readonly back: List<string>
};


const parseLine = (lines: string[], front: List<string>, back: List<string>): { front: List<string>, back: List<string> } => {
    if (lines.length === 0) {
        // Base case: No more lines to process, return the final lists
        return { front, back };
    }

    // Process the first line
    const line = lines[0];
    const [frontPart, backPart] = line.split('|').map(part => part.trim());

    // Construct new lists by consing elements onto the front and back lists
    const newFront = cons(frontPart, front);
    const newBack = cons(backPart, back);

    return parseLine(lines.slice(1), newFront, newBack);
};

/** Parses the input string into a Deck object. */
export const parseBody = (nameDeck: string, input: string): Deck => {
    // Split the input string into lines
    const lines: string[] = input.split('\n');

    // Process each line using the parseLine helper function
    const updatedLists: { front: List<string>, back: List<string> } = parseLine(lines, nil, nil);

    const frontList: List<string> = updatedLists.front;
    const backList: List<string> = updatedLists.back;

    return {
        name: nameDeck,
        front: frontList,
        back: backList
    };
};