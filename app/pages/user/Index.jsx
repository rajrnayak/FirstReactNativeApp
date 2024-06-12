import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import "react-native-gesture-handler";

let idCounter = 4;

export default function Index({ navigation, route }) {
	const user = route.params;
	const [users, setUsers] = useState([
		{
			id: 1,
			first_name: "raj",
			last_name: "nayak",
			age: "21",
			city: "ahmedabad",
		},
		{
			id: 2,
			first_name: "jay",
			last_name: "gajjar",
			age: "22",
			city: "kalol",
		},
		{
			id: 3,
			first_name: "harsh",
			last_name: "patel",
			age: "23",
			city: "kadi",
		},
	]);

	useEffect(() => {
		if (user != undefined && user.id == null) {
			user.id = idCounter;
			setUsers([...users, user]);
			idCounter++;
		} else if (user != undefined && user.id != null) {
			setUsers(
				users.map((row) => {
					return row.id == user.id ? user : row;
				})
			);
		}
	}, [user]);

	function deleteUser(id) {
		Alert.alert("Alert Title", "My Alert Msg", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{ text: "OK", onPress: () => setUsers(users.filter((row) => row.id !== id)) },
		]);
	}

	return (
		<>
			<SafeAreaView>
				<View style={{ height: "100%", marginTop: 15 }}>
					<View style={{ height: "79%" }}>
						<FlatList
							data={users}
							renderItem={({ item, index }) => (
								<ScrollView>
									<View key={index} style={styles.card}>
										<View style={{ width: "50%", paddingLeft: 5 }}>
											<Text style={[styles.tableRow, { flex: 1.5 }]}> First Name : {item.first_name}</Text>

											<Text style={[styles.tableRow, { flex: 1.5 }]}>Last Name : {item.last_name}</Text>

											<Text style={styles.tableRow}>Age : {item.age}</Text>

											<Text style={[styles.tableRow, { flex: 1.5 }]}>City : {item.city}</Text>
										</View>

										<View style={{ width: "50%" }}>
											<Pressable style={[styles.floatingButton, { position: "absolute", bottom: 20, left: 50 }]} onPress={() => navigation.navigate("pages/user/Form", item)}>
												<Ionicons name="create-outline" size={23} />
											</Pressable>

											<Pressable style={[styles.floatingButton, { position: "absolute", bottom: 20, right: 20, backgroundColor: "red" }]} onPress={() => deleteUser(item.id)}>
												<Ionicons name="trash-outline" size={23} />
											</Pressable>
										</View>
									</View>
								</ScrollView>
							)}
						/>
					</View>
					<Pressable style={({ pressed }) => [pressed ? styles.floatingButton : styles.floatingButtonPressed]} onPress={() => navigation.navigate("pages/user/Form")}>
						{({ pressed }) => <Ionicons name="person-add" size={pressed ? 23 : 28} />}
					</Pressable>
				</View>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	floatingButton: {
		alignItems: "center",
		justifyContent: "center",
		width: 50,
		height: 50,
		borderRadius: 40,
		backgroundColor: "#5AB2FF",
		position: "absolute",
		bottom: 45,
		right: 15,
	},

	floatingButtonPressed: {
		alignItems: "center",
		justifyContent: "center",
		width: 60,
		height: 60,
		borderRadius: 40,
		backgroundColor: "skyblue",
		position: "absolute",
		bottom: 40,
		right: 10,
	},

	buttonText: {
		fontSize: 20,
	},

	tableRow: {
		fontSize: 15,
		margin: 3,
	},

	card: {
		borderWidth: 1,
		borderRadius: 15,
		marginBottom: 5,
		marginLeft: 10,
		marginRight: 10,
		flexDirection: "row",
		backgroundColor: "#EEF7FF",
	},
});
