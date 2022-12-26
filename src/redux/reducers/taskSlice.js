import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	tasks: [{
		id: 1,
		name: "Task 1",
		precedents: [],
		duration: 1,
		email: "",
	}],
}

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) =>{
			let newId = state.tasks.length > 0 ? state.tasks[state.tasks.length-1].id + 1 : 1
			state.tasks.push({
				id: newId,
				name: "Task " + newId,
				precedents: [],
				duration: 1,
				email: "",
			})
        },
        removeTask: (state, action) =>{
			let newArr = state.tasks.filter(item => item.id !== action.payload)
			state.tasks = newArr
        },
        updateTask: (state, action) =>{
			const { id, data } = action.payload
			const index = state.tasks.findIndex(item => item.id === id)
			if (index !== -1) {
				state.tasks[index] = {
					...state.tasks[index],
					...data
				}
			}
        },
    },
})

export const selectTasks = (state) => state.tasks
export const { addTask, removeTask, updateTask } = taskSlice.actions
export default taskSlice.reducer

