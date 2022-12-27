import React, { useState, useEffect }  from 'react'
import Graph from "react-graph-vis";
import {
	Divider,
	Container,
	Typography,
	Box,
	TextField,
	Fab,
	Button,
} from '@mui/material';
import moment from "moment"
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useDispatch, useSelector } from 'react-redux';
import { selectTasks, addTask } from "./redux/reducers/taskSlice"

import iu_logo from "./images/logo_iu.svg"
import logistic_logo from "./images/logistic_icon.svg"
import TaskInput from "./components/TaskInput"
import ScheduleTable from "./components/ScheduleTable"

import { MyGraph } from "./utils"

const options = {
	autoResize: true,
	layout: {
		improvedLayout:true,
		hierarchical: false,
	},
	edges: {
		color: "#000000",
	},
};

const palettes = ["#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"]
const nodeColor = "#f7f7f7"
const criticalColor = "#ffee65"


const App = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [findPathStatus, setFindPathStatus] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [schedule, setSchedule] = useState([]);
	const [graph, setGraph] = useState({
		nodes: [],
		edges: [],
	});

	const { tasks } = useSelector(selectTasks)
	const dispatch = useDispatch()

	const handleAddTask = () => {
		dispatch(addTask())
	}

	const showGraph = () => {
		let nodes = []
		let edges = []
		let sample = []
		tasks.forEach(item => {
			nodes.push({
				id: item.id,
				label: item.name,
				color: nodeColor

			})

			item.precedents.forEach(parentId => edges.push({
				from: parentId,
				to: item.id
			}))

			sample.push([item.id, item.precedents, item.duration])
		})

		let myGraph = new MyGraph()
		myGraph.create_graph_from_sample(sample)
		let res = myGraph.find_critical_path()

		let criticalPathCheck = new Set()
		myGraph.critical_path.forEach(node => criticalPathCheck.add(node.name))
		for (let i in nodes) {
			if (criticalPathCheck.has(nodes[i].id)) {
				nodes[i].color = criticalColor
			}
		}

		setErrorMessage(res.message)
		setFindPathStatus(res.success)
		setGraph({nodes, edges})


		if (res.success) {
			// get the name dict
			let taskDict = {}
			tasks.forEach(item => taskDict[item.id] = item)

			// get the schedule
			let rawSchedule = myGraph.get_mailing_schedule()
			let refine = []
			for (let i = 0; i < schedule.length; i++) {
				let data = rawSchedule[i]
				let task = taskDict[data[1]]
				let startingDate = new Date(startDate.getTime() + data[0] * 1000 * 3600 * 24)
				let endingDate = new Date(startingDate.getTime() + task.duration * 1000 * 3600 * 24)

				refine.push([i+1, task.name, moment(startingDate).format("DD/MM/YYYY"), moment(endingDate).format("DD/MM/YYYY")])
			}

			setSchedule(refine)
		}
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

			<Box mt={4} mb={2}>
				<Fab size="small" color="default" aria-label="add" onClick={handleAddTask}>
					<AddIcon />
				</Fab>
			</Box>

			<Typography variant="h5" mt={5}>Task Graph</Typography>
			<Typography fontWeight="bold" color={findPathStatus ? "green" : "red"}>{errorMessage}</Typography>
			{graph.nodes.length > 0 ?<Graph graph={graph} options={options} style={{ height: "640px", width: "70%" }} /> : null}

			<ScheduleTable schedule={schedule} />

			<br/>
			<Divider />
			<Box mt={2} mb={15} display="flex" gap={2}>
				<Button variant="contained" onClick={showGraph}>Calculate</Button>
				<Button variant="contained" endIcon={<SendIcon />}>
					Send Email
				</Button>
			</Box>
		</Container>
	);
}

export default App;
