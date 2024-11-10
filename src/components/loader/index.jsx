/** React Imports */
import { View, StyleSheet, Modal, TouchableOpacity, Text, SafeAreaView } from 'react-native'
import CircularProgress from 'react-native-circular-progress-indicator'

/** Local Imports */
import { Fonts } from '../../utils/styles'
import { ms } from '../../utils/helpers/Metrics'
import { IconProps } from '../../utils/helpers/Iconprops'
import { useThemeContext } from '../../utils/context/theme-context'

/** Icons */
import CrossIcon from '../../../assets/icons/cross-small.svg'

/** Main Export */
const Loader = ({ loading, progress, cancelDownload }) => {

    const { theme } = useThemeContext()
    const colors = theme.colors

    return (
        <Modal transparent={true} animationType="none">
            <SafeAreaView style={{ flexGrow: 1 }}>
                <View style={[styles.overlay, { backgroundColor: `${colors.accent}85` }]}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            cancelDownload();
                        }}
                    >
                        <CrossIcon {...IconProps(50)} fill={colors.commonLight} />
                    </TouchableOpacity>
                    <View style={[styles.loaderBox]}>
                        <CircularProgress
                            value={progress}
                            radius={50}
                            duration={100}
                            valueSuffix={'%'}
                            activeStrokeWidth={10}
                            inActiveStrokeWidth={10}
                            inActiveStrokeOpacity={0.5}
                            inActiveStrokeColor={colors.tabActive}
                            activeStrokeColor={colors.screen}
                            progressValueStyle={{ fontFamily: Fonts.Font_700, color: colors.screen }}
                        />
                        <Text style={[styles.ny_text, { color: colors.screen }]} >
                            {loading?.title}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    loaderBox: {
        width: ms(300),
        height: ms(240),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

    },
    closeButton: {
        position: 'absolute',
        top: ms(50),
        right: ms(20),
        zIndex: 2,
        width: ms(40),
        height: ms(40),
        borderRadius: ms(4),
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    ny_text: {
        fontSize: ms(15),
        lineHeight: ms(16),
        fontFamily: Fonts.Font_700,
        marginTop: ms(12)
    }
})

export default Loader