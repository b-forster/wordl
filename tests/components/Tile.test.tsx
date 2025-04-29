import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Tile from '../../src/components/Tile';
import theme from '../../src/theme';

describe('Tile', () => {
    it('renders with a letter', () => {
        render(
            <ChakraProvider value={theme}>
                <Tile>A</Tile>
            </ChakraProvider>
        );

        expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('renders with a color', () => {
        render(
            <ChakraProvider value={theme}>
                <Tile color="green">A</Tile>
            </ChakraProvider>
        );

        const tile = screen.getByTestId('tile');
        // Check that the color attribute is set
        expect(tile).toHaveAttribute('data-color', 'green');
    });

    it('renders without a letter (empty tile)', () => {
        render(
            <ChakraProvider value={theme}>
                <Tile />
            </ChakraProvider>
        );

        // Since there's no text, we need to check for the tile element
        const tile = screen.getByTestId('tile');
        expect(tile).toBeInTheDocument();
        // Check that there's no text content
        expect(tile).toHaveTextContent('');
    });

    it('renders with no color when no color is provided', () => {
        render(
            <ChakraProvider value={theme}>
                <Tile>A</Tile>
            </ChakraProvider>
        );

        const tile = screen.getByTestId('tile');
        // Check that the color attribute is empty
        expect(tile).toHaveAttribute('data-color', '');
    });

    it('converts lowercase letter to uppercase', () => {
        render(
            <ChakraProvider value={theme}>
                <Tile>a</Tile>
            </ChakraProvider>
        );

        expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('only displays the first character if multiple characters are provided', () => {
        render(
            <ChakraProvider value={theme}>
                <Tile>ABC</Tile>
            </ChakraProvider>
        );

        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.queryByText('ABC')).not.toBeInTheDocument();
    });
});
