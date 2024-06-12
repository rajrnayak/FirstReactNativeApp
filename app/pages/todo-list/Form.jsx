import { StyleSheet, Text, View, Pressable, Modal, TextInput, ScrollView, ToastAndroid } from "react-native";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import ToDoListDatabase from "../TodoListDataBase";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

const Form = forwardRef(function Form({ getAllData, user_id }, ref) {
	const [modalVisible, setModalVisible] = useState(false);
	const [date, setDate] = useState(new Date());
	const [categories, setCategories] = useState([]);
	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			id: "",
			task: "",
			description: "",
			category_id: "",
			status: "",
			date: "",
			user_id: "",
		},
	});

	useEffect(() => {
		getCategories();
	}, []);

	const openModal = (task) => {
		if (task) {
			setValue("id", task.id);
			setValue("task", task.task);
			setValue("description", task.description);
			setValue("category_id", task.category_id);
			setValue("status", task.status);
			setValue("date", task.date);
			setDate(new Date(task.date));
		} else {
			setDate(new Date());
		}
		setModalVisible(!modalVisible);
	};

	const getCategories = async () => {
		let toDoDB = new ToDoListDatabase();
		let response = await toDoDB.getCategories();
		setCategories(response);
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

	const storeData = async (task) => {
		try {
			task.date = new Date(date).toISOString().slice(0, 10);
			task.user_id = user_id;

			let toDoDB = new ToDoListDatabase();
			let response = await toDoDB.manageTask(task);

			if (response.message) {
				closeModal();
				await getAllData();
				ToastAndroid.showWithGravity(response.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
			}
		} catch (e) {
			console.log(e);
			console.log("its error in store method.");
		}
	};

	const submit = (task) => {
		storeData(task);
	};

	const closeModal = () => {
		setModalVisible(!modalVisible);
		reset();
		setDate("");
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
							<Controller
								control={control}
								rules={{
									required: "Task field must be required.",
								}}
								render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.textInput} placeholder="What do you want to do?" onBlur={onBlur} onChangeText={onChange} value={value} />}
								name="task"
							/>
							{errors.task && <Text style={styles.errorText}>{errors.task.message}</Text>}
						</View>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Description :</Text>
							<Controller
								control={control}
								rules={{
									required: "Description field must be required.",
								}}
								render={({ field: { onChange, onBlur, value } }) => <TextInput editable multiline numberOfLines={4} style={styles.textInput} placeholder="Enter your description." onBlur={onBlur} onChangeText={onChange} value={value} />}
								name="description"
							/>
							{errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
						</View>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Category :</Text>
							<Controller
								control={control}
								rules={{
									required: "Category field must be required.",
								}}
								render={({ field: { onChange, onBlur, value } }) => (
									<Picker style={styles.textInput} onBlur={onBlur} onValueChange={onChange} selectedValue={value}>
										<Picker.Item label="Select Any One" value="" />
										{categories.map((item, index) => (
											<Picker.Item key={index} label={item.name} value={item.id} />
										))}
									</Picker>
								)}
								name="category_id"
							/>
							{errors.category_id && <Text style={styles.errorText}>{errors.category_id.message}</Text>}
						</View>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Status :</Text>
							<Controller
								control={control}
								rules={{
									required: "Status field must be required.",
								}}
								render={({ field: { onChange, onBlur, value } }) => (
									<SegmentedControl style={[styles.textInput, { padding: 0, height: 40 }]} values={["To Do", "In Progress", "Done"]} onBlur={onBlur} selectedIndex={value} onChange={(event) => onChange(event.nativeEvent.selectedSegmentIndex)} />
								)}
								name="status"
							/>
							{errors.status && <Text style={styles.errorText}>{errors.status.message}</Text>}
						</View>
						<Text style={styles.fieldBox}>selected Date & Time : {date.toLocaleString()}</Text>
						<View style={styles.fieldBox}>
							<Text style={styles.fieldTitle}>Select Date :</Text>
							<Pressable style={[styles.dateTimeButton]} onPress={showDatePicker}>
								<Text style={{ textAlign: "center" }}>Select Date</Text>
							</Pressable>
						</View>
					</ScrollView>
					<Pressable style={[styles.button, { right: 80 }]} onPress={handleSubmit(submit)}>
						<Text style={styles.textStyle}>Submit</Text>
					</Pressable>
					<Pressable style={[styles.button, { backgroundColor: "lightgrey" }]} onPress={closeModal}>
						<Text style={[styles.textStyle, { color: "black" }]}>Cancel</Text>
					</Pressable>
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
		right: 10,
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

	errorText: {
		color: "red",
		fontWeight: "600",
		marginLeft: 5,
	},
});
