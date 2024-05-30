import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import Home from "./pages/Home.jsx";
import Main from "./pages/Main.jsx";
import Index from "./pages/user/Index.jsx";
import Form from "./pages/user/Form.jsx";
import ToDoIndex from "./pages/todo-list/Index.jsx";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	function Root() {
		return (
			<Drawer.Navigator initialRouteName="pages/Home">
				<Drawer.Screen name="pages/Home" component={Home} options={styles.home} />
				<Drawer.Screen name="pages/todo-list/Index" component={ToDoIndex} options={styles.task} />
				<Drawer.Screen name="pages/user/Index" component={Index} options={{ title: "User" }} />
				<Drawer.Screen name="pages/Main" component={Main} options={{ title: "Calculator" }} />
			</Drawer.Navigator>
		);
	}

	return (
		<>
			<NavigationContainer independent={true}>
				<Stack.Navigator>
					<Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />
					<Stack.Screen name="pages/user/Form" component={Form} options={{ title: "User Form" }} />
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}

const styles = StyleSheet.create({
	home: {
		title: "Home",
		headerStyle: {
			backgroundColor: "#f4511e",
		},
		headerTitleAlign: "center",
		headerTintColor: "#fff",
		headerTitleStyle: {
			textAlign: "center",
			fontWeight: "bold",
		},
	},
	task: {
		title: "All Tasks",
		headerStyle: {
			backgroundColor: "#f4511e",
		},
		headerTitleAlign: "center",
		headerTintColor: "#fff",
		headerTitleStyle: {
			textAlign: "center",
			fontWeight: "bold",
		},
	},
});
