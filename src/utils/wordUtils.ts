import { Letter, LetterStatus, letterStatusColorMap, CharCounts } from '../types';

// Main function to evaluate a guess against a solution using a two-pass approach
export const evaluateGuess = (
    guess: Letter[],
    solution: string
): LetterStatus[] => {
    // Initialize result array with UNKNOWN status
    const result: LetterStatus[] = Array(guess.length).fill(LetterStatus.UNKNOWN);

    // Create a map of character counts from the solution
    const remainingChars: CharCounts = createCharCounts(solution);

    // First pass: Mark correct (green) letters and decrement counts
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        if (!letter) continue;

        if (existsAtPosition(letter, i, solution)) {
            result[i] = LetterStatus.CORRECT;
            decrementCharCount(letter, remainingChars);
        }
    }

    // Second pass: Mark incorrect position (yellow) or absent (gray) letters
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        if (!letter || result[i] === LetterStatus.CORRECT) continue;

        if (remainsInWord(letter, remainingChars)) {
            result[i] = LetterStatus.DIFF_POS;
            decrementCharCount(letter, remainingChars);
        } else {
            result[i] = LetterStatus.ABSENT;
        }
    }

    return result;
};

// Helper function to determine if a letter exists at a specific position in the solution
export const existsAtPosition = (letter: Letter, index: number, word: string): boolean => {
    if (!letter) return false;
    return word.charAt(index) === letter;
};

// Helper function to determine if a letter exists anywhere in the solution
export const existsInWord = (letter: Letter, word: string): boolean => {
    if (!letter) return false;
    return word.includes(letter)
};

// Helper function to determine if a letter exists and has not yet appeared enought times in current guess
const remainsInWord = (letter: Letter, remainingChars: CharCounts): boolean => {
    if (!letter) return false;
    const counts = remainingChars.get(letter) || 0;
    return counts > 0;
}

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
    word: string,
    remainingChars: CharCounts
): LetterStatus => {
    if (!letter) return LetterStatus.UNKNOWN;

    if (existsAtPosition(letter, index, word)) {
        return LetterStatus.CORRECT;
    }

    if (remainsInWord(letter, remainingChars)) {
        // Check if the letter exists in the word and has a positive count in remainingChars
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
    remainingChars: CharCounts
): string | undefined => {
    if (!letter) return undefined;

    // Get the letter match status
    const status: LetterStatus = evaluateLetterStatus(letter, index, solution, remainingChars);

    // Keep track of number of matches in case of repeated letters
    // ex: for solution 'HAPPY', first two instances of 'P' in guess are yellow/green matches, third is not
    if (status === LetterStatus.CORRECT || status === LetterStatus.DIFF_POS) {
        decrementCharCount(letter, remainingChars);
    }

    return determineTileColorFromStatus(status);
};

// Helper function to create a character counts map from a string
export const createCharCounts = (word: string): CharCounts => {
    const counts: CharCounts = new Map();

    for (const char of word) {
        counts.set(char, (counts.get(char) || 0) + 1);
    }

    return counts;
};
