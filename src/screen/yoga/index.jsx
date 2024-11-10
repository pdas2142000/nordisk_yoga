/** React Imports */
import { useState, useRef, useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native'

/** Libraries */
import RNFetchBlob from 'react-native-blob-util'

/** Local Imports */
import { useThemeContext } from '../../utils/context/theme-context'
import { Fonts } from '../../utils/styles'
import { IconProps } from '../../utils/helpers/Iconprops'
import { ms, } from '../../utils/helpers/Metrics'
import LinearGradient from 'react-native-linear-gradient'

/** Components */
import Loader from '../../components/loader'

/** Icons */
import BackIcon from '../../../assets/icons/back.svg'
import FlowerIcon from '../../../assets/icons/flower.svg'
import LoaderIcon from '../../../assets/icons/loader.svg'
import BarIcon from "../../../assets/svgs/bar.svg"
import IconPlay from "../../../assets/svgs/Play.svg"

import { YogaItem } from '../../utils/constant'
import IosPlayer from '../../components/ios-player'

/** Main Export */
const YogaScreen = ({ navigation }) => {

    const { currentTheme, theme } = useThemeContext()
    const colors = theme.colors
    const scrollOffsetY = useRef(0)
    const [showSmokyEffect, setShowSmokyEffect] = useState(false)
    const [loading, SetLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [Active, SetActive] = useState(0)

    const [IosUrl, SetIosUrl] = useState(null)
    const [Request, SetRequest] = useState(null)


    const cancelDownload = () => {
        try {
            SetLoading(false)
            Request?.cancel && Request?.cancel((err, taskId) => {
                if (err) {
                    console.error('Download canceled:', err)
                } else {
                    console.log('Download canceled:', taskId)
                }
            })
        }
        catch (err) {
            console.error(err)
        }
    }

    const IOSDownloadFile = async () => {
        if (!Active?.url) return

        try {

            const request = createIOSDownloadRequest(Active.url)

            request.progress((received, total) => {
                const progress = (received / total) * 100
                setProgress(progress)
            }).then(handleIOSDownloadSuccess)
                .catch(handleDownloadError)

            SetRequest(request)

        } catch (error) {
            console.error('Error downloading file:', error)
        }
    }

    const createIOSDownloadRequest = (url) => {
        return RNFetchBlob.config({
            fileCache: true,
            path: `${RNFetchBlob.fs.dirs.CacheDir}/${Active.file}`,
        }).fetch('GET', url)
    }

    const handleIOSDownloadSuccess = async (res) => {
        try {
            let destinationPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${Active.file}`
            downloadFilePath = res.path()
            if (!await RNFetchBlob.fs.mv(downloadFilePath, destinationPath)) console.error('Error moving file to destination')
            const isMp3File = destinationPath.endsWith(".mp3")
            const title = Active.title
            SetLoading(false)
            SetActive(null)
            setProgress(0)
            if (isMp3File) {
                navigation.navigate("MusicPlayerScreen", { SongUrl: `file:///${destinationPath}`, Title: title })
            } else {
                handleNonMp3File(destinationPath)
            }
        } catch (error) {
            handleDownloadError(error)
        }
    }

    const handleIOSPress = () => {
        if (Active?.url) {
            const FilePath = `${RNFetchBlob.fs.dirs.DocumentDir}/${Active.file}`
            RNFetchBlob.fs.exists(FilePath).then((exists) => {
                if (exists) {
                    SetActive(null)
                    if (Active.type === "audio") {
                        navigation.navigate("MusicPlayerScreen", { SongUrl: `file:///${FilePath}`, Title: Active.title })
                    } else if (Platform.OS === "ios") {
                        SetIosUrl({
                            url: `file://${FilePath}`,
                            show: true
                        })
                    } else if (Platform.OS === "android") {
                        navigation.navigate("VideoPlayerScreen", { video_url: `file:///${FilePath}` })
                    }
                } else {
                    SetLoading(Active)
                    IOSDownloadFile()
                }
            })
        }
    }

    /** Android Related functions */
    const handleAndroidPress = () => {
        if (Active?.url) {
            const FilePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${Active.file}`
            RNFetchBlob.fs.exists(FilePath).then((exists) => {
                if (exists) {
                    SetActive(null)
                    if (Active.type === "audio") {
                        navigation.navigate("MusicPlayerScreen", { SongUrl: `file:///${FilePath}`, Title: Active.title })
                    } else if (Platform.OS === "ios") {
                        SetIosUrl({
                            url: `file:///${FilePath}`,
                            show: true
                        })
                    } else if (Platform.OS === "android") {
                        navigation.navigate("VideoPlayerScreen", { video_url: `file:///${FilePath}` })
                    }
                } else {
                    SetLoading(Active)
                    AndroidDownloadFile()
                }
            })
        }
    }

    const AndroidDownloadFile = async () => {
        if (!Active?.url) return
        try {
            const request = createAndroidDownloadRequest(Active.url)
            request.progress((received, total) => {
                const progress = (received / total) * 100
                setProgress(progress)
            }).then(handleAndroidDownloadSuccess)
                .catch(handleDownloadError)
            SetRequest(request)

        } catch (error) {
            console.error('Error downloading file:', error)
        }
    }

    const createAndroidDownloadRequest = (url) => {
        return RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
                // useDownloadManager: true,
                notification: true,
                title: Active.file.split(".")[0],
                description: 'Downloading file',
            },
            path: `${RNFetchBlob.fs.dirs.DownloadDir}/${Active.file}`,
        }).fetch('GET', url)
    }

    const handleAndroidDownloadSuccess = async (res) => {
        try {
            let destinationPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${Active.file}`
            downloadFilePath = res.path()
            const isMp3File = destinationPath.endsWith(".mp3")
            const title = Active.title
            SetLoading(false)
            SetActive(null)
            setProgress(0)
            if (isMp3File) {
                navigation.navigate("MusicPlayerScreen", { SongUrl: `file:///${destinationPath}`, Title: title })
            } else {
                handleNonMp3File(destinationPath)
            }
        } catch (error) {
            handleDownloadError(error)
        }
    }

    const handleNonMp3File = (filePath) => {
        if (Platform.OS === "ios") {
            SetIosUrl({
                url: `file:///${filePath}`,
                show: true,
            })
        } else if (Platform.OS === "android") {
            navigation.navigate("VideoPlayerScreen", { video_url: `file:///${filePath}` })
        }
    }

    const handleDownloadError = (error) => {
        let file = Active?.file
        RNFetchBlob.fs.unlink(`${RNFetchBlob.fs.dirs.DownloadDir}/${file}`).catch((err) => { console.log('Error deleting file:', err) })
        setProgress(0)
        SetLoading(false)
        SetActive(null)
        console.log('Error downloading file:', error)
    }

    useEffect(() => {
        if (Active) {
            Platform.OS === "ios" ? handleIOSPress() : handleAndroidPress()
        }
    }, [Active])

    return (
        <>
            <View style={{ backgroundColor: colors.screen, flex: 1 }}>
                <SafeAreaView style={{ flexGrow: 1 }}>
                    <View
                        style={[
                            styles.ny_header,

                            { backgroundColor: colors.screen }
                        ]}
                    >
                        <Image
                            source={require('../../../assets/images/lotus_grafik.png')}
                            style={styles.ny_image}
                        />
                        <View style={styles.ny_header_wrap}>
                            <TouchableOpacity
                                onPress={() => navigation.popToTop()}
                                style={styles.ny_back_btn}
                            >
                                <BackIcon {...IconProps(18)} fill={colors.accent} />
                            </TouchableOpacity>
                            <Text style={[styles.ny_header_title, { color: colors.accent }]}>
                                Yoga
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexGrow: 1, position: "relative" }}>
                        {
                            showSmokyEffect && (
                                currentTheme === "dark" ?
                                    <LinearGradient
                                        colors={['#140e08cc', '#140e0880', '#140e0824']}
                                        locations={[0, 0.5, 1]}
                                        style={styles.ny_shadow}
                                    /> :
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)']}
                                        locations={[0, 0.5, 1]}
                                        style={styles.ny_shadow}
                                    />
                            )
                        }
                        <ScrollView
                            style={{ flex: 1 }}
                            onScroll={(event) => {
                                const offsetY = event.nativeEvent.contentOffset.y
                                requestAnimationFrame(() => {
                                    if (offsetY > 0 && !showSmokyEffect) {
                                        setShowSmokyEffect(true)
                                    } else if (offsetY <= 0 && showSmokyEffect) {
                                        setShowSmokyEffect(false)
                                    }
                                    scrollOffsetY.current = offsetY
                                })
                            }}
                            scrollEventThrottle={16}
                        >

                            <View style={styles.ny_body_container}>
                                {
                                    YogaItem.map((item, index) => {
                                        return (
                                            <View style={styles.ny_body} key={index}>
                                                <View style={styles.ny_titlearea}>
                                                    <FlowerIcon {...IconProps(ms(26))} fill={colors.text_color} />
                                                    <Text style={[styles.ny_section_title, { color: colors.text_color }]}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                                {
                                                    item.YogaData.map((subItem, subIndex) => {
                                                        return (
                                                            <TouchableOpacity
                                                                source={subItem?.url}
                                                                key={subIndex}
                                                                style={styles.ny_list}
                                                                onPress={() => SetActive(subItem)}
                                                            >
                                                                <View style={styles.ny_media}>
                                                                    {
                                                                        typeof subItem.url === 'audio' && subItem.url.endsWith('.mp3') ?
                                                                            <View style={styles.ny_media_cover}>
                                                                                <LoaderIcon width={ms(20)} height={ms(20)} />
                                                                            </View> : <Image source={subItem.image} style={styles.ny_media_cover} />
                                                                    }
                                                                    <View style={styles.ny_overlay}>
                                                                        {
                                                                            subItem.type === "audio" ?
                                                                                <BarIcon {...IconProps(ms(20))} fill={"white"} />
                                                                                :
                                                                                <IconPlay {...IconProps(ms(21))} fill={"white"} />
                                                                        }
                                                                    </View>
                                                                </View>
                                                                <View style={styles.ny_content}>
                                                                    <View>
                                                                        <Text style={[styles.ny_title, { color: colors.text_color }]}>{subItem.title}</Text>
                                                                        <Text style={[styles.ny_text, { color: colors.text_color }]}>{subItem.type==="audio"?"Lyd med" : "Video med"} {subItem.name}</Text>
                                                                    </View>
                                                                    <View style={styles.ny_time}>
                                                                        <Text style={[styles.ny_time_text, { color: colors.commonLight }]}>{subItem.length}</Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
                {
                    loading ?
                    <Loader
                        {...{
                            loading,
                            progress,
                            cancelDownload
                        }}
                    /> : null
                }
            </View>
            <IosPlayer IosUrl={IosUrl} SetIosUrl={SetIosUrl} />
        </>
    )
}
export default YogaScreen

const styles = StyleSheet.create({
    ny_header: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    ny_image: {
        width: ms(280),
        height: ms(280),
        position: 'absolute',
        left: 0,
        top: ms(-12),
        resizeMode: 'stretch'
    },
    ny_header_wrap: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: ms(12),
        paddingHorizontal: ms(14),
    },
    ny_back_btn: {
        height: ms(30),
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ny_shadow: {
        width: "100%",
        height: ms(30),
        position: "absolute",
        top: ms(0),
        zIndex: 1
    },
    ny_header_title: {
        fontFamily: Fonts.Font_700,
        fontSize: ms(35),
        paddingLeft: ms(8),
        textTransform: 'capitalize',
    },
    ny_body: {
        padding: ms(14),
        paddingTop: ms(12),
    },
    ny_body: {
        padding: ms(14),
    },
    ny_titlearea: {
        flexDirection: 'row',
        alignItems: "center",
        marginBottom: ms(15),
    },
    ny_section_title: {
        fontSize: ms(27),
        fontFamily: Fonts.Font_700,
        paddingLeft: ms(10)
    },
    ny_list: {
        marginBottom: ms(22),
        paddingLeft: ms(36),
        flexDirection: "row"
    },
    ny_media: {
        width: ms(110),
        height: ms(62),
        marginRight: ms(22)
    },
    ny_overlay: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.2)",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    ny_media_cover: {
        width: "100%",
        height: "100%",
        backgroundColor: "#D1D1C3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    ny_content: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        top: ms(-0.5),
    },
    ny_title: {
        fontSize: ms(17),
        lineHeight: ms(17),
        fontFamily: Fonts.Font_700,
        paddingBottom: ms(2)
    },
    ny_text: {
        fontSize: ms(15),
        lineHeight: ms(16),
        fontFamily: Fonts.Font_400
    },
    ny_time: {
        backgroundColor: "#888888",
        paddingTop: ms(3),
        paddingBottom: ms(1),
        paddingHorizontal: ms(5),
        borderRadius: ms(2)
    },
    ny_time_text: {
        fontSize: ms(12),
        lineHeight: ms(12),
        fontFamily: Fonts.Font_700
    }
})