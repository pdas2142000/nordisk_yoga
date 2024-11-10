/** React Imports */
import React, { useState } from "react"
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity
} from "react-native"

/** Libraries*/
import { WebView } from "react-native-webview"

/** Local Imports */
import { useThemeContext } from '../../utils/context/theme-context'
import { IconProps } from '../../utils/helpers/Iconprops'
import { ms } from '../../utils/helpers/Metrics'

/** Components */
import Spinner from '../../components/spinner'

/** Icons */
import BackIcon from '../../../assets/icons/back.svg'

/** Main Export */
const WebViewScreen = ({ navigation, route }) => {

    const { theme } = useThemeContext()
    const colors = theme.colors

    const [visible, setVisible] = useState(true)

    const WEBVIEW_REF = React.useRef()

    const hideSpinner = () => {
        setVisible(false)
    }

    const url = route.params.url

    return (
        <View style={[styles.container, {backgroundColor: colors.screen}]}>
            <SafeAreaView style={{backgroundColor: colors.screen, flex: 0}} />
            <View
                style={[
                    styles.ny_header,
                    {backgroundColor: colors.screen}
                ]}
            >
                <View style={styles.ny_header_wrap}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.ny_back_btn}
                    >
                        <BackIcon {...IconProps(18)} fill={colors.accent} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.container, {backgroundColor: colors.screen}]}>
                {visible && <View style={{paddingVertical: ms(50), backgroundColor: colors.screen}}><Spinner /></View>}
                <WebView
                    ref={WEBVIEW_REF}
                    onLoad={() => hideSpinner()}
                    source={{ uri: url }}
                    injectedJavaScript={INJECTEDJAVASCRIPT}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ny_header: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    ny_header_wrap: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical:ms(12),
        paddingHorizontal: ms(14),
    },
    ny_back_btn: {
        height: ms(30),
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1
    },
})

export default WebViewScreen

const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta') meta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0') meta.setAttribute('name', 'viewport') document.getElementsByTagName('head')[0].appendChild(meta)
var sheet = document.createElement('style')
sheet.innerHTML = "body{-webkit-user-select: none}"
document.head.appendChild(sheet) `