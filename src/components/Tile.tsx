import { Box, Text } from '@chakra-ui/react'
import { memo } from 'react'
import { Letter } from '../types';
import { keyframes } from '@emotion/react'

interface TileProps {
  children?: Letter;
  color?: string;
  isRevealing?: boolean;
}

// Define the flip animation
const flipAnimation = keyframes`
  0% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
`;

// Define the fade-in animation
const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Tile = memo(({ children, color, isRevealing = false }: TileProps) => {
  const letter = children?.charAt(0)?.toUpperCase();

  return (
    <Box
      h='3.2rem'
      w='3.2rem'
      borderWidth={color ? 0 : '2px'}
      borderColor='gray'
      backgroundColor={color}
      data-testid="tile"
      data-color={color || ""}
      display="flex"
      alignItems="center"
      justifyContent="center"
      css={{
        "@media (600px < width < 960px)": {
          width: "3.8rem",
          height: "3.8rem",
        },
        animation: isRevealing
          ? `${flipAnimation} 0.8s ease 0s forwards, ${fadeInAnimation} 1s ease-out 0s forwards`
          : 'none',
      }}
      opacity={isRevealing ? 0 : 1}
    >
      {letter &&
        <Text fontSize='3xl' fontWeight='800'>
          {letter}
        </Text>
      }
    </Box>
  )
})

export default Tile
