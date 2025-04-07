import { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import WordGrid from './components/WordGrid'
import theme from './theme'
import {
  Button,
  ChakraProvider
} from "@chakra-ui/react"
import { useGameStore } from './store/gameStore'


function App() {
  const { isGameOver, resetGame, loadWordLists } = useGameStore()

  // Load all possible solution words and valid guesses when the app starts
  useEffect(() => {
    loadWordLists()
  }, [loadWordLists])

  return (
    <ChakraProvider value={theme}>
      <Header />
      <WordGrid />
      {isGameOver && (
        <Button
          rounded='full'
          variant='outline'
          w='60%'
          p={5}
          m={8}
          onClick={resetGame}
        >
          Play again
        </Button>
      )}
    </ChakraProvider>
  )
}

export default App
