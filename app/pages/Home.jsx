import { StyleSheet, Text } from "react-native";

export default function Home() {
	return (
		<>
			<Text style={Styles.text}>Home</Text>
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
	text: {
		margin: "auto",
		fontSize: 30,
		fontWeight: "bold",
	},
});
