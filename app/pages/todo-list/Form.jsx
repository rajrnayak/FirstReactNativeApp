import { StyleSheet, Text, View, Pressable, Modal, TextInput, ScrollView, ToastAndroid, FlatList } from "react-native";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as SQLite from "expo-sqlite";
import ToDoListDatabase from "../TodoListDataBase";

const Form = forwardRef(function Form({ getAllData }, ref) {
	const [modalVisible, setModalVisible] = useState(false);
	const [date, setDate] = useState(new Date());
	const [categories, setCategories] = useState([]);
	const [field, setField] = useState({
		id: "",
		task: "first task",
		description: "this is first one",
		category_id: "",
		status: "",
		date: "",
	});

	const openModal = (task) => {
		getCategories();
		if (task) {
			delete task.category_name;
			setField(task);
		} else {
			setField({ ...field, date: date });
		}
		setModalVisible(!modalVisible);
	};

	const getCategories = async () => {
		const db = await SQLite.openDatabaseAsync("toDoList");

		setCategories(await db.getAllAsync(`SELECT * FROM categories`));
	};

	useImperativeHandle(ref, () => {
		return {
			openModal,
			closeModal,
		};
	});

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setDate(currentDate);
		setField({ ...field, date: currentDate });
	};

	const showMode = (currentMode) => {
		DateTimePickerAndroid.open({
			value: date,
			onChange,
			mode: currentMode,
			is24Hour: true,
		});
	};

	const showDatePicker = () => {
		showMode("date");
	};

	const showTimePicker = () => {
		showMode("time");
	};

	const storeData = async (value) => {
		try {
			value.date = new Date(value.date).toISOString().slice(0, 10);
			let toDoDB = new ToDoListDatabase();
			let response = await toDoDB.manageTask(value);

			if (response.message) {
				await getAllData();
				ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
			}
		} catch (e) {
			console.log(e);
			console.log("its error in store method.");
		}
	};

	const submit = () => {
		storeData(field);
		closeModal();
	};

	const closeModal = () => {
		setModalVisible(!modalVisible);
		// setField({
		// 	id: "",
		// 	task: "",
		// 	description: "",
		// 	category_id: "",
		// 	status: "",
		// 	date: "",
		// });
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(!modalVisible);
			}}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<ScrollView>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Task :</Text>
							<TextInput
								style={styles.textInput}
								placeholder="What do you want to do?"
								value={field.task}
								onChangeText={(text) => {
									setField({ ...field, task: text });
								}}
							/>
						</View>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Description :</Text>
							<TextInput
								editable
								multiline
								numberOfLines={4}
								style={styles.textInput}
								placeholder="Enter your description."
								value={field.description}
								onChangeText={(text) => {
									setField({ ...field, description: text });
								}}
							/>
						</View>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Task For :</Text>
							<Picker
								style={styles.textInput}
								selectedValue={field.category_id}
								onValueChange={(itemValue, itemIndex) => {
									setField({ ...field, category_id: itemValue });
								}}>
								<Picker.Item label="Select Any One" value="" />
								{categories.map((item, index) => (
									<Picker.Item key={index} label={item.name} value={item.id} />
								))}
							</Picker>
						</View>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Status :</Text>
							<SegmentedControl
								style={[styles.textInput, { padding: 0, height: 40 }]}
								values={["To Do", "In Progress", "Done"]}
								selectedIndex={field.status}
								onChange={(event) => {
									setField({ ...field, status: event.nativeEvent.selectedSegmentIndex });
								}}
							/>
						</View>
						<Text style={styles.fieldBox}>selected Date & Time : {field.date.toLocaleString()}</Text>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Select Date :</Text>
							<Pressable style={[styles.dateTimeButton]} onPress={showDatePicker}>
								<Text style={{ textAlign: "center" }}>Select Date</Text>
							</Pressable>
						</View>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Select Time :</Text>
							<Pressable style={[styles.dateTimeButton]} onPress={showTimePicker}>
								<Text style={{ textAlign: "center" }}>Select Time</Text>
							</Pressable>
						</View>
						<Pressable style={[styles.button, { right: 80 }]} onPress={submit}>
							<Text style={styles.textStyle}>Submit</Text>
						</Pressable>
						<Pressable style={[styles.button, { backgroundColor: "lightgrey" }]} onPress={closeModal}>
							<Text style={[styles.textStyle, { color: "black" }]}>Cancel</Text>
						</Pressable>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
});

export default Form;

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
		height: "100%",
	},

	modalView: {
		width: "98%",
		height: "81%",
		backgroundColor: "white",
		borderRadius: 20,
		padding: 30,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},

	button: {
		padding: 10,
		backgroundColor: "#2196F3",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
		position: "absolute",
		bottom: 12,
		right: 0,
	},

	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},

	fieldTitle: {
		color: "grey",
		marginLeft: 5,
		fontSize: 16,
	},

	textInput: {
		backgroundColor: "#fff2e4",
		padding: 8,
		marginTop: 10,
		marginBottom: 10,
		borderColor: "grey",
		borderRadius: 10,
	},

	fieldBox: {
		marginBottom: 10,
	},

	dateTimeButton: {
		backgroundColor: "#fff2e4",
		padding: 10,
		width: 130,
		borderRadius: 10,
		marginTop: 5,
		marginBottom: 5,
	},
});
