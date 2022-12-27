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
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useDispatch, useSelector } from 'react-redux';
import { selectTasks, addTask } from "./redux/reducers/taskSlice"

import iu_logo from "./images/logo_iu.svg"
import logistic_logo from "./images/logistic_icon.svg"
import TaskInput from "./components/TaskInput"

import { MyGraph } from "./utils"

const options = {
	autoResize: true,
	layout: {
		hierarchical: false,
	},
	edges: {
		color: "#000000",
	},
};

const palettes = ["#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"]
const criticalColor = "#fd7f6f"
let colorIndex = 0

const randomColor = () => {
	colorIndex = (colorIndex + 1) % palettes.length
	return palettes[colorIndex]
}

const App = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [graph, setGraph] = useState({
		nodes: [],
		edges: [],
	});

	const { tasks } = useSelector(selectTasks)
	const dispatch = useDispatch()

	console.log(tasks)

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
				color: randomColor()

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
		console.log(res, myGraph.critical_path)
		console.log("shce", myGraph.get_mailing_schedule())

		let criticalPathCheck = new Set()
		myGraph.critical_path.forEach(node => criticalPathCheck.add(node.name))
		for (let i in nodes) {
			if (criticalPathCheck.has(nodes[i].id)) {
				nodes[i].color = criticalColor
			}
		}

		setGraph({nodes, edges})
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

			{graph.nodes.length > 0 ?<Graph graph={graph} options={options} style={{ height: "350px", width: "70%" }} /> : null}

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
