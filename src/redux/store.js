import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

import taskSlice from "./reducers/taskSlice"

const rootReducer = combineReducers({
	tasks: taskSlice,
})

export const store = configureStore({
  reducer: rootReducer
})
