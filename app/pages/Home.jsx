import { StyleSheet, Text } from "react-native";
import { useEffect } from "react";
import * as SQLite from "expo-sqlite";

export default function Home() {
	useEffect(() => {
		dataBase();
	}, []);

	const dataBase = async () => {
		const db = await SQLite.openDatabaseAsync("toDoList");
		await db.execAsync(`
			PRAGMA journal_mode = WAL;
			CREATE TABLE IF NOT EXISTS tasks (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				task VARCHAR(30) NOT NULL,
				description VARCHAR(150) NOT NULL,
				use VARCHAR(20) NOT NULL,
				date DATETIME(30) NOT NULL
			);
		`);
	};

	return (
		<>
			<Text style={styles.text}>Home</Text>
		</>
	);
}

const styles = StyleSheet.create({
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
