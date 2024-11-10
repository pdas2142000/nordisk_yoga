/** React Imports */
import React, { createContext, useState, useEffect, useContext } from 'react'
import { StatusBar, useColorScheme } from 'react-native'

/** Local Imports */
import { saveTheme, getTheme } from '../../storage'
import Colors from '../../colors'

const ThemeContext = createContext()

/** Main Export */ 
export const ThemeProvider = ({ children }) => {

	const appearance = useColorScheme()

	const [currentTheme, setCurrentTheme] = useState(appearance)
	const [theme, setTheme] = useState(appearance === 'dark' ? Colors.dark : Colors.light)
  
	const toggleTheme = (newTheme) => {
		saveTheme(newTheme)
		setCurrentTheme(newTheme)
		setTheme(newTheme == 'dark' ? Colors.dark : Colors.light)
	}

	const checkStoredTheme = async () => {
		const storedTheme = await getTheme()
		if(storedTheme) {
			toggleTheme(storedTheme)
			setCurrentTheme(storedTheme)
		}
	}

	useEffect(() => {
		checkStoredTheme()
	}, [appearance])

	return (
		<ThemeContext.Provider value={{ currentTheme, theme, toggleTheme }}>
			<StatusBar barStyle={currentTheme == 'dark' ? 'light-content' : 'dark-content'} />
			{children}
		</ThemeContext.Provider>
	)
}

export const useThemeContext = () => useContext(ThemeContext)
