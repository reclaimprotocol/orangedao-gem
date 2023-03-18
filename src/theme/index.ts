// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"
import colors from "./colors"
import button from "./components/button"
import text from "./components/text"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors,
  components: {
    ...button,
    ...text
  },
  styles: {
    global: {
      body: {
        bg: "#FBFAFA",
      }
    }
  }
})

export default theme