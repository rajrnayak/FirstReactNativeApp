import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, FlatList, Button } from "react-native";
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
			const keys = await AsyncStorage.getAllKeys();
			const rows = await AsyncStorage.multiGet(keys);

			let tasks = await AsyncStorage.getItem("tasks");
			tasks = tasks ? JSON.parse(tasks) : {};

			let tasksArr = [];

			Object.keys(tasks).forEach(function (key) {
				tasksArr.push(JSON.parse(tasks[key]));
			});

			setData(tasksArr);
		} catch (e) {
			console.log("its error in get all data method.");
		}
	};

	const destroyData = async (id) => {
		try {
			let tasks = await AsyncStorage.getItem("tasks");
			tasks = tasks ? JSON.parse(tasks) : {};
			delete tasks[id];
			await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
			getAllData();
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
										<Text>Task For : {item.usage}</Text>
										<Text>Date & Time : {item.date_time}</Text>
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
