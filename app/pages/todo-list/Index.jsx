import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, FlatList, Alert, ToastAndroid } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import Form from "./Form.jsx";
import { Swipeable } from "react-native-gesture-handler";
import ToDoListDatabase from "../TodoListDataBase.js";

export default function ToDoIndex({ navigation, route }) {
	const [data, setData] = useState([]);

	const modalRef = useRef(null);

	useEffect(() => {
		getAllData();
	}, []);

	const getAllData = async () => {
		try {
			const db = await SQLite.openDatabaseAsync("toDoList");
			let query = await db.getAllAsync(`
			SELECT tasks.*, categories.name as category_name
			FROM tasks 
			LEFT JOIN categories ON tasks.category_id = categories.id
			`);
			setData(query);
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
						let toDoDB = new ToDoListDatabase();

						let response = await toDoDB.destroyTask(id);

						if (response.message) {
							await getAllData();
							ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
						}
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
									<Swipeable
										renderLeftActions={() => (
											<Pressable
												style={[styles.swipePressable, { backgroundColor: "#1ab52e" }]}
												onPress={() => {
													openModal(item);
												}}>
												<Ionicons style={styles.swipeIcon} name="create-outline" size={30} color={styles.swipeIconColor} />
											</Pressable>
										)}
										renderRightActions={() => (
											<Pressable
												style={[styles.swipePressable, { backgroundColor: "#FF0000" }]}
												onPress={() => {
													destroyData(item.id);
												}}>
												<Ionicons style={styles.swipeIcon} name="trash-outline" size={30} color={styles.swipeIconColor} />
											</Pressable>
										)}>
										<View style={{ borderWidth: 2, borderColor: "#FF6400", borderRadius: 10, marginTop: 10, padding: 20, gap: 5, backgroundColor: "white" }}>
											<Text>Task: {item.task}</Text>
											<Text>Description : {item.description}</Text>
											<Text>Task Category : {item.category_name}</Text>
											<Text>Status : {(item.status == 0 && "To Do") || (item.status == 1 && "In Progress") || (item.status == 2 && "Done")}</Text>
											<Text>Date & Time : {item.date}</Text>
										</View>
									</Swipeable>
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

	swipePressable: {
		marginTop: 10,
		width: "30%",
		height: "auto",
		borderRadius: 10,
	},

	swipeIcon: {
		margin: "auto",
	},

	swipeIconColor: {
		color: "white",
	},
});
