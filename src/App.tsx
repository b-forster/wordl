import { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import WordGrid from './components/WordGrid'
import Footer from './components/Footer'
import KeyBoard from './components/Keyboard'
import theme from './theme'
import {
  Button,
  ChakraProvider,
  VStack
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
      <VStack>
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
        {!isGameOver && <KeyBoard />}
        <Footer />
      </VStack>
    </ChakraProvider>
  )
}

export default App
