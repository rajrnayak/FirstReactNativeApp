import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Form({ navigation }) {
	const [user, setUser] = useState({
		first_name: "",
		last_name: "",
		age: "",
		city: "",
	});

	return (
		<View style={{ gap: 15, padding: 10, borderWidth: 0.5, margin: 10, borderRadius: 10, backgroundColor: "white" }}>
			<View style={{ gap: 15 }}>
				<Text style={Styles.buttonText}>First Name :</Text>
				<TextInput style={[Styles.textInput, { height: 40 }]} placeholder="Abc.." value={user.first_name} onChangeText={(text) => setUser({ ...user, first_name: text })} />
			</View>
			<View style={{ gap: 15 }}>
				<Text style={Styles.buttonText}>Last Name : </Text>
				<TextInput style={[Styles.textInput, { height: 40 }]} placeholder="Xyz.." value={user.last_name} onChangeText={(text) => setUser({ ...user, last_name: text })} />
			</View>
			<View style={{ gap: 15 }}>
				<Text style={Styles.buttonText}>Age : </Text>
				<TextInput style={[Styles.textInput, { height: 40 }]} placeholder="Xyz.." value={user.age} onChangeText={(text) => setUser({ ...user, age: text })} />
			</View>
			<View style={{ gap: 15 }}>
				<Text style={Styles.buttonText}>City : </Text>
				<Picker placeholder="Start Year" selectedValue={user.city} onValueChange={(itemValue, itemIndex) => setUser({ ...user, city: itemValue })}>
					<Picker.Item label="select any one" value="" />
					<Picker.Item label="Kalol" value="kalol" />
					<Picker.Item label="Kadi" value="kadi" />
					<Picker.Item label="Ahmedabad" value="ahmedabad" />
				</Picker>
			</View>
			<Pressable style={[Styles.button]} onPress={() => navigation.navigate("User", user)}>
				<Text style={Styles.buttonText}>Submit</Text>
			</Pressable>
		</View>
	);
}

const Styles = StyleSheet.create({
	button: {
		backgroundColor: "#5AB2FF",
		width: 80,
		height: 40,
		borderRadius: 7,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		fontSize: 20,
	},
	textInput: {},
});
