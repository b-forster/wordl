import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
    return (
        <Box as="footer" py={4} textAlign="center">
            <Flex justify="center" align="center">
                <Link
                    href="https://github.com/b-forster/wordl"
                    target="_blank"
                    rel="noopener noreferrer"
                    display="flex"
                    alignItems="center"
                    color="gray.500"
                    _hover={{ color: "gray.700" }}
                >
                    <FaGithub size={24} style={{ marginRight: '8px' }} />
                    <Text fontSize='sm'>View on GitHub</Text>
                </Link>
            </Flex>
        </Box>
    )
}

export default Footer
