import { Box, Text } from '@chakra-ui/react'

interface TileProps {
    children: string | null;
}

const Tile = ({ children }: TileProps) => {
    const letter = children?.charAt(0)?.toUpperCase() || '';

    return (
        <Box
            h='3.5rem'
            w='3.5rem'
            borderWidth='2px'
            borderColor='#444'
        >
            <Text fontSize='4xl' textAlign='center'>{letter}</Text>
        </Box>
    )
}

export default Tile