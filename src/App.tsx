import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import WordGrid from './components/WordGrid'
import theme from './theme'
import {
  Button,
  ChakraProvider
} from "@chakra-ui/react"


function App() {
  const [gameOver, setGameOver] = useState<boolean>(false)

  return (
    <ChakraProvider value={theme}>
      <Header />
      <WordGrid onGameOver={() => setGameOver(true)} />
      {gameOver && <Button rounded='full' variant='outline' w='60%' p={5} m={8}>Play again</Button>}
    </ChakraProvider>
  )
}

export default App
