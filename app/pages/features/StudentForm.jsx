import { Pressable, Text, TextInput, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { AddUserAuth } from "./UserAuth";
import { onChange } from "./StudentSlice";
import { Picker } from "@react-native-picker/picker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentForm({ navigation }) {
	const student = useSelector((state) => state.studentField);
	const dispatch = useDispatch();
	const [role, setRole] = useState({
		name: "",
		display_name: "",
	});
	const apiToken = useSelector((state) => state.userAuth.api_token);

	const fetchUsers = async () => {
		axios({
			method: "get",
			url: "http://192.168.1.3:8000/api/test-api",
			data: role,
			headers: { Authorization: `Bearer ${apiToken}` },
		})
			.then((response) => {
				console.log("roles data ->");
				console.log(response.data);
			})
			.catch((error) => {
				if (error.response.status == 401) {
					console.log(error.response.status);
					dispatch(AddUserAuth({ is_login: false }));
				}
				console.log(error);
			});
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const submit = async (role) => {
		axios({
			method: "post",
			url: "http://192.168.1.3:8000/api/store-role",
			data: role,
			headers: { Authorization: `Bearer ${apiToken}` },
		})
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<>
			<View
				style={{
					margin: 10,
					gap: 5,
				}}>
				<Text>Name :</Text>
				<TextInput placeholder="Enter Role Name." onChangeText={(text) => setRole({ ...role, name: text })} value={role.name} />
			</View>

			<View
				style={{
					margin: 10,
					gap: 5,
				}}>
				<Text>Display Name :</Text>
				<TextInput placeholder="Enter Role Display Name." onChangeText={(text) => setRole({ ...role, display_name: text })} value={role.display_name} />
			</View>

			<Pressable onPress={() => submit(role)} style={{ padding: 5, marginTop: 10, backgroundColor: "skyblue", alignItems: "center" }}>
				<Text>Submit</Text>
			</Pressable>
			{/* <View style={{ margin: 15, gap: 20 }}>
				<View>
					<Text>Enter First Name :</Text>
					<TextInput placeholder="What do you want to do?" onChangeText={(text) => dispatch(onChange({ value: text, name: "first_name" }))} value={student.first_name} />
				</View>

				<View>
					<Text>Enter Last Name :</Text>
					<TextInput placeholder="What do you want to do?" onChangeText={(text) => dispatch(onChange({ value: text, name: "last_name" }))} value={student.last_name} />
				</View>

				<View>
					<Text>Enter Last Name :</Text>
					<Picker onValueChange={(text) => dispatch(onChange({ value: text, name: "city" }))} selectedValue={student.city}>
						<Picker.Item label="Select Any One" value="" />
						<Picker.Item label="Kalol" value="kalol" />
						<Picker.Item label="Kadi" value="kadi" />
					</Picker>
				</View>

				<View>
					<Text>Enter Gender :</Text>
					<SegmentedControl values={["Male", "Female", "Other"]} style={{ height: 40 }} selectedIndex={student.gender} onChange={(event) => dispatch(onChange({ value: event.nativeEvent.selectedSegmentIndex, name: "gender" }))} />
				</View>
			</View> */}
		</>
	);
}
