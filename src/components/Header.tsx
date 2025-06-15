import { Text, VStack } from '@chakra-ui/react'
import { memo } from 'react'

const Header = memo(() => {
    return (
        <VStack gap={0}
            css={{
                "@media (600px < width < 960px)": {
                    position: "absolute",
                    top: "10vh",
                }
            }}
        >
            <Text textStyle='decorative' fontSize='6xl' fontWeight='bold' lineHeight='1'
                css={{
                    "@media (max-width: 600px)": {
                        fontSize: "5xl"
                    }
                }} >Wordl</Text>
            <Text textStyle='decorative' fontSize='md' mb='3'>A New York Times <a href='https://www.nytimes.com/games/wordle' target='_blank noopener noreferrer'>Wordle</a> clone</Text>
        </VStack>
    )
})

export default Header
