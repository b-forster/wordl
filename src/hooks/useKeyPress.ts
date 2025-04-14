import { useEffect, useCallback } from 'react';

interface UseKeyPressOptions {
    /**
     * The key to listen for. Can be a specific key like 'Enter', 'Backspace', etc.,
     * or a regex pattern string in the format 'regex:/pattern/' to match multiple keys
     */
    key: string;

    /**
     * Callback function to execute when the key is pressed.
     * For regex patterns, the matched key is passed as an argument.
     */
    onKeyPress: (key?: string) => void;

    /**
     * Whether the hook is active and should listen for key presses
     * @default true
     */
    isActive?: boolean;

    /**
     * Whether to ignore key presses when modifier keys are pressed
     * @default true
     */
    ignoreWithModifiers?: boolean;
}

/**
 * Custom hook to detect when a specific key is pressed
 * 
 * @param options Configuration options for the hook
 */
export const useKeyPress = ({
    key,
    onKeyPress,
    isActive = true,
    ignoreWithModifiers = true
}: UseKeyPressOptions): void => {

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isActive) return;

        // Skip if should ignore with modifiers and a modifier is pressed
        if (ignoreWithModifiers && (e.ctrlKey || e.metaKey || e.altKey)) return;

        // Check if the key is a regex pattern
        if (key.startsWith('regex:/')) {
            const pattern = key.substring(7, key.length - 1);
            const regex = new RegExp(pattern);

            if (regex.test(e.key)) {
                onKeyPress(e.key);
            }
        }
        // Otherwise, do a direct match
        else if (e.key === key) {
            onKeyPress(e.key);
        }
    }, [key, onKeyPress, isActive, ignoreWithModifiers]);

    // Add and remove event listeners
    useEffect(() => {
        if (isActive) {
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isActive, handleKeyDown]);
};
