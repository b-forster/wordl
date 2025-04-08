import { create } from 'zustand'
import { Letter } from '../types'

interface GameState {
    grid: Letter[][]
    activeRow: number
    isGameOver: boolean
    solution: string
    solutionWords: string[]
    validGuesses: Set<string>
    currentGuess: Letter[]

    loadWordLists: () => Promise<void>
    submitGuess: (guess?: Letter[]) => void
    resetGame: () => void
    addLetter: (letter: string) => void
    removeLetter: () => void
    clearGuess: () => void
}

// Initial empty grid
const createEmptyGrid = (): Letter[][] => [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
]

export const useGameStore = create<GameState>((set, get) => ({
    // Initial state
    grid: createEmptyGrid(),
    activeRow: 0,
    isGameOver: false,
    solution: '',
    solutionWords: [],
    validGuesses: new Set<string>(),
    currentGuess: [],

    // Load word lists from CSV files
    loadWordLists: async () => {
        try {
            // Load solution words
            const solutionsResponse = await fetch('/src/data/valid_solutions.csv');
            const solutionsText = await solutionsResponse.text();

            // Parse CSV, skip header row, and extract words
            const solutionWords = solutionsText
                .split('\n')
                .slice(2) // Skip the header and comment line
                .map(line => line.trim().toUpperCase())
                .filter(word => word.length === 5); // Ensure we only get 5-letter words

            // Load valid guesses
            const guessesResponse = await fetch('/src/data/valid_guesses.csv');
            const guessesText = await guessesResponse.text();

            // Parse CSV, skip header row, and extract words
            const guessWords = guessesText
                .split('\n')
                .slice(2) // Skip the header and comment line
                .map(line => line.trim().toUpperCase())
                .filter(word => word.length === 5); // Ensure we only get 5-letter words

            // Create a Set for O(1) lookup
            const validGuessesSet = new Set<string>([...guessWords, ...solutionWords]);

            // Select a random solution
            const randomSolution = solutionWords[Math.floor(Math.random() * solutionWords.length)];

            set({
                solutionWords,
                validGuesses: validGuessesSet,
                solution: randomSolution
            });

            console.log('Selected solution:', randomSolution);
        } catch (error) {
            console.error('Failed to load word lists:', error);
        }
    },

    // Add a letter to the current guess
    addLetter: (letter: string) => {
        const { currentGuess, isGameOver } = get()

        // Don't add letters if the game is over
        if (isGameOver) return

        // Only add the letter if we have less than 5 letters
        if (currentGuess.length < 5) {
            set({ currentGuess: [...currentGuess, letter.toUpperCase()] })
        }
    },

    // Remove the last letter from the current guess
    removeLetter: () => {
        const { currentGuess, isGameOver } = get()

        // Don't remove letters if the game is over
        if (isGameOver) return

        set({ currentGuess: currentGuess.slice(0, -1) })
    },

    // Clear the current guess
    clearGuess: () => {
        set({ currentGuess: [] })
    },

    // Submit guess with validation
    submitGuess: (guess?: Letter[]) => {
        const { grid, activeRow, solution, validGuesses, currentGuess } = get()

        // Use provided guess or current guess from state
        const guessToSubmit = guess || currentGuess

        if (guessToSubmit.length < 5) {
            console.log('Not enough letters')
            return
        }

        // Check if guess is in valid guesses list
        const guessWord = guessToSubmit.join('')
        if (!validGuesses.has(guessWord)) {
            console.log('Not in word list')
            return
        }

        // Create a new grid with the current guess in the active row
        const newGrid = [...grid]
        newGrid[activeRow] = [...guessToSubmit]

        // Check win condition against the current solution
        if (guessWord === solution) {
            set({
                grid: newGrid,
                activeRow: Infinity,
                isGameOver: true,
                currentGuess: []
            })
            return
        }

        // Move to the next row
        set({
            grid: newGrid,
            activeRow: activeRow + 1,
            currentGuess: []
        })


        // End the game if there are no more rows
        if (activeRow >= grid.length - 1) {
            set({
                grid: newGrid,
                isGameOver: true,
                currentGuess: []
            })
            return
        }
    },

    // Reset game with a new random solution
    resetGame: () => {
        const { solutionWords } = get()

        // Select a new random solution
        let newSolution = 'HAPPY'; // Default fallback

        if (solutionWords.length > 0) {
            newSolution = solutionWords[Math.floor(Math.random() * solutionWords.length)];
            console.log('New solution:', newSolution);
        }

        set({
            grid: createEmptyGrid(),
            activeRow: 0,
            isGameOver: false,
            solution: newSolution,
            currentGuess: []
        })
    }
}))
