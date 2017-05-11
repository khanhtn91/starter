// obtained from react native tutorials
import { PixelRatio } from 'react-native'
import Dimensions from 'Dimensions'

// get windows size
const UI = {
  ratio: PixelRatio.get(),
  pixel: 1 / PixelRatio.get(),
  size: Dimensions.get('window')
}

export default UI
