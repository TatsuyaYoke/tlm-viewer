import { useState } from 'react'
import { Flex, Spacer, Text, Box } from '@chakra-ui/react'

const AppBar = () => {
  const [isMaximize, setMaximize] = useState(true)

  const handleToggle = () => {
    if (isMaximize) {
      setMaximize(false)
    } else {
      setMaximize(true)
    }
    window.Main.Maximize()
  }

  return (
    <Flex align="center" h="30px" className="draggable">
      <Text fontSize="xs" pl={3}>
        TLM VIEWER
      </Text>
      <Spacer />
      <Box
        as="button"
        onClick={window.Main.Minimize}
        borderRadius={0}
        h="inherit"
        px={5}
        _hover={{ bgColor: 'gray.300' }}
        className="undraggable"
      >
        &#8211;
      </Box>
      <Box
        as="button"
        onClick={handleToggle}
        borderRadius={0}
        h="inherit"
        px={5}
        _hover={{ bgColor: 'gray.300' }}
        className="undraggable"
      >
        {isMaximize ? '\u2752' : '⃞'}
      </Box>
      <Box
        as="button"
        onClick={window.Main.Close}
        borderRadius={0}
        h="inherit"
        px={5}
        _hover={{ bgColor: 'red.500', color: 'white' }}
        className="undraggable"
      >
        &#10005;
      </Box>
    </Flex>
  )
}

export default AppBar
