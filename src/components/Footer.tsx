import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'
import { memo } from 'react'

const Footer = memo(() => {
    return (
        <Box as="footer"
            py={4}
            textAlign="center"
            css={{
                "@media (600px < width < 960px)": {
                    position: "absolute",
                    bottom: "3em",
                }
            }}>
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
                    <FaGithub size={24} />
                    <Text fontSize='sm'>View on GitHub</Text>
                </Link>
            </Flex>
        </Box>
    )
})

export default Footer
