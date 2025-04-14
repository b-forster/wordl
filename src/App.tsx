import { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import WordGrid from './components/WordGrid'
import Footer from './components/Footer'
import KeyBoard from './components/Keyboard/Keyboard'
import theme from './theme'
import {
  ChakraProvider,
  VStack,
  Box
} from "@chakra-ui/react"
import { useGameStore } from './store/gameStore'
import PlayAgainButton from './components/PlayAgainButton'


function App() {
  const { isGameOver, loadWordLists } = useGameStore()

  // Load all possible solution words and valid guesses when the app starts
  useEffect(() => {
    loadWordLists()
  }, [loadWordLists])

  return (
    <ChakraProvider value={theme}>
      <VStack gap='0'>
        <Header />
        <WordGrid />
        <Box height="200px" display="flex" alignItems="flex-start" justifyContent="center">
          {isGameOver ? <PlayAgainButton /> : <KeyBoard />}
        </Box>
        <Footer />
      </VStack>
    </ChakraProvider>
  )
}

export default App
