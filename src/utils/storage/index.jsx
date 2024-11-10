import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveTheme = async (value) => {
    try {
        await AsyncStorage.setItem('currentTheme', JSON.stringify(value))
    } catch (error) {
        console.log(error)
    }
}

export const getTheme = async () => {
    try {
        const itemString = await AsyncStorage.getItem('currentTheme')
        if (itemString) {
            return JSON.parse(itemString)
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

export default {
    saveTheme,
    getTheme
}