/** React imports */
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'

/** Library */
import Video from 'react-native-video'

/** Local imports */
import { IconProps } from '../../utils/helpers/Iconprops'
import { ms } from '../../utils/helpers/Metrics'

/** Icons */
import BackIcon from "../../../assets/icons/back.svg"

/** Main Export */
const VideoPlayerScreen = ({ route, navigation }) => {

    const { video_url } = route.params

    return (
        <View style={styles.ny_container}>
            <SafeAreaView />
            <View style={styles.ny_header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <BackIcon {...IconProps(18)} fill={"white"} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <Video
                    source={{
                        uri: video_url
                    }}
                    style={{ width: "100%", height: "100%"}}
                    resizeMode="contain"
                    controls={true}
                    autoPlay={true}
                />
            </View>
        </View>
    )
}

export default VideoPlayerScreen

const styles = StyleSheet.create({
    ny_container: {
        flex: 1,
        backgroundColor: "black",
    },
    ny_header: {
        paddingHorizontal: ms(14),
        height: ms(50),
        justifyContent: "center"
    }
})