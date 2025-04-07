import {
    createSystem,
    defaultConfig,
    defineConfig,
    defineTextStyles,
} from "@chakra-ui/react"

export const textStyles = defineTextStyles({
    body: {
        description: "Clean sans-serif font used in body",
        value: {
            fontFamily: "Roboto, sans-serif",
        },
    },
    decorative: {
        description: "Blocky serif font used in headings",
        value: {
            fontFamily: "Hanuman, serif",
        },
    },
})

const config = defineConfig({
    theme: {
        textStyles,
    },
})

export default createSystem(defaultConfig, config)