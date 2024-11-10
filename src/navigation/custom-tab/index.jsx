/** React Imports */
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'

/** Loacl Imports */
import { useThemeContext } from '../../utils/context/theme-context'
import { IconProps } from '../../utils/helpers/Iconprops'
import { Fonts } from '../../utils/styles'
import { ms } from '../../utils/helpers/Metrics'

/** Icons */
import FlowerIcon from '../../../assets/icons/flower.svg'

/** Main Export */
export function MyTabBar({ state, descriptors, navigation }) {
	
    const { theme } = useThemeContext()
    const colors = theme.colors

	return (
		<>
			<View style={{...styles.tab_container, backgroundColor: colors.screen}}>
				{
					state.routes.map((route, index) => {

						const { options } = descriptors[route.key]
						const label =
							options.tabBarLabel !== undefined
								? options.tabBarLabel
								: options.title !== undefined
								? options.title
								: route.name

						const isFocused = state.index === index

						const onPress = () => {
							const event = navigation.emit({
								type: 'tabPress',
								target: route.key,
								canPreventDefault: true,
							})
							if (!isFocused && !event.defaultPrevented) {
								navigation.navigate(route.name, route.params)
							}
						}

						const onLongPress = () => {
							navigation.emit({
								type: 'tabLongPress',
								target: route.key,
							})
						}

						return (
							<TouchableOpacity
								key={label}
								accessibilityRole="button"
								accessibilityState={isFocused ? { selected: true } : {}}
								accessibilityLabel={options.tabBarAccessibilityLabel}
								testID={options.tabBarTestID}
								onPress={onPress}
								onLongPress={onLongPress}
								style={styles.tab_box}
							>
								<FlowerIcon {...IconProps(40)} fill={isFocused ? colors.tabActive : colors.tabInactive}/>
								<Text
									style={[
										styles.ny_text, 
										{
											color: isFocused ? colors.tabActive : colors.tabInactive,
											fontFamily: isFocused ? Fonts.Font_700 : Fonts.Font_400
										}
									]}
								>
									{label.replace('Screen', '')}
								</Text>
							</TouchableOpacity>
						)
					})
				}
			</View>
			<SafeAreaView style={{flex: 0, backgroundColor: colors.screen}} />
		</>
	)
}

const styles = StyleSheet.create({
    tab_container: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: ms(8)
    },
    tab_box: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center"
    },
    ny_text: {
        fontSize: ms(20)
    }
})