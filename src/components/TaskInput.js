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
	const [precedents, setPrecedents] = useState([])
	const [duration, setDuration] = useState(1)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [emailError, setEmailError] = useState(false)

	const { tasks } = useSelector(selectTasks)
	const dispatch = useDispatch()

	useEffect(() => {
		const data = tasks.find(item => item.id === task_id)
		if (data) {
			setName(data.name)
			setEmail(data.email)
			setDuration(data.duration)
			setPrecedents(data.precedents)
		}
	}, [])


	useEffect(() => {
		dispatch(updateTask({
			id: task_id,
			data: { name, email, duration, precedents }
		}))
	}, [name, email, duration, precedents])

	const handleDuration = (e) => {
		if (e.target.value == "") {
			setDuration("")
		}

		setDuration(parseInt(e.target.value))
	}

	const handleDurationBlur = () => {
		if (duration === "") {
			setDuration(0)
			return
		}

		if (duration <= 0) {
			setDuration(1)
		}
	}

	const checkEmail = (e) => {
		const error = !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)
		setEmailError(error)
		if (!error) {
		}
	}

	const handleCheckbox = (e) => {
		const id = parseInt(e.target.value)
		if (precedents.find(item => item == id)) {
			// remove if exist
			setPrecedents(precedents.filter(item => item !== id))
		} else{
			// add if not exist
			setPrecedents([...precedents, id])
		}
	}

	const getPrecedentString = () => {
		let nameDict = {}
		tasks.forEach(item => nameDict[item.id] = item.name)

		try {
			let result = nameDict[precedents[0]]
			for (let i = 1; i < precedents.length; i++) {
				result += ", " + nameDict[precedents[i]]
			}
			return result
		} catch(e) {
			console.log(e.message)
		}
		return ""
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
					value={name}
					onChange={e => setName(e.target.value)}
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
				<FormGroup>
					<Select
						value=""
						displayEmpty
					>
						<MenuItem disabled value="">
							{precedents.length === 0 ? "Choose previous task(s)" : getPrecedentString()}
						</MenuItem>

						<Box
							display="flex"
							flexDirection="column"
							padding={2}
						>
							{tasks.filter(item => item.id !== task_id).map(item => (
								<FormControlLabel key={item.id} control={<Checkbox checked={precedents.findIndex(temp => temp === item.id) !== -1} value={item.id} onChange={handleCheckbox} />} label={item.name}/>
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
					value={duration}
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
					value={email}
					onChange={e => setEmail(e.target.value)}
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

