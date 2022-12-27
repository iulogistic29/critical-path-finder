import { createSlice } from "@reduxjs/toolkit";

const sample1 = [
	{
		id: 1,
		name: "A",
		precedents: [],
		duration: 3,
		email: "",
	},
	{
		id: 2,
		name: "B",
		precedents: [1],
		duration: 4,
		email: "",
	},
	{
		id: 3,
		name: "C",
		precedents: [1],
		duration: 2,
		email: "",
	},
	{
		id: 4,
		name: "D",
		precedents: [2],
		duration: 5,
		email: "",
	},
	{
		id: 5,
		name: "E",
		precedents: [3],
		duration: 1,
		email: "",
	},
	{
		id: 6,
		name: "F",
		precedents: [3],
		duration: 2,
		email: "",
	},
	{
		id: 7,
		name: "G",
		precedents: [4, 5],
		duration: 4,
		email: "",
	},
	{
		id: 8,
		name: "H",
		precedents: [6, 7],
		duration: 3,
		email: "",
	},
]

const initialState = {
	tasks: sample1
	// tasks: [{
	// 	id: 1,
	// 	name: "Task 1",
	// 	precedents: [],
	// 	duration: 1,
	// 	email: "",
	// }],
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
			for (let i = 0; i < newArr.length; i++) {
				newArr[i].precedents = newArr[i].precedents.filter(x => x !== action.payload)
			}
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

