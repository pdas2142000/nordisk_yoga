/** Libraries */
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PortalHost } from '@gorhom/portal'

/** Local Imports */
import { MyTabBar } from '../navigation/custom-tab'

/** Screens */
import LandingScreen from '../screen/landing'
import UgePlanScreen from '../screen/ugeplan'
import YogaScreen from '../screen/yoga'
import InfoScreen from '../screen/info'
import VideoPlayerScreen from '../screen/video-player'
import WebViewScreen from '../screen/web-view'
import MusicPlayerScreen from '../screen/music-player'

/** Navigators */
const MainStack = createNativeStackNavigator()
const TabStack = createBottomTabNavigator()

const BottomTabsComponent = ()=>{
	return  (
		<TabStack.Navigator tabBar={props => <MyTabBar {...props} />} screenOptions={{ headerShown: false }}>
			<TabStack.Screen name="UgePlanScreen" component={UgePlanScreen}	/>
			<TabStack.Screen name="YogaScreen" component={YogaScreen} />
			<TabStack.Screen name="InfoScreen" component={InfoScreen} />
		</TabStack.Navigator>
	)
}

const MainStackComponent =()=>{
    return (
        <MainStack.Navigator initialRouteName="LandingScreen" screenOptions={{ headerShown: false }}>
          	<MainStack.Screen name="LandingScreen" component={LandingScreen} />
			<MainStack.Screen name='BottomTabs' component={BottomTabsComponent}/>
			<MainStack.Screen name="VideoPlayerScreen" component={VideoPlayerScreen}/>
			<MainStack.Screen name="MusicPlayerScreen" component={MusicPlayerScreen}/>
			<MainStack.Screen name="WebViewScreen" component={WebViewScreen} />
        </MainStack.Navigator>
    )
}

/** Main Export */
const AppNavigation = () => {
	return (
		<>
			<MainStackComponent/>
			<PortalHost name="CustomPortalHost" />
		</>
	)
}

export default AppNavigation