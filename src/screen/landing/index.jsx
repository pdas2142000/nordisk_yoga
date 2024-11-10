/** React Imports */
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'

/** Libraries */
import LinearGradient from 'react-native-linear-gradient'

/** Local Imports */
import { useThemeContext } from '../../utils/context/theme-context'
import { ms } from '../../utils/helpers/Metrics'
import { Fonts } from '../../utils/styles'
import { IconProps } from '../../utils/helpers/Iconprops'

/** Icons */
import FlowerIcon from '../../../assets/icons/flower.svg'
import BackgroundPattern from '../../../assets/svgs/sun_with_logo.svg'
import BackgroundPatternDark from '../../../assets/svgs/sun_with_logo_dark.svg'

/** Main Export */
const LandingScreen = ({ navigation }) => {

    const { currentTheme, theme, toggleTheme } = useThemeContext()
    const colors = theme.colors
    const BackgroundIcon = currentTheme == 'dark' ? BackgroundPatternDark : BackgroundPattern
    const BackgroundLinear = currentTheme == "dark" ? View : LinearGradient

    const [isDarkEnabled, setIsDarkEnabled] = useState(currentTheme === "light" ? false : true)


    const toggleSwitch = () => {
        setIsDarkEnabled(!isDarkEnabled)
        setAlignment(!alignment)
        toggleTheme(isDarkEnabled ? 'light' : 'dark')
    }

    useEffect(() => {
        setIsDarkEnabled(currentTheme === "light" ? false : true)
    }, [currentTheme])

    const [alignment, setAlignment] = useState(isDarkEnabled)

    const position = useRef(new Animated.Value(isDarkEnabled ? 1 : 0)).current

    useEffect(() => {
        position.setValue(isDarkEnabled ? 1 : 0)
        setAlignment(isDarkEnabled)
    }, [isDarkEnabled])

    const animateToggle = () => {
        let toValue = isDarkEnabled ? -(ms(78) - ms(30)) : ms(78) - ms(30)
        Animated.timing(position, {
            toValue: toValue,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            toggleSwitch()
        })
    }

    return (
        <View style={{ backgroundColor: colors.surface }}>
            <BackgroundLinear
                colors={['#f9e2c0', '#dae6f5', '#dad3d1']}
                locations={[0.1, 0.5, 1]}
                style={styles.ny_back}
            >
                <BackgroundIcon style={styles.ny_background} />
                <View style={styles.ny_content}>
                    <View style={styles.ny_action_wrap}>
                        <TouchableOpacity style={styles.ny_action_content}
                            onPress={() => {
                                navigation.navigate("BottomTabs", { screen: "UgePlanScreen" })
                            }}
                        >
                            <FlowerIcon {...IconProps(38)} fill={colors.accent} />
                            <Text style={[styles.ny_text, { color: colors.accent }]}>Ugeplan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ny_action_content}
                            onPress={() => {
                                navigation.navigate("BottomTabs", { screen: "YogaScreen" })
                            }}
                        >
                            <FlowerIcon {...IconProps(38)} fill={colors.accent} />
                            <Text style={[styles.ny_text, { color: colors.accent }]}>Yoga</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ny_toggle}>
                        <TouchableOpacity
                            style={[
                                styles.ny_switch_btn,
                                isDarkEnabled ? styles.alignEnd : styles.alignStart,
                                { backgroundColor: colors.switch }
                            ]}
                            onPress={animateToggle}
                        >
                            <Animated.View
                                activeOpacity={0.5}
                                style={[
                                    styles.ny_circle,
                                    { backgroundColor: isDarkEnabled ? '#000' : '#fff' },
                                    { transform: [{ translateX: position }] }
                                ]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </BackgroundLinear>
        </View>
    )
}

export default LandingScreen

const styles = StyleSheet.create({
    ny_back: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        position: 'relative'
    },
    ny_background: {
        position: "absolute",
        aspectRatio: 1,
        height: '180%',
        top: '-50%',
        bottom: '-30%',
    },
    ny_content: {
        justifyContent: "space-between",
        height: "25%"
    },
    ny_text: {
        fontSize: ms(20),
        fontFamily: Fonts.Font_400,
    },
    ny_action_wrap: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: ms(230)
    },
    ny_action_content: {
        alignItems: "center"
    },
    ny_text: {
        fontFamily: Fonts.Font_400,
        fontSize: ms(20)
    },
    ny_toggle: {
        alignItems: "center",
        marginTop: ms(20),
        paddingBottom: ms(40)
    },
    ny_switch_btn: {
        height: ms(35),
        width: ms(78),
        borderRadius: ms(50),
        paddingHorizontal: ms(3),
        flexDirection: "row",
        alignItems: "center"
    },
    ny_circle: {
        width: ms(25),
        aspectRatio: 1,
        borderRadius: ms(50),
    },
    alignStart: {
        justifyContent: 'flex-start',
    },
    alignEnd: {
        justifyContent: 'flex-end',
    },
})