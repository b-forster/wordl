import { create } from 'zustand'
import { Letter } from '../types'

interface GameState {
    grid: Letter[][]
    activeRow: number
    isGameOver: boolean
    solution: string
    solutionWords: string[]

    loadSolutionWords: () => Promise<void>
    submitGuess: (guess: Letter[]) => void
    resetGame: () => void
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

    // Load solution words from CSV
    loadSolutionWords: async () => {
        try {
            const response = await fetch('/src/data/valid_solutions.csv');
            const text = await response.text();

            // Parse CSV, skip header row, and extract words
            const words = text
                .split('\n')
                .slice(2) // Skip the header and comment line
                .map(line => line.trim().toUpperCase())
                .filter(word => word.length === 5); // Ensure we only get 5-letter words

            // Select a random solution
            const randomSolution = words[Math.floor(Math.random() * words.length)];

            set({
                solutionWords: words,
                solution: randomSolution
            });

            console.log('Selected solution:', randomSolution);
        } catch (error) {
            console.error('Failed to load solution words:', error);
        }
    },

    // Submit guess
    submitGuess: (guess: Letter[]) => {
        const { grid, activeRow, solution } = get()

        if (guess.length < 5) {
            console.log('Not enough letters')
            return
        }

        // Create a new grid with the current guess in the active row
        const newGrid = [...grid]
        newGrid[activeRow] = [...guess]

        // Check win condition against the current solution
        if (guess.join('') === solution) {
            set({
                grid: newGrid,
                activeRow: Infinity,
                isGameOver: true
            })
            return
        }

        // Move to the next row
        set({
            grid: newGrid,
            activeRow: activeRow + 1
        })


        // End the game if there are no more rows
        if (activeRow >= grid.length - 1) {
            set({
                grid: newGrid,
                isGameOver: true
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
            solution: newSolution
        })
    }
}))
