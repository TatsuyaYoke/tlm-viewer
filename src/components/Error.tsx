import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Alert, AlertIcon } from '@chakra-ui/react'

type Props = {
  isError: boolean
  error?: string
}
export const Error = (props: Props) => {
  const { isError, error } = props

  return isError ? (
    <Accordion allowMultiple width="100%">
      <AccordionItem>
        <AccordionButton p={0}>
          <Alert status="error" variant="solid">
            <AlertIcon />
            Error
          </Alert>
        </AccordionButton>
        <AccordionPanel pb={4} textAlign="left">
          {error}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ) : (
    <Alert status="success" variant="solid">
      <AlertIcon />
      Success!
    </Alert>
  )
}
