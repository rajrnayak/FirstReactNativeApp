import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { AddUserAuth, DeleteUserAuth } from "./features/UserAuth.jsx";
import Home from "./Home.jsx";
import Main from "./Main.jsx";
import Index from "./user/Index.jsx";
import Form from "./user/Form.jsx";
import ToDoIndex from "./todo-list/Index.jsx";
import StudentForm from "./features/StudentForm.jsx";
import Login from "./Login.jsx";

export default function App() {
	const Stack = createNativeStackNavigator();
	const Drawer = createDrawerNavigator();
	const dispatch = useDispatch();
	const [isAllocated, setIsAllocated] = useState(false);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		const value = await AsyncStorage.getItem("userAuth");
		const userAuth = JSON.parse(value);

		if (userAuth) {
			await dispatch(AddUserAuth({ user: userAuth.user, api_token: userAuth.api_token, is_login: userAuth.is_login }));
		}
		setIsAllocated(true);
	};

	function Root({ navigation, route }) {
		return (
			<>
				<Drawer.Navigator initialRouteName="pages/Home">
					<Drawer.Screen name="pages/Home" component={Home} options={styles.home} />
					<Drawer.Screen name="pages/todo-list/Index" component={ToDoIndex} options={styles.task} />
					<Drawer.Screen name="pages/user/Index" component={Index} options={{ title: "User" }} />
					<Drawer.Screen name="pages/features" component={StudentForm} options={styles.role} />
					<Drawer.Screen name="pages/Main" component={Main} options={{ title: "Calculator" }} />
				</Drawer.Navigator>
			</>
		);
	}

	const is_login = useSelector((state) => state.userAuth.is_login);

	return (
		<>
			<NavigationContainer independent={true}>
				{isAllocated &&
					(!is_login ? (
						<Stack.Navigator>
							<Stack.Screen name="pages/Login" component={Login} options={{ title: "Login" }} />
						</Stack.Navigator>
					) : (
						<Stack.Navigator>
							<Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />
							<Stack.Screen name="pages/user/Form" component={Form} options={{ title: "User Form" }} />
						</Stack.Navigator>
					))}
			</NavigationContainer>
		</>
	);
}

function LogOutButton() {
	const dispatch = useDispatch();
	return (
		<>
			<Pressable
				onPress={async () => {
					dispatch(DeleteUserAuth());
					await AsyncStorage.removeItem("userAuth");

					// Alert.alert("Log-out!", "Are you sure you want to Log-out?", [
					// 	{
					// 		text: "Cancel",
					// 		style: "cancel",
					// 	},
					// 	{
					// 		text: "OK",
					// 		onPress: async () => {
					// 		},
					// 	},
					// ]);
				}}>
				<Ionicons
					size={30}
					name="log-out"
					color="white"
					style={{
						marginTop: 10,
						marginRight: 10,
						alignItems: "center",
					}}
				/>
			</Pressable>
		</>
	);
}

const styles = StyleSheet.create({
	home: {
		title: "Home",
		headerStyle: {
			backgroundColor: "#5AB2FF",
		},
		headerTitleAlign: "center",
		headerTintColor: "#fff",
		headerTitleStyle: {
			textAlign: "center",
			fontWeight: "bold",
		},
		unmountOnBlur: true,
		headerRight: () => <LogOutButton />,
	},

	role: {
		title: "Role Form",
		headerStyle: {
			backgroundColor: "#5AB2FF",
		},
		headerTitleAlign: "center",
		headerTintColor: "#fff",
		headerTitleStyle: {
			textAlign: "center",
			fontWeight: "bold",
		},
		unmountOnBlur: true,
		headerRight: () => <LogOutButton />,
	},

	task: {
		title: "All Tasks",
		headerStyle: {
			backgroundColor: "#5AB2FF",
		},
		headerTitleAlign: "center",
		headerTintColor: "#fff",
		headerTitleStyle: {
			textAlign: "center",
			fontWeight: "bold",
		},
		unmountOnBlur: true,
	},
});
