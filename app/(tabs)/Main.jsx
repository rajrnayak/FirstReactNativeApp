import { Text, View, Pressable, StyleSheet, ToastAndroid, ScrollView } from "react-native";
import { useState } from "react";

export default function Main() {
	const [data, setData] = useState({
		firstAmount: "",
		secondAmount: "",
		operator: "",
	});

	let buttons = [
		{
			PressableStyle: styles.button,
			pressFunction: () => clearData(),
			textStyle: [styles.buttonText, { color: "#e4674a" }],
			textName: "AC",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => eraseLastOne(),
			textStyle: [styles.buttonText, { color: "#68b31a", marginBottom: 15 }],
			textName: "←",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler("%", true),
			textStyle: [styles.buttonText, { color: "#68b31a" }],
			textName: "%",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler("÷", true),
			textStyle: [styles.buttonText, { color: "#68b31a" }],
			textName: "÷",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(7),
			textStyle: styles.buttonText,
			textName: "7",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(8),
			textStyle: styles.buttonText,
			textName: "8",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(9),
			textStyle: styles.buttonText,
			textName: "9",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler("×", true),
			textStyle: [styles.buttonText, { color: "#68b31a", fontSize: 40 }],
			textName: "×",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(4),
			textStyle: styles.buttonText,
			textName: "4",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(5),
			textStyle: styles.buttonText,
			textName: "5",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(6),
			textStyle: styles.buttonText,
			textName: "6",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler("-", true),
			textStyle: [styles.buttonText, { color: "#68b31a" }],
			textName: "-",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(1),
			textStyle: styles.buttonText,
			textName: "1",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(2),
			textStyle: styles.buttonText,
			textName: "2",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(3),
			textStyle: styles.buttonText,
			textName: "3",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler("+", true),
			textStyle: [styles.buttonText, { color: "#68b31a" }],
			textName: "+",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler("+/-"),
			textStyle: styles.buttonText,
			textName: "+/-",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(0),
			textStyle: styles.buttonText,
			textName: "0",
		},
		{
			PressableStyle: styles.button,
			pressFunction: () => enterHandler(".", "dot"),
			textStyle: styles.buttonText,
			textName: ".",
		},
		{
			PressableStyle: [styles.button, { backgroundColor: "#68b31a" }],
			pressFunction: () => giveAnswer(),
			textStyle: [styles.buttonText, { color: "white" }],
			textName: "=",
		},
	];

	function enterHandler(value, isOperator = false) {
		if (value == "+/-") {
			if (data.operator == "") {
				data.firstAmount != "" ? setData({ ...data, firstAmount: `${-data.firstAmount}` }) : ToastAndroid.showWithGravity("Please Enter Number First!", ToastAndroid.SHORT, ToastAndroid.CENTER);
			} else {
				data.secondAmount != "" ? setData({ ...data, secondAmount: `${-data.secondAmount}` }) : ToastAndroid.showWithGravity("Please Enter Number First!", ToastAndroid.SHORT, ToastAndroid.CENTER);
			}
			return;
		}

		if (isOperator == "dot") {
			if (data.operator == "") {
				if (data.firstAmount.indexOf(value) == "-1") {
					value = data.firstAmount == "" ? 0 + value : value;
					setData({ ...data, firstAmount: data.firstAmount + value });
				}
			} else {
				if (data.secondAmount.indexOf(value) == "-1") {
					value = data.secondAmount == "" ? 0 + value : value;
					setData({ ...data, secondAmount: data.secondAmount + value });
				}
			}
			return;
		}

		if (isOperator) {
			if (data.firstAmount == "") {
				ToastAndroid.showWithGravity("Please Enter Operator First!", ToastAndroid.SHORT, ToastAndroid.CENTER);
				return;
			}

			if (data.secondAmount == "") {
				setData({ ...data, operator: value });
			} else {
				giveAnswer(value);
			}
			return;
		}

		if (data.operator == "") {
			setData({ ...data, firstAmount: data.firstAmount.concat(value) });
		} else {
			setData({ ...data, secondAmount: data.secondAmount.concat(value) });
		}
	}

	function giveAnswer(operator = "") {
		let first = parseFloat(data.firstAmount);
		let second = parseFloat(data.secondAmount);
		let total = "";

		switch (data.operator) {
			case "+":
				total = first + second;
				break;
			case "-":
				total = first - second;
				break;
			case "×":
				total = first * second;
				break;
			case "÷":
				total = first / second;
				break;
			case "%":
				total = first % second;
				break;
			default:
				break;
		}

		if (data.secondAmount != "" && data.firstAmount != "") {
			setData({ ...data, firstAmount: `${total}`, operator: operator, secondAmount: "" });
		}
	}

	function clearData() {
		setData({
			firstAmount: "",
			secondAmount: "",
			operator: "",
		});
	}

	function eraseLastOne() {
		if (data.secondAmount != "") {
			setData({ ...data, secondAmount: data.secondAmount.slice(0, -1) });
		} else if (data.operator != "") {
			setData({ ...data, operator: data.operator.slice(0, -1) });
		} else if (data.firstAmount != "") {
			setData({ ...data, firstAmount: data.firstAmount.slice(0, -1) });
		}
	}

	return (
		<View style={{ flex: 1, padding: 10 }}>
			<View style={{ flex: 1, justifyContent: "center" }}>
				<ScrollView
					ref={(ref) => {
						this.scrollView = ref;
					}}
					onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}>
					<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
						<Text style={styles.displayText}>{data.firstAmount}</Text>
						<Text style={[styles.displayText, { color: "#68b31a" }]}>{data.operator}</Text>
						<Text style={styles.displayText}>{data.secondAmount}</Text>
					</View>
				</ScrollView>
			</View>
			<View
				style={{
					borderBottomColor: "black",
					borderBottomWidth: 0.5,
					marginBottom: 10,
					marginTop: 10,
				}}
			/>
			<View style={{ flex: 1.3 }}>
				<View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: 18, columnGap: 20, padding: 10 }}>
					{buttons.map((item, index) => (
						<Pressable
							key={index}
							style={item.PressableStyle}
							onPress={() => {
								item.pressFunction();
							}}>
							<Text style={item.textStyle}>{item.textName}</Text>
						</Pressable>
					))}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#f8f8f8",
		width: 77,
		height: 75,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		fontSize: 35,
	},
	displayText: {
		fontSize: 50,
	},
});
