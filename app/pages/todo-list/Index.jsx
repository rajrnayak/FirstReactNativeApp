import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, FlatList, Alert, ToastAndroid } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import Form from "./Form.jsx";

export default function ToDoIndex({ navigation, route }) {
	const [data, setData] = useState([]);

	const modalRef = useRef(null);

	useEffect(() => {
		getAllData();
	}, []);

	const getAllData = async () => {
		try {
			const db = await SQLite.openDatabaseAsync("toDoList");
			setData(await db.getAllAsync("SELECT * FROM tasks"));
		} catch (e) {
			console.log("its error in get all data method.");
		}
	};

	const destroyData = async (id) => {
		try {
			Alert.alert("Delete Task!", "Are you sure you want to delete this task?", [
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: async () => {
						const db = await SQLite.openDatabaseAsync("toDoList");
						await db.runAsync(`DELETE FROM tasks WHERE id = ${id}`);
						getAllData();
						ToastAndroid.showWithGravity("Task successfully deleted.", ToastAndroid.SHORT, ToastAndroid.CENTER);
					},
				},
			]);
		} catch (e) {
			console.log("its error in destroy method.");
		}
	};

	const clearData = async () => {
		try {
			await AsyncStorage.clear();
			setData([]);
		} catch (e) {
			console.log("its error in clear method.");
		}
	};

	const openModal = (task) => {
		modalRef.current.openModal(task);
	};

	return (
		<>
			<SafeAreaView>
				<View style={{ height: "100%" }}>
					{/* <Button onPress={() => clearData()} title="button" /> */}
					<View style={{ height: "90%", padding: 10 }}>
						<FlatList
							data={data}
							renderItem={({ item, index }) => (
								<ScrollView>
									<View style={{ borderWidth: 2, borderColor: "#FF6400", borderRadius: 10, marginTop: 10, padding: 20, gap: 5, backgroundColor: "white" }}>
										<Text>Task: {item.id}</Text>
										<Text>Task: {item.task}</Text>
										<Text>Description : {item.description}</Text>
										<Text>Task For : {item.use}</Text>
										<Text>Date & Time : {item.date}</Text>
										<Pressable style={{ position: "absolute", bottom: 20, right: 60, backgroundColor: "skyblue", padding: 5, borderRadius: 40 }} onPress={() => openModal(item)}>
											<Ionicons name="create-outline" size={23} />
										</Pressable>

										<Pressable style={{ position: "absolute", bottom: 20, right: 10, backgroundColor: "skyblue", padding: 5, borderRadius: 40 }} onPress={() => destroyData(item.id)}>
											<Ionicons name="trash-outline" size={23} />
										</Pressable>
									</View>
								</ScrollView>
							)}
						/>
					</View>
					<Pressable style={({ pressed }) => [pressed ? styles.floatingButton : styles.floatingButtonPressed]} onPress={() => openModal()}>
						{({ pressed }) => <Ionicons name={pressed ? "create" : "create-outline"} size={pressed ? 23 : 28} style={{ color: "white" }} />}
					</Pressable>
					<Form ref={modalRef} getAllData={getAllData} />
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
		backgroundColor: "#f4511e",
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
		backgroundColor: "#f4511e",
		position: "absolute",
		bottom: 10,
		right: 10,
	},
});
