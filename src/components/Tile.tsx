import { Box, Text } from '@chakra-ui/react'

interface TileProps {
    children: string | null;
    color?: string;
}

const Tile = ({ children, color }: TileProps) => {

    const letter = children?.charAt(0)?.toUpperCase();

    return (
        <Box
            h='3.5rem'
            w='3.5rem'
            borderWidth={letter ? 0 : '2px'}
            borderColor='gray'
            backgroundColor={color}
        >
            {letter &&
                <Text fontSize='3xl' fontWeight='800'>
                    {letter}
                </Text>
            }
        </Box >
    )
}

export default Tile