import { Text, TextInput, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { onChange } from "./StudentSlice";
import { Picker } from "@react-native-picker/picker";

export default function StudentForm() {
	const student = useSelector((state) => state.studentField);
	const dispatch = useDispatch();
	return (
		<>
			<View style={{ margin: 15, gap: 20 }}>
				<View>
					<Text>Enter First Name :</Text>
					<TextInput placeholder="What do you want to do?" onChangeText={(text) => dispatch(onChange({ value: text, name: "first_name" }))} value={student.first_name} />
				</View>

				<View>
					<Text>Enter Last Name :</Text>
					<TextInput placeholder="What do you want to do?" onChangeText={(text) => dispatch(onChange({ value: text, name: "last_name" }))} value={student.last_name} />
				</View>

				<View>
					<Text>Enter Last Name :</Text>
					<Picker onValueChange={(text) => dispatch(onChange({ value: text, name: "city" }))} selectedValue={student.city}>
						<Picker.Item label="Select Any One" value="" />
						<Picker.Item label="Kalol" value="kalol" />
						<Picker.Item label="Kadi" value="kadi" />
					</Picker>
				</View>
			</View>
		</>
	);
}
