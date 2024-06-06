import { createSlice } from "@reduxjs/toolkit";

export const studentSlice = createSlice({
	name: "studentField",
	initialState: {
		first_name: "",
		last_name: "",
		city: "",
		gender: "",
	},
	reducers: {
		onChange: (state, action) => {
			const fieldName = action.payload.name;
			const value = action.payload.value;

			state[fieldName] = value;
		},
	},
});

export const { onChange } = studentSlice.actions;

export default studentSlice.reducer;
