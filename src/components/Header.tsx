import { Text, VStack } from '@chakra-ui/react'

const Header = () => {
    return (
        <VStack gap={0}>
            <Text textStyle='decorative' fontSize='6xl' fontWeight='bold' lineHeight='1'>Wordl</Text>
            <Text textStyle='decorative' fontSize='md' mb='3'>A New York Times <a href='https://www.nytimes.com/games/wordle' target='_blank noopener noreferrer'>Wordle</a> clone</Text>
        </VStack>
    )
}

export default Header