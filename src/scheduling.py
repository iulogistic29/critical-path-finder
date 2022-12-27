sample1 = [
    ["A", [], 3],
    ["B", ["A"], 4],
    ["C", ["A"], 2],
    ["D", ["B"], 5],
    ["E", ["C"], 1],
    ["F", ["C"], 2],
    ["G", ["D", "E"], 4],
    ["H", ["F", "G"], 3],
]

# multiple end activities (G, H)
sample2 = [
    ["A", [], 3],
    ["B", ["A"], 4],
    ["C", ["A"], 2],
    ["D", ["B"], 5],
    ["E", ["C"], 1],
    ["F", ["C"], 2],
    ["G", ["D", "E"], 4],
    ["H", ["F", "D"], 3],
]

# multiple start activities (A, B)
sample3 = [
    ["A", [], 3],
    ["B", [], 4],
    ["C", ["A"], 2],
    ["D", ["B"], 5],
    ["E", ["C"], 1],
    ["F", ["C"], 2],
    ["G", ["D", "E"], 4],
    ["H", ["F", "G"], 3],
]

# multiple start activities (A, B) and
# multiple end activities (G, H)
sample4 = [
    ["A", [], 3],
    ["B", [], 4],
    ["C", ["A"], 2],
    ["D", ["B"], 5],
    ["E", ["C"], 1],
    ["F", ["C"], 2],
    ["G", ["D", "E"], 4],
    ["H", ["F", "D"], 3],
]

# cycle: B -> D -> G -> H -> B
sample5 = [
    ["A", [], 3],
    ["B", ["A", "H"], 4],
    ["C", ["A"], 2],
    ["D", ["B"], 5],
    ["E", ["C"], 1],
    ["F", ["C"], 2],
    ["G", ["D", "E"], 4],
    ["H", ["F", "H"], 3],
]

SAMPLE = sample1


def input_integer(prompt):
    value = 0
    while True:
        try:
            value = int(input(prompt))
            break
        except ValueError:
            print("Invalid input! Expected an integer.")
    return value


def arr_to_str(arr, sep=", "):
    if len(arr) == 0:
        return "-"

    result = ""
    for i, node in enumerate(arr):
        if i > 0:
            result += sep
        result += node.name
    return result


class Node:
    def __init__(self, name, predec_list=[], duration=0):
        self.name = name
        self.predec_list = predec_list
        self.duration = duration

        self.ancestor_list = []
        self.earliest_start = -1
        self.earliest_finish = -1
        self.latest_start = -1
        self.latest_finish = -1

    def update_ancestor_for_predec(self):
        for node in self.predec_list:
            node.add_ancestor(self)

    def add_ancestor(self, node):
        self.ancestor_list.append(node)

    def is_head(self):
        return len(self.predec_list) == 0

    def is_tail(self):
        return len(self.ancestor_list) == 0

    def in_critical_path(self):
        return self.earliest_finish != -1 and self.earliest_finish == self.latest_finish

    def __str__(self):
        pred_str = arr_to_str(self.predec_list)
        return f"{self.name:<8}  {self.duration:<8}  {pred_str}"

    def __repr__(self):
        return self.__str__()

    def info(self):
        result = "=================\n"
        result += f"{self.earliest_start:<5} {self.name:<5} {self.earliest_finish:<5}\n"
        result += f"{self.latest_start:<5} {self.duration:<5} {self.latest_finish:<5}\n"
        result += "=================\n"
        return result


