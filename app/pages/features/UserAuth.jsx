import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const userAuthSlice = createSlice({
	name: "userAuth",
	initialState: {
		user: null,
		api_token: null,
		is_login: false,
	},
	reducers: {
		AddUserAuth: (state, action) => {
			action.payload.user ? (state.user = action.payload.user) : "";
			action.payload.api_token ? (state.api_token = action.payload.api_token) : "";
			state.is_login = action.payload.is_login;
			let obj = {
				user: state.user,
				api_token: state.api_token,
				is_login: state.is_login,
			};
			console.log(obj);
			AsyncStorage.setItem("userAuth", JSON.stringify(obj));
		},
		DeleteUserAuth: (state) => {
			state.user = null;
			state.api_token = null;
			state.is_login = false;
		},
	},
});

export const { AddUserAuth, DeleteUserAuth } = userAuthSlice.actions;

export default userAuthSlice.reducer;
