/** React Imports */
import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'

/** Libraries */
import { DateTime } from 'luxon'
import LinearGradient from 'react-native-linear-gradient'
import { decode } from 'html-entities'

/** Local Imports */
import { useThemeContext } from '../../utils/context/theme-context'
import { Fonts } from '../../utils/styles'
import { IconProps } from '../../utils/helpers/Iconprops'
import { ms } from '../../utils/helpers/Metrics'
import { makeRequest } from '../../utils/make-request'

/** Components */
import Spinner from '../../components/spinner'

/** Icons */
import BackIcon from '../../../assets/icons/back.svg'
import FlowerIcon from '../../../assets/icons/flower.svg'

/** Main Export */
const UgePlanScreen = ({ navigation }) => {

    const { currentTheme, theme } = useThemeContext()
    const colors = theme.colors
    const scrollOffsetY = useRef(0)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [PageUrl, SetPageUrl] = useState("ugeplan-app-2024.php")
    const [LastUrl, SetLastUrl] = useState(null)
    const [NextUrl, SetNextUrl] = useState(null)
    const [showSmokyEffect, setShowSmokyEffect] = useState(false)


    const extractPathAndQuery = (url) => {
        if (!url) return ''
        const decodedUrl = decodeURIComponent(url)
        const firstSlashIndex = decodedUrl.indexOf('/', decodedUrl.indexOf('://') + 3)
        return firstSlashIndex !== -1 ? decodedUrl.substring(firstSlashIndex + 1) : decodedUrl
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true) // Set loading state when fetching data
                const response = await makeRequest('GET', PageUrl, null, null, null, false)
                if (response.success) {
                    SetLastUrl({ url: decodeURIComponent(response?.previous), heading: response?.previous_heading })
                    SetNextUrl({ url: decodeURIComponent(response?.next), heading: response?.next_heading })
                    setData(response.result)
                } else {
                    console.error('Invalid data format received from API')
                }
            } catch (error) {
                console.error('Error fetching or transforming data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [PageUrl])

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
                            onPress={() => navigation.popToTop()}
                            style={styles.ny_back_btn}
                        >
                            <BackIcon {...IconProps(18)} fill={colors.accent} />
                        </TouchableOpacity>
                        <Text style={[styles.ny_header_title, { color: colors.accent }]}>
                            Ugeplan
                        </Text>
                        {
                            !loading ?
                                <View style={styles.ny_controls}>
                                    <TouchableOpacity style={styles.ny_control_btn}
                                        onPress={() => {
                                            const extractedPathAndQuery = extractPathAndQuery(LastUrl?.url)
                                            SetPageUrl(extractedPathAndQuery)
                                        }}
                                    >
                                        <Text style={[styles.ny_control_btn_text, { color: colors.accent }]}>
                                            {`${LastUrl?.url ? "<" : ""} ${LastUrl?.heading}`}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.ny_control_btn}
                                        onPress={() => {
                                            const extractedPathAndQuery = extractPathAndQuery(NextUrl?.url)
                                            SetPageUrl(extractedPathAndQuery)
                                        }}
                                    >
                                        <Text style={[styles.ny_control_btn_text, { color: colors.accent }]}>
                                            {`${NextUrl?.heading} ${NextUrl?.url ? ">" : ""}`}
                                        </Text>
                                    </TouchableOpacity>
                                </View> : null
                        }
                    </View>
                </View>
                {loading && <View style={{ paddingVertical: ms(50) }}><Spinner /></View>}
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
                        {
                            !loading && data && Object.keys(data).map((weekNumber, i) => (
                                <View style={styles.ny_body} key={`p${i}`}>
                                    <View style={styles.ny_titlearea}>
                                        <FlowerIcon {...IconProps(ms(26))} fill={colors.text_color} />
                                        <Text style={[styles.ny_section_title, { color: colors.text_color }]}>
                                            {data[weekNumber].heading}
                                        </Text>
                                    </View>
                                    {
                                        data[weekNumber].data.map((day, i) => (
                                            <View key={`d${i}`} style={styles.ny_list}>
                                                <Text style={[styles.ny_list_title, { color: colors.text_color }]}>
                                                    {day.weekday}
                                                </Text>
                                                {
                                                    day.data.map((item, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={styles.ny_list_item}
                                                            onPress={() => navigation.navigate("WebViewScreen", { url: item.link })}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.ny_text,
                                                                    { color: colors.text_color, paddingRight: ms(12) }
                                                                ]}
                                                            >kl. {item.time}</Text>
                                                            <Text
                                                                style={[
                                                                    styles.ny_text,
                                                                    { color: colors.text_color, flex: 1 }
                                                                ]}
                                                            >
                                                                {decode(item.text)} <Text style={{ textDecorationLine: 'underline' }}>[mere info]</Text>
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))
                                                }
                                            </View>
                                        ))
                                    }
                                </View>
                            ))}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default UgePlanScreen

const styles = StyleSheet.create({
    ny_header: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%'
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
    ny_controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: "center",
        paddingTop: ms(6)
    },
    ny_control_btn: {
        flexDirection: 'row',
        alignItems: "center",
        fontFamily: Fonts.Font_400,
        paddingVertical: ms(6)
    },
    ny_control_btn_text: {
        fontFamily: Fonts.Font_400,
        fontSize: ms(16)
    },
    ny_body: {
        paddingTop: ms(12),
        paddingHorizontal: ms(14)
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
        marginBottom: ms(32),
        paddingLeft: ms(36)
    },
    ny_list_title: {
        fontSize: ms(17),
        fontFamily: Fonts.Font_700,
        marginBottom: ms(8),
        textTransform: "capitalize"
    },
    ny_list_item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: ms(10),
    },
    ny_text: {
        fontSize: ms(17),
        fontFamily: Fonts.Font_400,
    }
})