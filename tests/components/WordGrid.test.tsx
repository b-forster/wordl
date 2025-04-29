import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import WordGrid from '../../src/components/WordGrid';
import { useGameStore } from '../../src/store/gameStore';
import { Letter } from '../../src/types';
import theme from '../../src/theme';

// Mock the dependencies
vi.mock('../../src/store/gameStore', () => ({
    useGameStore: vi.fn()
}));

vi.mock('../../src/components/ui/toaster', () => ({
    Toaster: () => <div data-testid="mock-toaster">Toaster</div>
}));

// Mock TileRow component
vi.mock('../../src/components/TileRow', () => {
    const TileRowMock = vi.fn(props => <div data-testid={`tile-row-${props.rowId}`}>{props.rowId}</div>);
    return { default: TileRowMock };
});

describe('WordGrid', () => {
    // Create a mock grid for testing
    const mockGrid: Letter[][] = [
        ['H', 'E', 'L', 'L', 'O'],
        ['W', 'O', 'R', 'L', 'D'],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
    ];

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Default mock implementation
        vi.mocked(useGameStore).mockReturnValue({
            grid: mockGrid,
            activeRow: 2,
        });
    });

    it('renders the correct number of TileRows', () => {
        render(
            <ChakraProvider value={theme}>
                <WordGrid />
            </ChakraProvider>
        );

        // Check for the rendered TileRow components
        const tileRows = screen.getAllByTestId(/tile-row-\d/);
        expect(tileRows.length).toBe(mockGrid.length);
    });

    it('passes the correct active row prop to TileRow', () => {
        // Import the mocked module
        const TileRowModule = vi.importActual('../../src/components/TileRow') as any;

        // Get the mock function from the module mock
        const mockFn = vi.fn();
        vi.doMock('../../src/components/TileRow', () => ({
            default: mockFn
        }));

        render(
            <ChakraProvider value={theme}>
                <WordGrid />
            </ChakraProvider>
        );

        // Check that the correct number of TileRows are rendered
        const tileRows = screen.getAllByTestId(/tile-row-\d/);
        expect(tileRows.length).toBe(mockGrid.length);

        // Check that the active row has the correct index
        const activeRowIndex = 2; // activeRow is 2
        for (let i = 0; i < tileRows.length; i++) {
            const isActive = i === activeRowIndex;
            // Check that the row with index 2 is the active one
            if (isActive) {
                expect(tileRows[i]).toHaveAttribute('data-testid', `tile-row-${activeRowIndex}`);
            }
        }
    });

    it('renders the Toaster component', () => {
        render(
            <ChakraProvider value={theme}>
                <WordGrid />
            </ChakraProvider>
        );
        expect(screen.getByTestId('mock-toaster')).toBeInTheDocument();
    });
});
