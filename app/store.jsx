import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./pages/features/counterSlice";
import studentReducer from "./pages/features/StudentSlice";
import userAuth from "./pages/features/UserAuth";

export default configureStore({
	reducer: {
		counter: counterReducer,
		studentField: studentReducer,
		userAuth: userAuth,
	},
});
