import { StyleSheet, Text, View, SafeAreaView, Pressable, Modal, TextInput, TextBase, Button, ScrollView, Alert, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ToDoIndex({ navigation, route }) {
	const [modalVisible, setModalVisible] = useState(false);
	const [data, setData] = useState([]);

	useEffect(() => {
		getAllData();
	}, []);

	useEffect(() => {
		console.log("data showing");
		console.log(data);
	}, [data]);

	const getAllData = async () => {
		try {
			const keys = await AsyncStorage.getAllKeys();
			if (keys.length > 0) {
				const items = await AsyncStorage.multiGet(keys);
				let rows = items.reduce((accumulator, [key, value]) => {
					accumulator[key] = JSON.parse(value);
					return accumulator;
				}, {});
				setData(rows);
			}
		} catch (e) {
			console.log("its error in get all data method.");
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

	return (
		<>
			<SafeAreaView>
				<View style={{ height: "100%" }}>
					{/* <Button onPress={() => clearData()} title="button" /> */}
					<View style={{ height: "90%", padding: 10 }}>{/* <View style={{ borderWidth: 2, borderColor: "#FF6400", borderRadius: 10, marginTop: 10, paddingBottom: 130 }}></View> */}</View>
					<Pressable style={({ pressed }) => [pressed ? styles.floatingButton : styles.floatingButtonPressed]} onPress={() => setModalVisible(true)}>
						{({ pressed }) => <Ionicons name={pressed ? "create" : "create-outline"} size={pressed ? 23 : 28} style={{ color: "white" }} />}
					</Pressable>
					<Form modalVisible={modalVisible} setModalVisible={setModalVisible} getAllData={getAllData} />
				</View>
			</SafeAreaView>
		</>
	);
}

function Form({ modalVisible, setModalVisible, getAllData }) {
	const [field, setField] = useState({
		task: "New Task",
		description: "complete before end of the week",
		usage: "work",
		date_time: "2024-05-27T17:37:44",
	});

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setField({ ...field, date_time: currentDate });
	};

	const showMode = (currentMode) => {
		DateTimePickerAndroid.open({
			value: field.date_time,
			onChange,
			mode: currentMode,
			is24Hour: true,
		});
	};

	const showDatepicker = () => {
		showMode("date");
	};

	const showTimepicker = () => {
		showMode("time");
	};

	const storeData = async (value) => {
		try {
			const min = 1;
			const max = 100;
			const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
			const jsonValue = JSON.stringify(value);
			await AsyncStorage.setItem(`task${randomNumber}`, jsonValue);
		} catch (e) {
			console.log("its error in store method.");
		}
	};

	const submit = () => {
		storeData(field);
		closeModal();
		getAllData();
	};

	const closeModal = () => {
		setModalVisible(!modalVisible);
		// setField({
		// 	task: "",
		// 	description: "",
		// 	usage: "",
		// 	date_time: "",
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
							selectedValue={field.usage}
							onValueChange={(itemValue, itemIndex) => {
								setField({ ...field, usage: itemValue });
							}}>
							<Picker.Item label="Personal" value="personal" />
							<Picker.Item label="Work" value="work" />
						</Picker>
					</View>
					<Text style={styles.fieldBox}>selected Date & Time : {field.date_time.toLocaleString()}</Text>
					<View style={styles.fieldBox}>
						<Text style={styles.fieldTitle}>Select Date :</Text>
						<Pressable style={[styles.dateTimeButton]} onPress={showDatepicker}>
							<Text style={{ textAlign: "center" }}>Select Date</Text>
						</Pressable>
					</View>
					<View style={styles.fieldBox}>
						<Text style={styles.fieldTitle}>Select Time :</Text>
						<Pressable style={[styles.dateTimeButton]} onPress={showTimepicker}>
							<Text style={{ textAlign: "center" }}>Select Time</Text>
						</Pressable>
					</View>
					<Pressable style={[styles.button, { right: 90 }]} onPress={submit}>
						<Text style={styles.textStyle}>Submit</Text>
					</Pressable>
					<Pressable style={[styles.button, { backgroundColor: "lightgrey" }]} onPress={closeModal}>
						<Text style={[styles.textStyle, { color: "black" }]}>Cancel</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
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

	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
		height: "100%",
	},

	modalView: {
		width: "98%",
		height: "80%",
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
		bottom: 20,
		right: 15,
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
