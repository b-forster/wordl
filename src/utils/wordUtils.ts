import { Letter, LetterStatus, letterStatusColorMap, CharCounts } from '../types';

// Helper function to determine if a letter exists at a specific position in the solution
export const existsAtPosition = (letter: Letter, index: number, word: string): boolean => {
    return word.charAt(index) === letter;
};

// Helper function to determine if a letter exists anywhere in the solution
export const existsInWord = (letter: Letter, charCountsMap: CharCounts): boolean => {
    if (!letter) return false;
    const count = charCountsMap.get(letter);
    return !!count && count > 0;
};

// Helper function to decrement the count of a letter in the charCounts map
export const decrementCharCount = (letter: Letter, charCountsMap: CharCounts): void => {
    if (letter) {
        charCountsMap.set(letter, (charCountsMap.get(letter) || 0) - 1);
    }
};

// Helper function to evaluate the status of a letter
export const evaluateLetterStatus = (
    letter: Letter,
    index: number,
    solution: string,
    charCountsMap: CharCounts
): LetterStatus => {
    if (!letter) return LetterStatus.UNKNOWN;

    if (existsAtPosition(letter, index, solution)) {
        return LetterStatus.CORRECT;
    }

    if (existsInWord(letter, charCountsMap)) {
        return LetterStatus.DIFF_POS;
    }

    return LetterStatus.ABSENT;
};

// Helper function to determine tile color from letter status
export const determineTileColorFromStatus = (status: LetterStatus): string | undefined => {
    return letterStatusColorMap[status];
};

// Main function to process a letter and get its tile color
export const processMatchAndGetTileColor = (
    solution: string,
    letter: Letter,
    index: number,
    charCountsMap?: CharCounts
): string | undefined => {
    if (!letter) return undefined;

    // If charCounts is not provided, create a new one
    const counts = charCountsMap || createCharCounts(solution);

    // Get the letter match status
    const status = evaluateLetterStatus(letter, index, solution, counts);

    // Keep track of number of matches in case of repeated letters
    // ex: for solution 'HAPPY', first two instances of 'P' in guess are yellow/green matches, third is not
    if (status === LetterStatus.CORRECT || status === LetterStatus.DIFF_POS) {
        decrementCharCount(letter, counts);
    }

    return determineTileColorFromStatus(status);
};

// Helper function to create a character counts map from a string
export const createCharCounts = (word: string): CharCounts => {
    const counts = new Map<string, number>();

    for (const char of word.split('')) {
        counts.set(char, (counts.get(char) || 0) + 1);
    }

    return counts;
};
