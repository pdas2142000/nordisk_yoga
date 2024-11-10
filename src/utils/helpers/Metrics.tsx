import { Dimensions } from 'react-native'
import { Platform } from 'react-native'
import { getDeviceType } from 'react-native-device-info'

let deviceType = getDeviceType()
const { width, height } = Dimensions.get('window')
const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const hs = (size: number) => (((width / guidelineBaseWidth) * size * (Platform.OS == 'ios' ? 0.85 : 0)) * (deviceType === 'Tablet' ? 0.5 : 1))
const vs = (size: number) => (((height / guidelineBaseHeight) * size * (Platform.OS == 'ios' ? 0.85 : 0)) * (deviceType === 'Tablet' ? 0.5 : 1))
const ms = (size: number, factor = 0.65) => (size + (hs(size) - size) * factor * (Platform.OS == 'ios' ? 0.85 : 0))

export { hs, vs, ms, width, deviceType}