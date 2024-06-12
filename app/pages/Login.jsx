import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, ToastAndroid, View } from "react-native";
import ToDoListDatabase from "./TodoListDataBase";
import { useDispatch } from "react-redux";
import { AddUserAuth } from "./features/UserAuth";
import axios from "axios";

export default function Login({ navigation }) {
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const [loginError, setLoginError] = useState("");
	const dispatch = useDispatch();

	const onChange = (name, value) => {
		setUser({
			...user,
			[name]: value,
		});
		loginError != "" && setLoginError("");
	};

	const submit = async () => {
		axios
			.post("http://192.168.1.3:8000/api/login", user)
			.then((response) => {
				if (response.data.user) {
					dispatch(AddUserAuth({ user: response.data.user, api_token: response.data.api_token, is_login: true }));
					setUser({ name: "", password: "" });
					// ToastAndroid.showWithGravity(response.data.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
				} else {
					setLoginError(response.data.email);
				}
			})
			.catch((error) => {
				console.log(error);
			});

		// let toDoDB = new ToDoListDatabase();
		// let response = await toDoDB.isLogin(user);
		// console.log(response);
	};

	return (
		<>
			<View style={{ marginBottom: 20 }}>
				<Text style={{ fontSize: 30, fontWeight: "bold", textAlign: "center" }}>Login</Text>
			</View>
			<View style={{ margin: 15, gap: 20 }}>
				<View>
					<Text>Email :</Text>
					<TextInput placeholder="Enter Email." onChangeText={(text) => onChange("email", text)} value={user.email} />
				</View>

				<View>
					<Text>Password :</Text>
					<TextInput secureTextEntry={true} placeholder="Enter Password." onChangeText={(text) => onChange("password", text)} value={user.password} />
				</View>

				<Text style={{ color: "red", fontWeight: "600" }}>{loginError}</Text>

				<View>
					<Pressable onPress={submit} style={{ backgroundColor: "skyblue", padding: 10, flexDirection: "row", justifyContent: "center" }}>
						<Text>Submit</Text>
					</Pressable>
				</View>
			</View>
		</>
	);
}
