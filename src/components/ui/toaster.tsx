"use client"

import {
  Toaster as ChakraToaster,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: 'top',
  offsets: {
    top: '2em',
    left: '50%',
    right: '0',
    bottom: '0',
  },
  duration: 1200,
  max: 1,
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
      {(toast) => (
        <Toast.Root
          color='black'
          fontSize='xs'
          fontWeight='bold'
          textWrap='nowrap'
          width='fit-content'
          padding='0.8em'
          backgroundColor='white'
        >
          {toast.type === "loading" ? (
            <Spinner size="sm" color="blue.solid" />
          ) : (
            <Toast.Indicator />
          )}
          <Stack gap="1" flex="1" maxWidth="100%">
            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
            {toast.description && (
              <Toast.Description>{toast.description}</Toast.Description>
            )}
          </Stack>
          {toast.action && (
            <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
          )}
          {toast.meta?.closable && <Toast.CloseTrigger />}
        </Toast.Root>
      )}
    </ChakraToaster>
  )
}
