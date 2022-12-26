import React, { useState, useEffect }  from 'react'
import {
	Divider,
	Container,
	Typography,
	Box,
	TextField,
	Fab,
	Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useDispatch, useSelector } from 'react-redux';
import { selectTasks, addTask } from "./redux/reducers/taskSlice"

import iu_logo from "./images/logo_iu.svg"
import logistic_logo from "./images/logistic_icon.svg"
import TaskInput from "./components/TaskInput"

const App = () => {
	const [startDate, setStartDate] = useState(new Date());

	const { tasks } = useSelector(selectTasks)
	const dispatch = useDispatch()

	console.log(tasks)

	const handleAddTask = () => {
		dispatch(addTask())
	}

	return (
		<Container>
			<Box
				display="flex"
				justifyContent="flex-start"
				alignItems="center"
				gap={3}
				mt={5} mb={2}
			>
				<img src={iu_logo} alt="IU logo"/>
				<img src={logistic_logo} alt="IU logo"/>
				<Typography
					fontWeight={700}
					fontSize="30px"
					lineHeight="35px"
				>
					CRITICAL PATH FINDER
				</Typography>
			</Box>
			<Divider />

			<Box
				mt={5}
			>
				<Typography
					fontWeight={600}
					fontSize="15px"
					lineHeight="18px"
					mb={1}
				>
					Start date
				</Typography>

				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DatePicker
						renderInput={(props) => <TextField {...props} /> }
						inputFormat="DD/MM/YYYY"
						value={startDate}
						onChange={(newValue) => setStartDate(new Date(newValue))}
					/>
				</LocalizationProvider>
			</Box>

			{tasks.map(item => <TaskInput key={item.id} task_id={item.id} />)}

			<Box mt={4} mb={7}>
				<Fab size="small" color="default" aria-label="add" onClick={handleAddTask}>
					<AddIcon />
				</Fab>
			</Box>

			<Divider />
			<Box mt={2} mb={15} display="flex" gap={2}>
				<Button variant="contained">Calculate</Button>
				<Button variant="contained" endIcon={<SendIcon />}>
					Send Email
				</Button>
			</Box>
		</Container>
	);
}

export default App;
