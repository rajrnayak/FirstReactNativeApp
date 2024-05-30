import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import ToDoListDatabase from "./TodoListDataBase.js";

export default function Home() {
	const [tasksData, setTasksData] = useState({});

	useEffect(() => {
		let toDoDB = new ToDoListDatabase();
		// toDoDB.dropTables();
		toDoDB.createCategoriesTable();
		toDoDB.createTaskTable();
		getTasksData();
	}, []);

	const getTasksData = async () => {
		let toDoDB = new ToDoListDatabase();
		let data = await toDoDB.getTasks();
		setTasksData(data);
	};

	return (
		<>
			<View style={{ flex: 1, borderWidth: 1, borderColor: "#FF6400", margin: 10 }}></View>
		</>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: "skyblue",
		width: 140,
		height: 50,
		borderRadius: 7,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		fontSize: 25,
	},
	text: {
		margin: "auto",
		fontSize: 30,
		fontWeight: "bold",
	},
});
