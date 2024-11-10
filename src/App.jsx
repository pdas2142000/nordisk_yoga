import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { PortalProvider } from '@gorhom/portal'
import AppNavigation from './navigation/app-navigation'
import { ThemeProvider } from './utils/context/theme-context'

import BootSplash from "react-native-bootsplash";
import {useEffect} from "react"

const App = () => {
	useEffect(() => {
		const init = async () => {
		  // …do multiple sync or async tasks
		};
	
		init().finally(async () => {
		  await BootSplash.hide({ fade: true });
		  console.log("BootSplash has been hidden successfully");
		});
	  }, []);
	  
	return (
		<GestureHandlerRootView>
			<NavigationContainer>
				<ThemeProvider>					
					<PortalProvider>
						<AppNavigation />
					</PortalProvider>
				</ThemeProvider>
			</NavigationContainer>
		</GestureHandlerRootView>
	)
}

export default App