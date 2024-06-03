import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, FlatList, Alert, ToastAndroid } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import Form from "./Form.jsx";
import { Swipeable } from "react-native-gesture-handler";
import ToDoListDatabase from "../TodoListDataBase.js";
import { FAB, Portal, PaperProvider } from "react-native-paper";

let buttonColors = ["#A0DEFF", "#B0EBB4", "#BED7DC", "#DCBFFF", "#FFC96F"];

export default function ToDoIndex() {
	const [data, setData] = useState([]);
	const [categories, setCategories] = useState([]);

	const [statusButton, setStatusButton] = useState({ open: false });
	const onStateChange = ({ open }) => setStatusButton({ open });
	const { open } = statusButton;

	const modalRef = useRef(null);

	useEffect(() => {
		messageShowing();
		getAllData();
		getCategories();
	}, []);

	const getCategories = async () => {
		let toDoDB = new ToDoListDatabase();
		let response = await toDoDB.getCategories();
		setCategories(response);
	};

	const messageShowing = async () => {
		try {
			await ToastAndroid.showWithGravity("Swipe left to Delete the Task And...", ToastAndroid.SHORT, ToastAndroid.CENTER);
			ToastAndroid.showWithGravity("Swipe right to Edit the Task", ToastAndroid.SHORT, ToastAndroid.CENTER);
		} catch (e) {
			console.log("its error in get all data method.");
		}
	};

	const getAllData = async () => {
		try {
			let toDoDB = new ToDoListDatabase();
			let response = await toDoDB.getAllTasks();
			setData(response);
		} catch (e) {
			console.log("its error in get all data method.");
		}
	};

	const getTasksByCategory = async (category_id) => {
		try {
			let toDoDB = new ToDoListDatabase();
			let response = await toDoDB.getAllTasksByCategory(category_id);
			setData(response);
		} catch (e) {
			console.log("its error in get all data bu category method.");
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

	const openModal = (task) => {
		modalRef.current.openModal(task);
	};

	return (
		<>
			<SafeAreaView style={{ flex: 1, padding: 5 }}>
				<View style={{ padding: 5, flex: 1 }}>
					<ScrollView horizontal={true}>
						<Pressable onPress={() => getAllData()} style={[styles.categoryButton, { backgroundColor: "#FFC96F" }]}>
							<Text style={{ fontSize: 20 }}>All</Text>
						</Pressable>
						{categories.map((item, index) => (
							<Pressable key={index} onPress={() => getTasksByCategory(item.id)} style={[styles.categoryButton, { backgroundColor: buttonColors[index] }]}>
								<Text style={{ fontSize: 20 }}>{item.name}</Text>
							</Pressable>
						))}
					</ScrollView>
				</View>
				<View style={{ flex: 12 }}>
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
									<View style={{ borderWidth: 2, borderColor: "#FF6400", borderRadius: 10, marginTop: 10, padding: 10, gap: 5, backgroundColor: "white" }}>
										<Text style={styles.cardTaskName}>{item.task}</Text>

										<Text>Task Category : {item.category_name}</Text>

										<View style={{ flexDirection: "row" }}>
											<Text>Status : </Text>
											<TaskStatus status={item.status} />
										</View>

										<Text>Description : {item.description}</Text>

										<Text style={styles.cardDate}>{new Date(item.date).toDateString()}</Text>
									</View>
								</Swipeable>
							</ScrollView>
						)}
					/>
				</View>
				<Pressable style={({ pressed }) => [pressed ? styles.floatingButton : styles.floatingButtonPressed]} onPress={() => openModal()}>
					{({ pressed }) => <Ionicons name={pressed ? "create" : "create-outline"} size={pressed ? 23 : 28} style={{ color: "white" }} />}
				</Pressable>
				<FAB.Group
					open={open}
					visible
					icon={open ? "notebook-check-outline" : "plus"}
					style={styles.statusButtonStyle}
					actions={[
						{
							icon: "playlist-check",
							label: "All",
							onPress: () => console.log("all"),
						},
						{
							icon: "note-outline",
							label: "To Do",
							onPress: () => console.log("to do"),
						},
						{
							icon: "note-edit-outline",
							label: "In Progress",
							onPress: () => console.log("in progress"),
						},
						{
							icon: "note-check-outline",
							label: "Complete",
							onPress: () => console.log("complete"),
						},
					]}
					onStateChange={onStateChange}
					onPress={() => {
						if (open) {
							// do something if the speed dial is open
						}
					}}
				/>
			</SafeAreaView>
			<Form ref={modalRef} getAllData={getAllData} />
		</>
	);
}

function TaskStatus({ status }) {
	return <Text style={[styles.statusText, { borderColor: (status == 0 && "skyblue") || (status == 1 && "orange") || (status == 2 && "lightgreen") }]}>{(status == 0 && "To Do") || (status == 1 && "In Progress") || (status == 2 && "Completed")}</Text>;
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
		left: 15,
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
		left: 10,
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

	cardDate: {
		position: "absolute",
		right: 5,
		top: 5,
	},

	cardTaskName: {
		fontSize: 22,
		fontWeight: "bold",
	},

	statusView: {
		flexDirection: "row",
		alignItems: "center",
	},

	statusText: {
		borderWidth: 2,
		marginLeft: 5,
		padding: 3,
		borderRadius: 5,
		textAlign: "center",
		justifyContent: "center",
	},

	categoryButton: {
		padding: 10,
		borderRadius: 5,
		margin: 5,
	},

	statusButtonStyle: {
		position: "absolute",
		left: -10,
		bottom: -2,
	},
});
