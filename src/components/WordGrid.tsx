import React from 'react'
import { Box, SimpleGrid } from '@chakra-ui/react'

let grid = [
    [null, null, null, null, null,],
    [null, null, null, null, null,],
    [null, null, null, null, null,],
    [null, null, null, null, null,],
    [null, null, null, null, null,],
    [null, null, null, null, null,],
]

const WordGrid = () => {
    return (
        <SimpleGrid
            columns={5}
            gap='2'
        >
            {grid.map(row => {
                return row.map(tile => {
                    return <Box
                        h='3.5rem'
                        w='3.5rem'
                        borderWidth='2px'
                        borderColor='#444'>
                    </Box>
                })
            })}

        </SimpleGrid>
    )
}

export default WordGrid