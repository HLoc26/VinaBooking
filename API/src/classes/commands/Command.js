class Command {
	execute() {
		throw new Error("Execute method not implemented");
	}

	undo() {
		throw new Error("Undo method not implemented");
	}
}

export default Command;