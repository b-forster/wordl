import './App.css'
import Header from './components/Header'
import WordGrid from './components/WordGrid'
import theme from './theme'
import {
  ChakraProvider
} from "@chakra-ui/react"



function App() {
  return (
    <ChakraProvider value={theme}>
      <Header />
      <WordGrid />
    </ChakraProvider>
  )
}

export default App
