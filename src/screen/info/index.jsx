/** React Imports */
import { useState, useRef } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Linking } from 'react-native'

/** Libraries */
import LinearGradient from 'react-native-linear-gradient'

/** Local Imports */
import { useThemeContext } from '../../utils/context/theme-context'
import { Fonts } from '../../utils/styles'
import { IconProps } from '../../utils/helpers/Iconprops'
import { ms } from '../../utils/helpers/Metrics'

/** Icons */
import BackIcon from '../../../assets/icons/back.svg'

/** Main Export */
const InfoScreen = ({ navigation }) => {

    const { currentTheme, theme } = useThemeContext()
    const colors = theme.colors
    const scrollOffsetY = useRef(0)
    const [showSmokyEffect, setShowSmokyEffect] = useState(false)

    const handleEmailPress = (email) => {
        Linking.openURL(`${(Platform.OS === 'android') ? `mailto:${email}?cc=?` : `mailto:${email}?cc=&`}`);
    };

    const handlePhonePress = (phone) => {
        Linking.openURL(`tel: +45${phone.replace(/\s/g, '')} `);
    };

    const handleLinkPress = (link) => {
        Linking.openURL(`https://${link}`);
    };

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
                            Info
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
                        <View style={styles.ny_body}>
                            {
                                Content.map((item, index) => {
                                    return (
                                        <View style={styles.ny_list} key={index}>
                                            <Text style={[styles.ny_section_title, { color: colors.text_color }]}>
                                                {item.title}
                                            </Text>
                                            {
                                                item.text ?
                                                    <Text
                                                        style={[
                                                            styles.ny_text,
                                                            { color: colors.text_color }
                                                        ]}
                                                    >{item.text}{"\n"}</Text> : null
                                            }
                                            {
                                                item.text2 ?
                                                    <Text
                                                        style={[
                                                            styles.ny_text,
                                                            { color: colors.text_color }
                                                        ]}
                                                    >{item.text2}{"\n"}</Text> : null
                                            }
                                            {
                                                item.text3 ?
                                                    <Text
                                                        style={[
                                                            styles.ny_text,
                                                            { color: colors.text_color }
                                                        ]}
                                                    >{item.text3}{"\n"}</Text> : null
                                            }
                                            {
                                                item.mail ?
                                                    <TouchableOpacity onPress={() => handleEmailPress(item.mail)}>
                                                        <Text
                                                            style={[
                                                                styles.ny_text,
                                                                { color: colors.text_color, paddingBottom: ms(15) }
                                                            ]}
                                                        >Mail : {item.mail}</Text>
                                                    </TouchableOpacity>
                                                    : null
                                            }
                                            {
                                                item.tlf ?
                                                    <TouchableOpacity onPress={() => handlePhonePress(item.tlf)}>
                                                        <Text
                                                            style={[
                                                                styles.ny_text,
                                                                { color: colors.text_color, paddingBottom: ms(15) }
                                                            ]}
                                                        >Tlf : {item.tlf}</Text>
                                                    </TouchableOpacity>
                                                    : null
                                            }
                                            {
                                                item.link ?
                                                    <TouchableOpacity onPress={() => handleLinkPress(item.link)}>
                                                        <Text style={[
                                                            styles.ny_text,
                                                            { color: colors.text_color }
                                                        ]}
                                                        >Læs mere : {item.link}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    : null
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default InfoScreen

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
    ny_body: {
        padding: ms(14),
        paddingTop: ms(12),
    },
    ny_list: {
        marginBottom: ms(32),
        paddingLeft: ms(36)
    },
    ny_section_title: {
        fontSize: ms(27),
        fontFamily: Fonts.Font_700,
        paddingBottom: ms(10)
    },
    ny_text: {
        fontSize: ms(17),
        fontFamily: Fonts.Font_400,
        flex: 1
    }
})

const Content = [
    {
        id: "1",
        title: "Om Nordisk Yoga",
        text: "Nordisk Yoga har eksisteret i Odense siden 1983. I dag er vi et team af 20 erfarne og veluddannede yogalærere, der brænder for at undervise.",
        text2: "Vi lægger vægt på en professionel og grundig instruktion, der tager hensyn til den enkelte elev i en afslappet atmosfære. Nordisk Yoga tilbyder undervisning i en bred vifte af yogaens specialer. Du kan derfor få kvalificeret undervisning, i den yogagren, som passer til dig: Hatha-, Vinyasa-, Ashtanga-, Iyengar-, Yin-, Hot Yoga, Hormonbalancerende Yoga, Mindfulness, Meditation samt Pilates & Slings.",
        text3: "Vi har ligeledes kurser for dig, som er gravid eller på barsel. Nordisk Yoga er en aftenskole. Der undervises på daglige klasser - man tilmelder sig et forløb – eller på events."
    },
    {
        id: "2",
        title: "Centralt beliggende",
        text: "Vi råder over to yogastudier og du finder begge centralt placeret inde i Thrige Firkanten i Odense. Der er mulighed for parkering og vi ligger i gå afstand til Odense Banegård.",
        text2: "På Tolderlundsvej 7 finder du vores to store og lyse lokaler, som vi har indrettet specielt til yoga og pilates undervisning. Lokalerne er udstyret med skridsikre yogamåtter, futon-madrasser, tæpper og andet udstyr. Derudover har vi et fælles omklædningsrum, toiletter og tekøkken/opholdsrum med sofa og stole.",
        text3: `I Buchwaldsgade 35, kld. finder du vores Hot Yoga sal og en alm. yogasal. Vores Hot Yoga sal er udstyret med infrarøde varmepaneler. Her udøves yoga i 37 graders varme. Vores alm. yogasal er udstyret med skridsikre yogamåtter, futon-madrasser, tæpper og andet udstyr. Derudover har vi to omklædningsrum med badefaciliteter og toiletter.`
    },
    {
        id: "3",
        title: "Kontakt",
        mail: "info@nordiskyoga.dk",
        tlf: "66 17 80 80",
        link: "www.nordiskyoga.dk"
    }
]