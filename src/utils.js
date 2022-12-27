class Node {
	constructor(name, predec_list=[], duration=0) {
		this.name = name
        this.predec_list = predec_list
        this.duration = duration

        this.ancestor_list = []
        this.earliest_start = -1
        this.earliest_finish = -1
        this.latest_start = -1
        this.latest_finish = -1
	}

	update_ancestor_for_predec() {
		for (let i = 0; i < this.predec_list.length; i++) {
			this.predec_list[i].add_ancestor(this)
		}
	}

	add_ancestor(node) {
		this.ancestor_list.push(node)
	}

	is_head() {
		return this.predec_list.length == 0
	}

	is_tail() {
		return this.ancestor_list.length == 0
	}

	in_critical_path() {
		return this.earliest_finish != -1 && this.earliest_finish == this.latest_finish
	}
}


export class MyGraph {
	constructor() {
		this.node_map = {}
		this.critical_path = []
	}

	find_critical_path() {
		if (this.isCyclic()) {
			return {
				success: false,
				message: "Cannot find critical path. There is a cycle in the activity graph."
			}
		}

		this.forward()
		this.backward()

		let head_list = this.find_head()
		let node = null
		head_list.forEach(n => {
			if (n.earliest_finish == n.latest_finish)
				node = n
		})

		if (!node)
			return {
				success: false,
				message: "No head found"
			}

		this.critical_path = [node]
		while (!node.is_tail()) {
			for (let i = 0; i < node.ancestor_list.length; i++) {
				let p = node.ancestor_list[i]
				if (p.in_critical_path()) {
					this.critical_path.push(p)
					node = p
					break
				}
			}
		}

		return {
			success: true,
			message: ""
		}
	}

	forward() {
		let queue = this.find_head()
		if (queue.length == 0) {
			return null
		}

		for (let i in queue) {
			let node = queue[i]
			node.earliest_start = 0
			node.earliest_finish = node.duration
		}

		while (queue.length > 0) {
			let node = queue.shift()

			if (node.predec_list.length == 0) {
				queue.push(...node.ancestor_list)
				continue
			}

            // check if all of its predecessors have earliest_finish
			let valid = node.predec_list.every(p => p.earliest_finish != -1)
			if (!valid) {
				// move the node to the end of the queue to process later
				queue.push(node)
				continue
			}

            // add this node ancestors to the queue to process later
            queue.push(...node.ancestor_list)

			if (node.predec_list.length == 1) {
				node.earliest_start = node.predec_list[0].earliest_finish
			} else {
				let arr = node.predec_list.map(p => p.earliest_finish)
                node.earliest_start = Math.max(...arr)
			}
			node.earliest_finish = node.earliest_start + node.duration
		}
	}

	backward() {
		let queue = this.find_tail()
		if (queue.length === 0) {
			return
		}

		for (let i in queue) {
			let node = queue[i]
            node.latest_finish = node.earliest_finish
            node.latest_start = node.earliest_start
		}

		while (queue.length > 0) {
			let node = queue.shift()

			if (node.ancestor_list.length === 0) {
				queue.push(...node.predec_list)
				continue
			}
            // check if all of its ancestors have latest_start
			let valid = node.ancestor_list.every(p => p.latest_start != -1)
			if (!valid) {
                // move the node to the end of the queue to process later
				queue.push(node)
				continue
			}

            // add this node ancestors to the queue to process later
			queue.push(...node.predec_list)
			if (node.ancestor_list.length === 1) {
                node.latest_finish = node.ancestor_list[0].latest_start
			} else {
				let arr = node.ancestor_list.map(p => p.latest_start)
                node.latest_finish = Math.min(...arr)
			}

            node.latest_start = node.latest_finish - node.duration
		}
	}

	find_head() {
		let head_list = []
		for (const [key, value] of Object.entries(this.node_map)) {
			if (value.is_head()) {
				head_list.push(value)
			}
		}

		return head_list
	}

	find_tail() {
		let tail_list = []
		for (const [key, value] of Object.entries(this.node_map)) {
			if (value.is_tail()) {
				tail_list.push(value)
			}
		}

		return tail_list
	}

	isCyclicUtil(name) {
		this.visited[name] = true
		this.recStack[name] = true

		for (let i in this.node_map[name].ancestor_list) {
			let neighbour = this.node_map[name].ancestor_list[i]
			if (!this.visited[neighbour.name]) {
				if (this.isCyclicUtil(neighbour.name))
					return true
			} else if (this.recStack[neighbour.name])
				return true
		}

		this.recStack[name] = false
		return false
	}

    // Returns true if graph is cyclic else false
	isCyclic() {
		this.visited = {}
		for (const [key, value] of Object.entries(this.node_map)) {
			this.visited[key] = false
		}

		this.recStack = {}
		for (const [key, value] of Object.entries(this.node_map)) {
			this.recStack[key] = false
		}

		for (const [key, value] of Object.entries(this.node_map)) {
			if (!this.visited[key]) {
				if (this.isCyclicUtil(key))
					return true
			}
		}

		return false
	}

	create_graph_from_sample(sample) {
		let item;
		for (let i in sample) {
			item = sample[i]
            this.node_map[item[0]] = new Node(item[0], [], item[2])
		}

		for (let i in sample) {
			item = sample[i]
			this.node_map[item[0]].predec_list = item[1].map(name => this.node_map[name])
            this.node_map[item[0]].update_ancestor_for_predec()
		}
	}

	get_mailing_schedule() {
		if ((this.critical_path.length === 0) || (this.critical_path[this.critical_path.length-1].earliest_start == -1)) {
			return null
		}

		let days = Array.apply(null, Array(this.critical_path[this.critical_path.length-1].earliest_start + 1)).map(function () {})
		for (const [name, node] of Object.entries(this.node_map)) {
			let mail_day = node.earliest_start
			if (days[mail_day]) {
				days[mail_day].push(node)
			} else {
				days[mail_day] = [node]
			}
		}

		return days
	}
}
