/** React imports */
import { View, ActivityIndicator, StyleSheet } from 'react-native'

/** Main Export */
const Spinner = () => {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={"#a4b4c4"} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
})

export default Spinner