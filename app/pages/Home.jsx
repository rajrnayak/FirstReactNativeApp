import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home({ navigation }) {
	return (
		<>
			<View style={{ flexDirection: "row" }}>
				<Pressable style={[Styles.button, { marginLeft: 50, marginTop: 10 }]} onPress={() => navigation.navigate("User")}>
					<Text style={Styles.buttonText}>User</Text>
				</Pressable>
				<Pressable style={[Styles.button, { marginLeft: 20, marginTop: 10, backgroundColor: "powderblue" }]} onPress={() => navigation.navigate("Main")}>
					<Text style={Styles.buttonText}>Calculator</Text>
				</Pressable>
			</View>
		</>
	);
}

const Styles = StyleSheet.create({
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
});
