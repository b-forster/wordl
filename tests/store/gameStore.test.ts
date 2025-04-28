import { describe, it, expect, beforeEach, vi, beforeAll, afterEach } from 'vitest';
import { useGameStore } from '../../src/store/gameStore';

// Mock the toaster module
vi.mock('../../src/components/ui/toaster', () => {
    return {
        toaster: {
            create: vi.fn(),
            dismiss: vi.fn()
        }
    };
});

// Mock the wordUtils functions
vi.mock('../../src/utils/wordUtils', () => ({
    existsAtPosition: (letter: string, index: number, word: string) =>
        word[index] === letter,
    existsInWord: (letter: string, word: string) =>
        word.includes(letter)
}));

describe('Game Store', () => {
    beforeAll(() => {
        // Setup global fetch mock
        global.fetch = vi.fn();
    });

    beforeEach(() => {
        // Reset the store before each test
        useGameStore.getState().resetGame();

        // Reset all mocks
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Reset fetch mock
        vi.mocked(fetch).mockReset();
    });

    it('should add a letter to the current guess', () => {
        const { addLetter } = useGameStore.getState();
        addLetter('A');
        expect(useGameStore.getState().currentGuess).toEqual(['A']);
    });

    it('should not add more than 5 letters', () => {
        const { addLetter } = useGameStore.getState();
        addLetter('A');
        addLetter('B');
        addLetter('C');
        addLetter('D');
        addLetter('E');
        addLetter('F'); // This should not be added
        expect(useGameStore.getState().currentGuess).toEqual(['A', 'B', 'C', 'D', 'E']);
    });

    it('should remove the last letter', () => {
        const { addLetter, removeLetter } = useGameStore.getState();
        addLetter('A');
        addLetter('B');
        removeLetter();
        expect(useGameStore.getState().currentGuess).toEqual(['A']);
    });

    it('should clear the guess', () => {
        const { addLetter, clearGuess } = useGameStore.getState();
        addLetter('A');
        addLetter('B');
        clearGuess();
        expect(useGameStore.getState().currentGuess).toEqual([]);
    });

    describe('submitGuess', () => {
        it('should not submit if guess is less than 5 letters', async () => {
            const { addLetter, submitGuess } = useGameStore.getState();
            // Use the mock toaster directly
            const { toaster } = await import('../../src/components/ui/toaster');

            // Add only 4 letters
            addLetter('A');
            addLetter('B');
            addLetter('C');
            addLetter('D');

            submitGuess();

            // Check that toaster was called with "Not enough letters"
            expect(toaster.create).toHaveBeenCalledWith({
                description: 'Not enough letters',
            });

            // Check that the grid wasn't updated
            expect(useGameStore.getState().grid[0]).toEqual([null, null, null, null, null]);
            expect(useGameStore.getState().activeRow).toBe(0);
        });

        it('should not submit if guess is not in valid guesses list', async () => {
            const { addLetter, submitGuess } = useGameStore.getState();
            // Use the mock toaster directly
            const { toaster } = await import('../../src/components/ui/toaster');

            // Set up valid guesses
            useGameStore.setState({ validGuesses: new Set(['VALID']) });

            // Add 5 letters that form an invalid word
            addLetter('I');
            addLetter('N');
            addLetter('V');
            addLetter('A');
            addLetter('L');

            submitGuess();

            // Check that toaster was called with "Not in word list"
            expect(toaster.create).toHaveBeenCalledWith({
                description: 'Not in word list',
            });

            // Check that the grid wasn't updated
            expect(useGameStore.getState().grid[0]).toEqual([null, null, null, null, null]);
            expect(useGameStore.getState().activeRow).toBe(0);
        });

        it('should update the grid and move to next row on valid guess', () => {
            const { addLetter, submitGuess } = useGameStore.getState();

            // Set up valid guesses and solution
            useGameStore.setState({
                validGuesses: new Set(['GUESS']),
                solution: 'HELLO'
            });

            // Add 5 letters that form a valid word
            addLetter('G');
            addLetter('U');
            addLetter('E');
            addLetter('S');
            addLetter('S');

            submitGuess();

            // Check that the grid was updated
            expect(useGameStore.getState().grid[0]).toEqual(['G', 'U', 'E', 'S', 'S']);
            expect(useGameStore.getState().activeRow).toBe(1);
            expect(useGameStore.getState().currentGuess).toEqual([]);
        });

        it('should update letter statuses correctly', () => {
            const { addLetter, submitGuess } = useGameStore.getState();

            // Set up valid guesses and solution
            useGameStore.setState({
                validGuesses: new Set(['HELLO']),
                solution: 'HELLO'
            });

            // Add the solution word
            addLetter('H');
            addLetter('E');
            addLetter('L');
            addLetter('L');
            addLetter('O');

            submitGuess();

            // Check that correct letters were updated
            expect(useGameStore.getState().correctLetters.has('H')).toBe(true);
            expect(useGameStore.getState().correctLetters.has('E')).toBe(true);
            expect(useGameStore.getState().correctLetters.has('L')).toBe(true);
            expect(useGameStore.getState().correctLetters.has('O')).toBe(true);
        });

        it('should end the game when the correct word is guessed', async () => {
            const { addLetter, submitGuess } = useGameStore.getState();
            // Use the mock toaster directly
            const { toaster } = await import('../../src/components/ui/toaster');

            // Set up valid guesses and solution
            useGameStore.setState({
                validGuesses: new Set(['HELLO']),
                solution: 'HELLO'
            });

            // Add the solution word
            addLetter('H');
            addLetter('E');
            addLetter('L');
            addLetter('L');
            addLetter('O');

            submitGuess();

            // Check that the game is over
            expect(useGameStore.getState().isGameOver).toBe(true);
            expect(useGameStore.getState().activeRow).toBe(Infinity);

            // Check that the win message was shown
            expect(toaster.create).toHaveBeenCalledWith({
                description: 'Genius',
            });
        });

        it('should end the game after 6 incorrect guesses', async () => {
            const { addLetter, submitGuess } = useGameStore.getState();
            // Use the mock toaster directly
            const { toaster } = await import('../../src/components/ui/toaster');

            // Set up valid guesses and solution
            useGameStore.setState({
                validGuesses: new Set(['GUESS']),
                solution: 'HELLO',
                activeRow: 5 // Last row
            });

            // Add a valid but incorrect word
            addLetter('G');
            addLetter('U');
            addLetter('E');
            addLetter('S');
            addLetter('S');

            submitGuess();

            // Check that the game is over
            expect(useGameStore.getState().isGameOver).toBe(true);

            // Check that the solution was shown
            expect(toaster.create).toHaveBeenCalledWith({
                description: 'HELLO',
                duration: Infinity,
            });
        });
    });

    describe('resetGame', () => {
        it('should reset the game state', async () => {
            const { addLetter, submitGuess, resetGame } = useGameStore.getState();
            // Use the mock toaster directly
            const { toaster } = await import('../../src/components/ui/toaster');

            // Set up valid guesses and solution
            useGameStore.setState({
                validGuesses: new Set(['GUESS']),
                solution: 'HELLO',
                solutionWords: ['HAPPY', 'HELLO'],
                isGameOver: true,
                activeRow: 3,
                grid: [
                    ['G', 'U', 'E', 'S', 'S'],
                    ['T', 'E', 'S', 'T', 'S'],
                    ['W', 'O', 'R', 'D', 'S'],
                    [null, null, null, null, null],
                    [null, null, null, null, null],
                    [null, null, null, null, null],
                ],
                correctLetters: new Set(['H', 'E']),
                diffPosLetters: new Set(['L']),
                wrongLetters: new Set(['G', 'U', 'S'])
            });

            resetGame();

            // Check that the game state was reset
            expect(useGameStore.getState().isGameOver).toBe(false);
            expect(useGameStore.getState().activeRow).toBe(0);
            expect(useGameStore.getState().grid).toEqual([
                [null, null, null, null, null],
                [null, null, null, null, null],
                [null, null, null, null, null],
                [null, null, null, null, null],
                [null, null, null, null, null],
                [null, null, null, null, null],
            ]);
            expect(useGameStore.getState().currentGuess).toEqual([]);
            expect(useGameStore.getState().correctLetters.size).toBe(0);
            expect(useGameStore.getState().diffPosLetters.size).toBe(0);
            expect(useGameStore.getState().wrongLetters.size).toBe(0);

            // Check that toaster.dismiss was called
            expect(toaster.dismiss).toHaveBeenCalled();
        });
    });

    describe('loadWordLists', () => {
        it('should set solution from solutionWords when resetGame is called', () => {
            // Set up the solution words
            const mockSolutionWords = ['HELLO', 'WORLD', 'HAPPY'];

            // Spy on Math.random to ensure consistent solution selection
            const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

            // Set the solution words and call resetGame
            useGameStore.setState({ solutionWords: mockSolutionWords });
            useGameStore.getState().resetGame();

            // Get the state after reset
            const state = useGameStore.getState();

            // Restore Math.random
            randomSpy.mockRestore();

            // Check that the solution is the first word (due to Math.random = 0)
            expect(state.solution).toBe('HELLO');
        });

        it('should handle errors when loading word lists', async () => {
            // Mock fetch to throw an error
            vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const { loadWordLists } = useGameStore.getState();

            await loadWordLists();

            // Check that the error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Failed to load word lists:', expect.any(Error));

            consoleSpy.mockRestore();
        });
    });
});
