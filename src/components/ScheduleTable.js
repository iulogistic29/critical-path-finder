import React, { useState, useEffect }  from 'react'
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography
} from '@mui/material';


const ScheduleTable = ({ schedule }) => {
	console.log(schedule)
	return (
		<Box width="100%" maxWidth="700px" mb={3}>
			<Typography variant="h5" mb={2}>Task Schedule</Typography>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>No.</TableCell>
							<TableCell>Task Name</TableCell>
							<TableCell>Starting Date</TableCell>
							<TableCell>Ending Date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{schedule.map(row => (
							<TableRow
								key={row[0]}
								sx={{
									"&:last-child td, &:last-child th": { border: 0 }
								}}
							>
								<TableCell align="left">{row[0]}</TableCell>
								<TableCell align="left">{row[1]}</TableCell>
								<TableCell align="left">{row[2]}</TableCell>
								<TableCell align="left">{row[3]}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}

export default ScheduleTable
