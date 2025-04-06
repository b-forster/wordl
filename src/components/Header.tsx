import { Text } from '@chakra-ui/react'
import React from 'react'

const Header = () => {
    return (
        <>
            <Text fontSize='5xl' fontWeight='semibold'>Wordl</Text>
            <Text fontSize='md' mb='5'>A New York Times <a href='https://www.nytimes.com/games/wordle' target='_blank noopener noreferrer'>Wordle</a> clone</Text>
        </>
    )
}

export default Header