class Graph:
    def __init__(self):
        self.node_map = {}
        self.critical_path = []

    def find_critical_path(self):
        if self.isCyclic():
            print("Cannot find critical path. There is a cycle in the activity graph.")
            return []

        self.forward()
        self.backward()

        head_list = self.find_head()
        node = None
        for n in head_list:
            if n.earliest_finish == n.latest_finish:
                node = n

        if node is None:
            return []

        self.critical_path = [node]
        while not node.is_tail():
            for p in node.ancestor_list:
                if p.in_critical_path():
                    self.critical_path.append(p)
                    node = p
                    break
        self.print_critical_path()

    def forward(self):
        queue = self.find_head()
        if len(queue) == 0:
            print("There is no start activity in the list.")
            return None
        for node in queue:
            node.earliest_start = 0
            node.earliest_finish = node.duration

        while len(queue) > 0:
            node = queue.pop(0)

            if len(node.predec_list) == 0:
                queue.extend(node.ancestor_list)
                continue

            # check if all of its predecessors have earliest_finish
            valid = all([p.earliest_finish != -1 for p in node.predec_list])
            if not valid:
                # move the node to the end of the queue to process later
                queue.append(node)
                continue

            # add this node ancestors to the queue to process later
            queue.extend(node.ancestor_list)

            if len(node.predec_list) == 1:
                node.earliest_start = node.predec_list[0].earliest_finish
            else:
                node.earliest_start = max([p.earliest_finish for p in node.predec_list])
            node.earliest_finish = node.earliest_start + node.duration

    def backward(self):
        queue = self.find_tail()
        if len(queue) == 0:
            print("There is no end activity in the list.")
            return

        for node in queue:
            node.latest_finish = node.earliest_finish
            node.latest_start = node.earliest_start

        while len(queue) > 0:
            node = queue.pop(0)

            if len(node.ancestor_list) == 0:
                queue.extend(node.predec_list)
                continue

            # check if all of its ancestors have latest_start
            valid = all([p.latest_start != -1 for p in node.ancestor_list])
            if not valid:
                # move the node to the end of the queue to process later
                queue.append(node)
                continue

            # add this node ancestors to the queue to process later
            queue.extend(node.predec_list)

            if len(node.ancestor_list) == 1:
                node.latest_finish = node.ancestor_list[0].latest_start
            else:
                node.latest_finish = min([p.latest_start for p in node.ancestor_list])
            node.latest_start = node.latest_finish - node.duration

    def find_head(self):
        head_list = []
        for name in self.node_map:
            if self.node_map[name].is_head():
                head_list.append(self.node_map[name])
        return head_list

    def find_tail(self):
        tail_list = []
        for name in self.node_map:
            if self.node_map[name].is_tail():
                tail_list.append(self.node_map[name])
        return tail_list

    def isCyclicUtil(self, name, visited, recStack):
        visited[name] = True
        recStack[name] = True

        for neighbour in self.node_map[name].ancestor_list:
            if not visited[neighbour.name]:
                if self.isCyclicUtil(neighbour.name, visited, recStack):
                    return True
            elif recStack[neighbour.name]:
                return True

        recStack[name] = False
        return False

    # Returns true if graph is cyclic else false
    def isCyclic(self):
        visited = {key: False for key in self.node_map}
        recStack = {key: False for key in self.node_map}
        for name in self.node_map:
            if not visited[name]:
                if self.isCyclicUtil(name, visited, recStack):
                    return True
        return False

    def create_graph_from_sample(self, sample):
        for item in sample:
            self.node_map[item[0]] = Node(name=item[0], duration=item[2])

        for item in sample:
            self.node_map[item[0]].predec_list = [self.node_map[name] for name in item[1]]
            self.node_map[item[0]].update_ancestor_for_predec()

    def create_graph_from_user_input(self):
        node_num = input_integer("Enter the number of activities: ")

        print("Input the activities' names:\n")
        for i in range(node_num):
            name = input(f"Name of activity {i+1}: ")
            self.node_map[name] = Node(name)

        print("\n==============================================")
        print("Input the activities' durations and")
        print("predecessors (separate by comma, '-' for None):")
        for name in self.node_map:
            print("\nActivity", name)
            duration = input_integer("Duration: ")
            predec_list = self.input_predecessors()
            self.node_map[name].predec_list = [self.node_map[key] for key in predec_list]
            self.node_map[name].update_ancestor_for_predec()
            self.node_map[name].duration = duration

    def input_predecessors(self):
        while True:
            predec = input("Predecessors: ")
            if predec.strip() == "-":
                return []

            predec_list = predec.split(",")
            predec_list = [item.strip() for item in predec_list]
            valid = True
            for item in predec_list:
                if item not in self.node_map:
                    print(f"Activity {item} does not exist")
                    valid = False
                    break
            if valid:
                return predec_list
        return []

    def print(self):
        print("================================")
        print("Activity  Duration  Predecessors")
        print("--------------------------------")
        for name in self.node_map:
            print(self.node_map[name])
        print("================================")

    def print_full(self):
        for name in self.node_map:
            print(self.node_map[name].info())

    def print_critical_path(self):
        print("Critical path:")
        print(arr_to_str(self.critical_path, sep=" -> "))

    def print_mailing_schedule(self):
        if len(self.critical_path) == 0 or self.critical_path[-1].earliest_start == -1:
            return

        days = [None] * (self.critical_path[-1].earliest_start + 1)
        for name, node in self.node_map.items():
            mail_day = node.earliest_start
            if days[mail_day] is None:
                days[mail_day] = [node]
            else:
                days[mail_day].append(node)

        print("Mailing schedule")
        for day, node_list in enumerate(days):
            if node_list is None:
                continue
            nodes_str = arr_to_str(node_list)
            print(f"Day {day}: {nodes_str}")

def main():
    graph = Graph()
    graph.create_graph_from_sample(SAMPLE)
    # graph.create_graph_from_user_input()
    graph.print()

    print()
    graph.find_critical_path()

    # graph.print_full()
    print()
    graph.print_mailing_schedule()


def callme(id):
    return "Hello here"


if __name__ == "__main__":
    main()
