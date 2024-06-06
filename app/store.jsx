import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./pages/features/counterSlice";
import studentReducer from "./pages/features/StudentSlice";

export default configureStore({
	reducer: {
		counter: counterReducer,
		studentField: studentReducer,
	},
});
