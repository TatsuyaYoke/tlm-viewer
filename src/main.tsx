import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'
import App from './App'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}
const theme = extendTheme({ config })

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
