import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, FlatList, Alert, ToastAndroid, Modal, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import * as SQLite from "expo-sqlite";
import Form from "./Form.jsx";
import { Swipeable } from "react-native-gesture-handler";
import ToDoListDatabase from "../TodoListDataBase.js";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";

let buttonColors = ["#B0EBB4", "#BED7DC", "#DCBFFF", "#FFC96F", "#A0DEFF"];

export default function ToDoIndex({ navigation }) {
	const [visible, setVisible] = useState({
		modal: false,
		loader: false,
		scrollLoader: false,
	});
	const [modalData, setModalData] = useState({});
	const [data, setData] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loadData, setLoadData] = useState({
		status: null,
		category: null,
	});
	const [currentPage, setCurrentPage] = useState(1);
	const count = useSelector((state) => state.counter.value);

	const modalRef = useRef(null);

	useEffect(() => {
		// messageShowing();
		getCategories();
		getTasksByValue();
	}, []);

	useEffect(() => {
		setCurrentPage(1);
		getTasksByValue();
	}, [loadData]);

	const getCategories = async () => {
		setVisible({ ...visible, loader: true });
		let toDoDB = new ToDoListDatabase();
		let response = await toDoDB.getCategories();
		setCategories(response);
		setVisible({ ...visible, loader: false });
	};

	const messageShowing = async () => {
		try {
			await ToastAndroid.showWithGravity("Swipe left to Delete the Task And...", ToastAndroid.SHORT, ToastAndroid.CENTER);
			ToastAndroid.showWithGravity("Swipe right to Edit the Task", ToastAndroid.SHORT, ToastAndroid.CENTER);
		} catch (e) {
			console.log("its error in get all data method.");
		}
	};

	const getTasksByValue = async () => {
		try {
			setVisible({ ...visible, loader: true });
			let toDoDB = new ToDoListDatabase();
			let response = await toDoDB.getAllTasksByValue(loadData.category, loadData.status);
			await setData(response);
			setVisible({ ...visible, loader: false });
		} catch (e) {
			console.log("its error in get all data by value method.");
		}
	};

	const getTasksByScroll = async () => {
		try {
			setVisible({ ...visible, scrollLoader: true });
			setCurrentPage((p) => p + 1);
			let toDoDB = new ToDoListDatabase();
			let response = await toDoDB.getAllTasksByValue(loadData.category, loadData.status, currentPage);
			await setData(response);
			setVisible({ ...visible, scrollLoader: false });
		} catch (e) {
			console.log("its error in get all data by value method.");
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
							await getTasksByValue();
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

	const listFooter = () => {
		return (
			<View
				style={{
					justifyContent: "flex-end",
					alignItems: "center",
				}}>
				{visible.scrollLoader && <ActivityIndicator size="large" color="#A0DEFF" />}
			</View>
		);
	};

	return (
		<>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ padding: 5, flex: 1.1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginLeft: 5, marginRight: 5 }}>
					<Text style={{ fontWeight: "bold", flex: 1 }}>Category :</Text>
					<View style={{ flex: 4 }}>
						<ScrollView horizontal={true}>
							<Pressable
								onPress={() => {
									loadData.category != null && setLoadData({ ...loadData, category: null });
								}}
								style={[styles.categoryButton, { backgroundColor: "#FFC96F" }]}>
								<Text style={{ fontSize: 20 }}>All</Text>
							</Pressable>
							{categories.map((item, index) => (
								<Pressable key={index} onPress={() => loadData.category != item.id && setLoadData({ ...loadData, category: item.id })} style={[styles.categoryButton, { backgroundColor: buttonColors[index] }]}>
									<Text style={{ fontSize: 20 }}>{item.name}</Text>
								</Pressable>
							))}
						</ScrollView>
					</View>
				</View>
				<View style={{ padding: 5, flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginLeft: 5, marginRight: 5 }}>
					<Text style={{ fontWeight: "bold", flex: 1 }}>Status :</Text>
					<Picker style={{ backgroundColor: "#A0DEFF", flex: 4 }} selectedValue={loadData.status} onValueChange={(itemValue, itemIndex) => setLoadData({ ...loadData, status: itemValue })}>
						<Picker.Item label="all" value={null} />
						<Picker.Item label={"To Do"} value={0} />
						<Picker.Item label={"In Progress"} value={1} />
						<Picker.Item label={"Complete"} value={2} />
					</Picker>
				</View>
				<View style={{ flex: 12, marginTop: 5, marginLeft: 5, marginRight: 5 }}>
					<FlatList
						data={data}
						ListFooterComponent={listFooter}
						onEndReached={async () => {
							if (data.length >= 6) {
								setVisible({ ...visible, scrollLoader: true });
								getTasksByScroll();
								await new Promise((resolve) => setTimeout(resolve, 1000));
								setVisible({ ...visible, scrollLoader: false });
							}
						}}
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
											style={[styles.swipePressable, { backgroundColor: "#ff6767" }]}
											onPress={() => {
												destroyData(item.id);
											}}>
											<Ionicons style={styles.swipeIcon} name="trash-outline" size={30} color={styles.swipeIconColor} />
										</Pressable>
									)}>
									<Pressable
										onPress={() => {
											setModalData(item);
											setVisible({ ...visible, modal: true });
										}}
										style={{ borderWidth: 2, borderColor: "#A0DEFF", borderRadius: 10, marginTop: 5, marginBottom: 5, padding: 15, gap: 5, backgroundColor: "white" }}>
										<Text style={styles.cardTaskName}>{item.task}</Text>

										<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
											<Text>{item.category_name}</Text>

											<View style={{ flexDirection: "row", alignItems: "center" }}>
												<TaskStatus status={item.status} />
											</View>
										</View>

										<Text style={styles.cardDate}>{new Date(item.date).toDateString()}</Text>
									</Pressable>
								</Swipeable>
							</ScrollView>
						)}
					/>
				</View>
				{visible.loader && <ActivityIndicator style={styles.loader} size="large" color="#A0DEFF" />}
				<Pressable style={({ pressed }) => [pressed ? styles.floatingButton : styles.floatingButtonPressed]} onPress={() => openModal()}>
					{({ pressed }) => <Ionicons name={pressed ? "create" : "create-outline"} size={pressed ? 23 : 28} />}
				</Pressable>
				<Pressable style={styles.counterLabel} onPress={() => navigation.navigate("pages/Home")}>
					<Text>Counter : {count}</Text>
				</Pressable>
			</SafeAreaView>
			<Form ref={modalRef} getAllData={getTasksByValue} />
			<Modal
				animationType="slide"
				transparent={true}
				visible={visible.modal}
				onRequestClose={() => {
					setModalData({});
					setVisible({ ...visible, modal: false });
				}}>
				<View style={styles.modalContent}>
					<View style={styles.titleContainer}>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text style={styles.title}>Task Details : </Text>
							<Text style={[styles.title, { fontSize: 20, fontWeight: "600" }]}>{modalData.task}</Text>
						</View>
						<Pressable
							onPress={() => {
								setModalData({});
								setVisible({ ...visible, modal: false });
							}}>
							<Ionicons name={"close"} size={28} style={{ color: "white" }} />
						</Pressable>
					</View>
					<View style={{ gap: 8, paddingLeft: 10 }}>
						<Text style={{ fontSize: 20 }}>category : {modalData.category_name}</Text>
						<Text style={{ fontSize: 20 }}>status :{(modalData.status == 0 && "To Do") || (modalData.status == 1 && "In Progress") || (modalData.status == 2 && "Completed")}</Text>
						<Text style={{ fontSize: 20 }}>description : {modalData.description}</Text>
						<Text style={{ fontSize: 20 }}>date : {new Date(modalData.date).toDateString()}</Text>
					</View>
				</View>
			</Modal>
		</>
	);
}

