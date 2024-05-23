import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";

export default function Index({ navigation, route }) {
	const user = route.params;
	const [users, setUsers] = useState([]);
	useEffect(() => {
		user != undefined && setUsers([...users, user]);
	}, [user]);

	return (
		<>
			<View style={{ height: "100%" }}>
				<View style={{ alignItems: "center", marginBottom: 10, marginTop: 10 }}>
					<Text style={{ fontSize: 30 }}>User Details</Text>
				</View>
				<View style={{ borderWidth: 1, height: "81%", margin: 5, marginBottom: 20, borderRadius: 5 }}>
					<View style={{ flexDirection: "row" }}>
						<Text style={Styles.tableHeaderRow}>Sr.No.</Text>
						<Text style={[Styles.tableHeaderRow, { flex: 1.7 }]}>First Name</Text>
						<Text style={[Styles.tableHeaderRow, { flex: 1.7 }]}>Last Name</Text>
						<Text style={Styles.tableHeaderRow}>Age</Text>
						<Text style={[Styles.tableHeaderRow, { flex: 1.5 }]}>City</Text>
					</View>
					<FlatList
						data={users}
						renderItem={({ item, index }) => (
							<View style={{ flexDirection: "row" }}>
								<Text style={Styles.tableRow}>{index + 1}</Text>
								<Text style={[Styles.tableRow, { flex: 1.5 }]}>{item.first_name}</Text>
								<Text style={[Styles.tableRow, { flex: 1.5 }]}>{item.last_name}</Text>
								<Text style={Styles.tableRow}>{item.age}</Text>
								<Text style={[Styles.tableRow, { flex: 1.5 }]}>{item.city}</Text>
							</View>
						)}
					/>
				</View>
				<Pressable style={({ pressed }) => [pressed ? Styles.floatingButton : Styles.floatingButtonPressed]} onPress={() => navigation.navigate("User Form")}>
					{({ pressed }) => <Ionicons name="person-add" size={pressed ? 23 : 28} />}
				</Pressable>
			</View>
		</>
	);
}

const Styles = StyleSheet.create({
	floatingButton: {
		alignItems: "center",
		justifyContent: "center",
		width: 50,
		height: 50,
		borderRadius: 40,
		backgroundColor: "#5AB2FF",
		position: "absolute",
		bottom: 15,
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
		bottom: 10,
		right: 10,
	},
	buttonText: {
		fontSize: 20,
	},
	tableRow: { fontSize: 15, flex: 1, textAlign: "center" },
	tableHeaderRow: { fontWeight: "bold", fontSize: 15, flex: 1, textAlign: "center" },
});
