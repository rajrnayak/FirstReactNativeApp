import { StyleSheet, Text, View, Pressable, Modal, TextInput, ScrollView, ToastAndroid } from "react-native";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as SQLite from "expo-sqlite";

const Form = forwardRef(function Form({ getAllData }, ref) {
	const [modalVisible, setModalVisible] = useState(false);
	const [date, setDate] = useState(new Date());
	const [field, setField] = useState({
		id: "",
		task: "first task",
		description: "this is first one",
		use: "work",
		date: "2024-05-28",
	});

	const openModal = (task) => {
		task ? setField(task) : setField({ ...field, date: date });
		setModalVisible(!modalVisible);
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
			const db = await SQLite.openDatabaseAsync("toDoList");
			if (value.id == "") {
				await db.execAsync(`
				INSERT INTO tasks (task,description,use,date)
				VALUES ('${value.task}','${value.description}','${value.use}','${value.date}');`);
			} else {
				await db.runAsync(`UPDATE tasks SET task = '${value.task}',description = '${value.description}',use = '${value.use}',date = '${value.date}' WHERE id = ${value.id};`);
			}
			getAllData();
			let msg = value.id == "" ? "New task successfully Created" : "Task successfully Updated.";
			ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
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
		setField({
			id: "",
			task: "",
			description: "",
			use: "",
			date: "",
		});
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
								selectedValue={field.use}
								onValueChange={(itemValue, itemIndex) => {
									setField({ ...field, use: itemValue });
								}}>
								<Picker.Item label="Personal" value="personal" />
								<Picker.Item label="Work" value="work" />
							</Picker>
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
		height: "70%",
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
