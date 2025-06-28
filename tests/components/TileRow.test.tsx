import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import TileRow from '../../src/components/TileRow';
import { useGameStore } from '../../src/store/gameStore';
import { useKeyPress } from '../../src/hooks/useKeyPress';
import { evaluateGuess, determineTileColorFromStatus } from '../../src/utils/wordUtils';
import { Letter, LetterStatus } from '../../src/types';
import theme from '../../src/theme';

// Mock dependencies
vi.mock('../../src/store/gameStore', () => ({
    useGameStore: vi.fn()
}));

vi.mock('../../src/hooks/useKeyPress', () => ({
    useKeyPress: vi.fn()
}));

vi.mock('../../src/utils/wordUtils', () => ({
    evaluateGuess: vi.fn(),
    determineTileColorFromStatus: vi.fn()
}));

// Mock Tile component
vi.mock('../../src/components/Tile', () => {
    const TileMock = vi.fn(props => (
        <div
            data-testid="mock-tile"
            data-letter={props.children || ''}
            data-color={props.color || ''}
        >
            {props.children}
        </div>
    ));
    return { default: TileMock };
});

describe('TileRow', () => {
    // Default props
    const defaultProps = {
        word: ['H', 'E', 'L', 'L', 'O'] as Letter[],
        rowId: 0,
        isActive: false
    };

    // Default game store values
    const mockGameStore = {
        currentGuess: ['W', 'O', 'R', 'L', 'D'] as Letter[],
        solution: 'HELLO',
        submitGuess: vi.fn(),
        addLetter: vi.fn(),
        removeLetter: vi.fn()
    };

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Default mock implementations
        vi.mocked(useGameStore).mockReturnValue(mockGameStore);
        vi.mocked(useKeyPress).mockImplementation(() => { });
        vi.mocked(evaluateGuess).mockReturnValue([
            LetterStatus.CORRECT,
            LetterStatus.DIFF_POS,
            LetterStatus.ABSENT,
            LetterStatus.CORRECT,
            LetterStatus.DIFF_POS
        ]);
        vi.mocked(determineTileColorFromStatus).mockImplementation((status) => {
            switch (status) {
                case LetterStatus.CORRECT:
                    return 'green';
                case LetterStatus.DIFF_POS:
                    return 'yellow';
                case LetterStatus.ABSENT:
                    return 'gray';
                default:
                    return undefined;
            }
        });
    });

    it('renders inactive row with correct colors', () => {
        render(
            <ChakraProvider value={theme}>
                <TileRow
                    currentGuess={['H', 'E', 'L', 'L', 'O']}
                    {...defaultProps}
                    letterStatuses={[
                        LetterStatus.CORRECT,
                        LetterStatus.DIFF_POS,
                        LetterStatus.ABSENT,
                        LetterStatus.CORRECT,
                        LetterStatus.DIFF_POS
                    ]}
                />
            </ChakraProvider>
        );

        // We're now passing letterStatuses directly, so evaluateGuess is not called

        // Check that the correct number of tiles are rendered
        const tiles = screen.getAllByTestId('mock-tile');
        expect(tiles).toHaveLength(5);

        // Check that the tiles have the correct letters
        expect(tiles[0]).toHaveAttribute('data-letter', 'H');
        expect(tiles[1]).toHaveAttribute('data-letter', 'E');
        expect(tiles[2]).toHaveAttribute('data-letter', 'L');
        expect(tiles[3]).toHaveAttribute('data-letter', 'L');
        expect(tiles[4]).toHaveAttribute('data-letter', 'O');

        // Check that determineTileColorFromStatus was called for each tile
        expect(determineTileColorFromStatus).toHaveBeenCalledTimes(5);

        // Check that the tiles have the correct colors
        expect(tiles[0]).toHaveAttribute('data-color', 'green');
        expect(tiles[1]).toHaveAttribute('data-color', 'yellow');
        expect(tiles[2]).toHaveAttribute('data-color', 'gray');
        expect(tiles[3]).toHaveAttribute('data-color', 'green');
        expect(tiles[4]).toHaveAttribute('data-color', 'yellow');
    });

    it('renders active row with current guess', () => {
        render(
            <ChakraProvider value={theme}>
                <TileRow
                    {...defaultProps}
                    currentGuess={['W', 'O', 'R', 'L', 'D']}
                    isActive={true}
                    letterStatuses={[]}
                />
            </ChakraProvider>
        );

        // Check that the correct number of tiles are rendered
        const tiles = screen.getAllByTestId('mock-tile');
        expect(tiles).toHaveLength(5);

        // Check that the tiles have the correct letters from currentGuess
        expect(tiles[0]).toHaveAttribute('data-letter', 'W');
        expect(tiles[1]).toHaveAttribute('data-letter', 'O');
        expect(tiles[2]).toHaveAttribute('data-letter', 'R');
        expect(tiles[3]).toHaveAttribute('data-letter', 'L');
        expect(tiles[4]).toHaveAttribute('data-letter', 'D');

        // Check that evaluateGuess was not called for active row
        expect(evaluateGuess).not.toHaveBeenCalled();

        // Check that determineTileColorFromStatus was not called for active row
        expect(determineTileColorFromStatus).not.toHaveBeenCalled();
    });

    it('renders active row with partial guess and empty tiles', () => {
        // Set a partial current guess
        const currentGuess = ['W', 'O'] as Letter[];

        render(
            <ChakraProvider value={theme}>
                <TileRow
                    {...defaultProps}
                    currentGuess={currentGuess}
                    isActive={true}
                    letterStatuses={[]}
                />
            </ChakraProvider>
        );

        // Check that the correct number of tiles are rendered
        const tiles = screen.getAllByTestId('mock-tile');
        expect(tiles).toHaveLength(5);

        // Check that the tiles have the correct letters from currentGuess
        expect(tiles[0]).toHaveAttribute('data-letter', 'W');
        expect(tiles[1]).toHaveAttribute('data-letter', 'O');

        // Check that the remaining tiles are empty
        expect(tiles[2]).toHaveAttribute('data-letter', '');
        expect(tiles[3]).toHaveAttribute('data-letter', '');
        expect(tiles[4]).toHaveAttribute('data-letter', '');
    });

    it('sets up keyboard listeners when active', () => {
        render(
            <ChakraProvider value={theme}>
                <TileRow
                    {...defaultProps}
                    currentGuess={[]}
                    isActive={true}
                    letterStatuses={[]}
                />
            </ChakraProvider>
        );

        // Check that useKeyPress was called for letter keys
        expect(useKeyPress).toHaveBeenCalledWith(expect.objectContaining({
            key: 'regex:/^[A-Za-z]$/',
            isActive: true
        }));

        // Check that useKeyPress was called for Backspace key
        expect(useKeyPress).toHaveBeenCalledWith(expect.objectContaining({
            key: 'Backspace',
            isActive: true
        }));

        // Check that useKeyPress was called for Enter key
        expect(useKeyPress).toHaveBeenCalledWith(expect.objectContaining({
            key: 'Enter',
            isActive: true
        }));
    });

    it('does not set up keyboard listeners when inactive', () => {
        render(
            <ChakraProvider value={theme}>
                <TileRow
                    {...defaultProps}
                    currentGuess={[]}
                    isActive={false}
                    letterStatuses={[
                        LetterStatus.CORRECT,
                        LetterStatus.DIFF_POS,
                        LetterStatus.ABSENT,
                        LetterStatus.CORRECT,
                        LetterStatus.DIFF_POS
                    ]}
                />
            </ChakraProvider>
        );

        // Check that useKeyPress was called with isActive: false
        expect(useKeyPress).toHaveBeenCalledWith(expect.objectContaining({
            isActive: false
        }));
    });
});
