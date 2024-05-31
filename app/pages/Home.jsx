import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from "react-native";
import { useEffect, useState } from "react";
import ToDoListDatabase from "./TodoListDataBase.js";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

export default function Home({ navigation }) {
	const [tasksData, setTasksData] = useState({});

	useEffect(() => {
		let toDoDB = new ToDoListDatabase();
		// toDoDB.dropTables();
		toDoDB.createCategoriesTable();
		toDoDB.createTaskTable();
		getTasksData();
	}, []);

	useEffect(() => {
		getTasksData(tasksData.renderLimit);
	}, [tasksData.renderLimit]);

	const getTasksData = async (limit) => {
		let toDoDB = new ToDoListDatabase();
		let data = await toDoDB.getTasks(limit);
		data.renderLimit = limit ? limit : false;
		setTasksData(data);
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
							await getTasksData();
							ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
						}
					},
				},
			]);
		} catch (e) {
			console.log("its error in destroy method.");
		}
	};

	const checkTask = async (id) => {
		let toDoDB = new ToDoListDatabase();

		let response = await toDoDB.completeTask(id);

		console.log(response);

		if (response.message) {
			await getTasksData();
			ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
		}
	};

	return (
		<>
			<View style={{ flex: 1, margin: 10, gap: 10 }}>
				<Pressable onPress={() => navigation.navigate("pages/todo-list/Index")} style={[styles.tasksCard, { backgroundColor: "#b4c4ff", flexDirection: "row" }]}>
					<Text style={styles.titleText}>Total Tasks : </Text>
					<Text style={styles.text}>{tasksData.totalTasks}</Text>
				</Pressable>
				<View style={{ flex: 1, flexDirection: "row", columnGap: 10 }}>
					<View style={[styles.tasksCard, { backgroundColor: "#f9defd" }]}>
						<Text style={[styles.titleText, { fontSize: 17 }]}>Total Pending Tasks : </Text>
						<Text style={[styles.text, { fontSize: 19 }]}>{tasksData.totalPendingTasks}</Text>
					</View>
					<View style={[styles.tasksCard, { backgroundColor: "#cff3e9" }]}>
						<Text style={[styles.titleText, { fontSize: 17 }]}>Total Complete Tasks : </Text>
						<Text style={[styles.text, { fontSize: 19 }]}>{tasksData.completeTasks}</Text>
					</View>
				</View>
				<View style={styles.divider} />
				<View style={{ flex: 4, borderRadius: 5 }}>
					<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
						<Text style={[styles.titleText, { fontSize: 30 }]}> Due Tasks </Text>
						<View>
							<Text style={[styles.titleText, { fontSize: 10 }]}> Select Row : </Text>
							<SegmentedControl
								style={[styles.textInput, { padding: 0, height: 40 }]}
								values={["2", "All"]}
								selectedIndex={tasksData.renderLimit}
								onChange={(event) => {
									setTasksData({ ...tasksData, renderLimit: event.nativeEvent.selectedSegmentIndex });
								}}
							/>
						</View>
					</View>
					<FlatList
						data={tasksData.dueTasks}
						renderItem={({ item, index }) => (
							<ScrollView>
								<Swipeable
									renderLeftActions={() => (
										<Pressable
											style={[styles.swipePressable, { backgroundColor: "#1ab52e" }]}
											onPress={() => {
												checkTask(item.id);
											}}>
											<Ionicons style={styles.swipeIcon} name="checkmark-done-circle-outline" size={30} color={styles.swipeIconColor} />
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
										<Text style={styles.cardTaskName}>Task: {item.task}</Text>

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
			</View>
		</>
	);
}

function TaskStatus({ status }) {
	return <Text style={[styles.statusText, { borderColor: (status == 0 && "skyblue") || (status == 1 && "orange") }]}>{(status == 0 && "To Do") || (status == 1 && "In Progress")}</Text>;
}

const styles = StyleSheet.create({
	tasksCard: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
	},

	titleText: {
		fontSize: 20,
		fontWeight: "bold",
	},

	text: {
		fontSize: 20,
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

	divider: {
		borderBottomColor: "black",
		borderBottomWidth: 0.5,
		marginBottom: 10,
		marginTop: 10,
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
});
