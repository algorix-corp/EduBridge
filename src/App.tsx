import {MantineProvider, Text} from '@mantine/core'
import './App.css'

function App() {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Text>Welcome to Mantine!</Text>
        </MantineProvider>
    )
}

export default App
