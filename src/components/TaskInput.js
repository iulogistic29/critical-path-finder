import React, { useState, useEffect }  from 'react'
import {
	Divider,
	IconButton,
	Typography,
	Box,
	TextField,
	Select,
	MenuItem,
	FormGroup,
	FormControlLabel,
	Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { selectTasks, removeTask, updateTask } from "../redux/reducers/taskSlice"

const TaskInput = ({ task_id }) => {
	const [emailError, setEmailError] = useState(false)

	const { tasks } = useSelector(selectTasks)
	const dispatch = useDispatch()
	const data = tasks.find(item => item.id === task_id)


	const handleDuration = (e) => {
		if (e.target.value == "") {
			dispatch(updateTask({
				id: task_id,
				data: {
					duration: ""
				}
			}))
			return
		}

		dispatch(updateTask({
			id: task_id,
			data: {
				duration: parseInt(e.target.value)
			}
		}))
	}

	const handleDurationBlur = () => {
		if (!data) return
		if (data.duration === "") {
			dispatch(updateTask({
				id: task_id,
				data: {
					duration: 1
				}
			}))
			return
		}

		if (data.duration <= 0) {
			dispatch(updateTask({
				id: task_id,
				data: {
					duration: 1
				}
			}))
		}
	}

	const checkEmail = (e) => {
		const error = !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)
		setEmailError(error)
		if (!error) {
		}
	}

	const handleCheckbox = (e) => {
		if (!data) return
		const id = parseInt(e.target.value)
		let result = []
		if (data.precedents.find(item => item == id)) {
			// remove if exist
			result = data.precedents.filter(item => item !== id)
		} else{
			// add if not exist
			result = [...data.precedents, id]
		}

		dispatch(updateTask({
			id: task_id,
			data: {
				precedents: result
			}
		}))
	}

	const getPrecedentString = () => {
		let nameDict = {}
		tasks.forEach(item => nameDict[item.id] = item.name)

		try {
			let result = nameDict[data.precedents[0]]
			for (let i = 1; i < data.precedents.length; i++) {
				result += ", " + nameDict[data.precedents[i]]
			}
			return result
		} catch(e) {
			console.log(e.message)
		}
		return ""
	}

	const handleName = (e) => {
		dispatch(updateTask({
			id: task_id,
			data: {
				name: e.target.value
			}
		}))
	}

	const handleEmail = (e) => {
		dispatch(updateTask({
			id: task_id,
			data: {
				email: e.target.value
			}
		}))
	}

	return (
		<Box
			mt={5}
			display="flex"
			justifyContent="flex-start"
			alignItems="center"
			gap={3}
		>
			<Box>
				<Typography
					fontWeight={600}
					fontSize="15px"
					lineHeight="18px"
					mb={1}
				>
					Task Name
				</Typography>
				<TextField
					placeholder="Enter task name"
					value={data && data.name}
					onChange={handleName}
				/>
			</Box>

			<Box>
				<Typography
					fontWeight={600}
					fontSize="15px"
					lineHeight="18px"
					mb={1}
				>
					Precendents
				</Typography>
				<FormGroup sx={{ width: 250 }} size="small">
					<Select
						value=""
						displayEmpty
					>
						<MenuItem disabled value="">
							{data && data.precedents.length > 0 ? getPrecedentString() : "Choose previous task(s)"}
						</MenuItem>

						<Box
							display="flex"
							flexDirection="column"
							padding={2}
						>
							{tasks.filter(item => item.id !== task_id).map(item => (
								<FormControlLabel key={item.id} control={<Checkbox checked={data.precedents.findIndex(temp => temp === item.id) !== -1} value={item.id} onChange={handleCheckbox} />} label={item.name}/>
							))}
						</Box>
					</Select>
				</FormGroup>
			</Box>

			<Box>
				<Typography
					fontWeight={600}
					fontSize="15px"
					lineHeight="18px"
					mb={1}
				>
					Duration (days)
				</Typography>
				<TextField
					placeholder="Number of days"
					type="number"
					value={data && data.duration}
					onChange={handleDuration}
					onBlur={handleDurationBlur}
				/>
			</Box>

			<Box>
				<Typography
					fontWeight={600}
					fontSize="15px"
					lineHeight="18px"
					mb={1}
				>
					Email {emailError ? <span className="invalid-input">Invalid Email</span> : null}
				</Typography>
				<TextField
					error={emailError}
					placeholder="Enter your email"
					type="email"
					value={data && data.email}
					onChange={handleEmail}
					onBlur={checkEmail}
				/>
			</Box>

			<Box pt={3}>
				<IconButton aria-label="delete" onClick={() => dispatch(removeTask(task_id))}>
					<DeleteIcon />
				</IconButton>
			</Box>
		</Box>
	);
}

export default TaskInput;