function TaskStatus({ status, style }) {
	return <Text style={[styles.statusText, { borderColor: (status == 0 && "skyblue") || (status == 1 && "orange") || (status == 2 && "lightgreen") }, style]}>{(status == 0 && "To Do") || (status == 1 && "In Progress") || (status == 2 && "Completed")}</Text>;
}

const styles = StyleSheet.create({
	floatingButton: {
		alignItems: "center",
		justifyContent: "center",
		width: 50,
		height: 50,
		borderRadius: 40,
		backgroundColor: "#A0DEFF",
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
		backgroundColor: "#CAF4FF",
		position: "absolute",
		bottom: 10,
		right: 10,
	},

	swipePressable: {
		marginTop: 5,
		marginBottom: 5,
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

	modalContent: {
		height: "100%",
		width: "100%",
		backgroundColor: "#ffd8bf",
		borderTopRightRadius: 18,
		borderTopLeftRadius: 18,
		position: "absolute",
		bottom: 0,
	},

	titleContainer: {
		height: "5%",
		backgroundColor: "#f77e2e",
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		paddingHorizontal: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	title: {
		color: "#fff",
		fontSize: 16,
	},

	loader: {
		backgroundColor: "rgba(255 ,255 ,255 ,1)",
		height: "100%",
		width: "100%",
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
	},

	counterLabel: {
		position: "absolute",
		backgroundColor: "#A7E6FF",
		borderColor: "#A0DEFF",
		bottom: 15,
		left: 15,
		padding: 10,
		borderWidth: 1,
		borderRadius: 5,
	},
});
