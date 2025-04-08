# WORDL - A Wordle Clone

A React implementation of the popular word-guessing game Wordle, built with TypeScript, Vite, and Chakra UI.

<!-- ![Wordl Game Screenshot](public/screenshot.png) -->

## Features

- **Word Guessing Game**: Try to guess a 5-letter word in 6 attempts
- **Color Feedback**: Get feedback on your guesses with colored tiles
  - $${\textbf{\color{lightgreen}Green:}}$$ Letter is in the correct position
  - $${\textbf{\color{gold}Yellow:}}$$  Letter is in the word but in the wrong position
  - $${\textbf{\color{lightgray}Gray:}}$$ Letter is not in the word
- **Keyboard Support**: 
  - Use your physical keyboard to type guesses
  - Use the on-screen keyboard by clicking or tapping
  - Press Enter to submit guesses
- **Toast Notifications**: Receive feedback messages for invalid guesses or when the game ends
- **Responsive Design**: Play on desktop or mobile devices

## Recent Updates

- Added support for pressing Enter to start a new game when the "Play Again" button is visible
- Fixed toast persistence issue so solution toasts are properly dismissed when starting a new game
- Improved keyboard handling for a more seamless user experience

## Planned Features & Fixes

- Change color of on-screen keyboard keys to match tile colors after guess
- Add tile row reveal animation after a guess is submitted
- Add tile row shaking animation when an error toast is shown
- Improve responsiveness for mobile devices
- Debug build for deployment

## How to Play

1. The game will select a random 5-letter word
2. Type your guess using your keyboard or the on-screen keyboard
3. Press Enter to submit your guess
4. The tiles will change color to provide feedback
5. Keep guessing until you find the word or run out of attempts
6. Press Enter or click "Play Again" to start a new game

## Development

This project is built with:
- React 18
- TypeScript
- Vite
- Chakra UI
- Zustand for state management
- Cline VSCode extension for system design feedback and debugging

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
# Attributions

- Inspiration: <a href="https://www.nytimes.com/games/wordle/index.html" title="Wordle">Wordle by New York Times</a>
- Favicon: <a href="https://www.flaticon.com/free-icons/capital-letter" title="capital letter icons">Capital letter icons created by ArtBit - Flaticon</a>
