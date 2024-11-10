/** React Imports */
import React, { useEffect, useState, useRef } from 'react'
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

/** Libraries */
import Slider from '@react-native-community/slider'
import SoundPlayer from 'react-native-sound-player'

/** Icons */
import PlayIcon from "../../../assets/icons/play.svg"
import PauseIcon from '../../../assets/icons/pause.svg'
import ForwardIcon from '../../../assets/icons/step-forward.svg'
import BackwardIcon from '../../../assets/icons/step-backward.svg'
import BackIcon from '../../../assets/icons/back.svg'
import BarIcon from '../../../assets/svgs/bar.svg'
import ReplayIcon from '../../../assets/icons/replay.svg'

/** Local imports */
import { useThemeContext } from '../../utils/context/theme-context'
import { ms } from '../../utils/helpers/Metrics'
import { Fonts } from '../../utils/styles'
import { IconProps } from '../../utils/helpers/Iconprops'

/** Main Export */
const MusicPlayerScreen = ({ navigation, route }) => {

    const { theme } = useThemeContext()
    const colors = theme.colors
    const { SongUrl, Title } = route.params;

    const getInfoPending = useRef(false)

    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [isSongEnded, setIsSongEnded] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    /**
     * Play function
     */
    const playURL = () => {
        try {
            SoundPlayer.playUrl(SongUrl)
            setIsPlaying(true)
            setIsPaused(false)
            setIsSongEnded(false)
            SoundPlayer.getInfo().then(info => {
                setDuration(info.duration)
            })
        } catch (e) {
            console.log('Cannot play the sound from URL', e)
        }
    }

    /**
     * Pause function
     */
    const pauseURL = () => {
        try {
            SoundPlayer.pause()
            setIsPlaying(false)
            setIsPaused(true)
        } catch (e) {
            console.log('Cannot pause the sound', e)
        }
    }

    /**
     * Resume function
     */
    const resumeURL = () => {
        try {
            SoundPlayer.resume()
            setIsPlaying(true)
            setIsPaused(false)
        } catch (e) {
            console.log('Cannot resume the sound', e)
        }
    }

    /**
     * Stop function
     */
    const stopURL = () => {
        try {
            SoundPlayer.stop()
            setIsPlaying(false)
            setIsPaused(false)
            setCurrentTime(0)
        } catch (e) {
            console.log('Cannot stop the sound from URL', e)
        }
    }

    /**
     * Getting song duration and updating current time
     */
    useEffect(() => {
        setTimeout(() => {
            playURL()
        }, 500)
        const interval = setInterval(() => {
            if (!getInfoPending.current) {
                getInfoPending.current = true
                SoundPlayer.getInfo().then(info => {
                    setCurrentTime(info.currentTime)
                    if (info.currentTime != 0 && info.currentTime >= (info.duration - 1)) {
                        setIsSongEnded(true);
                        setIsPlaying(false);
                    }
                    getInfoPending.current = false
                }).catch(() => {
                    getInfoPending.current = false
                })
            }
        }, 1000)
        return () => {
            clearInterval(interval)
            stopURL()
        }
    }, [])

    /**
     * Close button
     */
    const handleClose = () => {
        stopURL()
        navigation.goBack()
    }

    /**
     * Progress bar function
     * @param {number} value 
     */
    const handleSliderChange = (value) => {
        SoundPlayer.seek(value)
        setCurrentTime(value)
        if (value < duration) {
            setIsSongEnded(false)
        }
    }

    /**
     * Song duration format
     * @param  seconds 
     * @returns {string}
     */
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    /**
     * 10 second forward
     */
    const Forward = () => {
        SoundPlayer.getInfo().then(info => {
            let newTime = info.currentTime + 10
            if (newTime > info.duration) newTime = info.duration
            SoundPlayer.seek(newTime)
            setCurrentTime(newTime)
        })
    }

    /**
     * 10 second backward
     */
    const Backward = () => {
        SoundPlayer.getInfo().then(info => {
            let newTime = info.currentTime - 10
            if (newTime < 0) newTime = 0
            SoundPlayer.seek(newTime)
            setCurrentTime(newTime)
        })
    }

    const replayAudio = () => {
        SoundPlayer.seek(0)
        setCurrentTime(0)
        playURL()
    }

    return (
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
                            onPress={() => handleClose()}
                            style={styles.ny_back_btn}
                        >
                            <BackIcon {...IconProps(18)} fill={colors.accent} />
                        </TouchableOpacity>
                        <Text style={[styles.ny_header_title, { color: colors.accent }]}>
                            {Title || ''}
                        </Text>
                    </View>
                </View>
                <View style={styles.ny_player_container}>
                    <View style={styles.ny_thumb_box}>
                        <View style={styles.ny_thumb_img_box}>
                            <Image source={require("../../../assets/images/sound.png")} style={styles.ny_img} />
                            <View style={styles.ny_thumb_overlay}>
                                <BarIcon {...IconProps(ms(30))} fill={"white"} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.ny_controls_container}>
                        <View style={styles.ny_progress_box}>
                            <Slider
                                style={styles.ny_progress_bar}
                                minimumValue={0}
                                maximumValue={duration}
                                value={currentTime}
                                onValueChange={handleSliderChange}
                                minimumTrackTintColor={colors.accent}
                                maximumTrackTintColor={colors.tabInactive}
                                thumbTintColor={colors.commonLight}
                            />
                            <View style={styles.ny_duation}>
                                <Text style={[styles.ny_duration_text, { color: colors.accent }]}>{formatTime(currentTime)}</Text>
                                <Text style={[styles.ny_duration_text, { color: colors.accent }]}>{formatTime(duration)}</Text>
                            </View>
                        </View>
                        <View style={styles.ny_buttons}>
                            <TouchableOpacity onPress={Backward}>
                                <BackwardIcon {...IconProps(ms(20))} fill={colors.accent} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={isSongEnded ? replayAudio : isPlaying ? pauseURL : isPaused ? resumeURL : playURL}>
                                {
                                    isSongEnded ?
                                        <ReplayIcon {...IconProps(ms(25))} fill={colors.accent} /> :
                                        isPlaying ? <PauseIcon {...IconProps(ms(25))} fill={colors.accent} /> :
                                            <PlayIcon {...IconProps(ms(25))} fill={colors.accent} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={Forward}>
                                <ForwardIcon {...IconProps(ms(20))} fill={colors.accent} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default MusicPlayerScreen

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
        paddingVertical: ms(12),
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
    ny_player_container: {
        flexGrow: 1,
        osition: "relative",
        justifyContent: "space-around",
        flex: 1,
        marginTop: ms(70)
    },
    ny_controls_container: {
        height: ms(180),
        justifyContent: "space-around"
    },
    ny_thumb_box: {
        paddingHorizontal: ms(9)
    },
    ny_img: {
        width: "100%",
        height: "100%"
    },
    ny_progress_box: {
        paddingHorizontal: ms(10)
    },
    ny_progress_bar: {
        width: "100%",
        height: 20
    },
    ny_buttons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    ny_duration_text: {
        fontFamily: Fonts.Font_400,
    },
    ny_duation: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: ms(5)
    },
    close_box: {
        alignItems: "flex-end",
        position: "relative",
        top: ms(-10),
    },
    ny_thumb_img_box: {
        width: '100%',
        aspectRatio: 1/0.6,
        borderRadius: ms(5),
        overflow: "hidden",
        marginTop: ms(35)
    },
    ny_thumb_overlay: {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    }
})