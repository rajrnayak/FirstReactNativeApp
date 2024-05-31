import * as SQLite from "expo-sqlite";

export default class ToDoListDatabase {
	constructor() {}

	async dropTables() {
		const db = await SQLite.openDatabaseAsync("toDoList");
		await db.execAsync(`
		DROP TABLE tasks;
		DROP TABLE categories;
		`);
	}

	async createCategoriesTable() {
		const db = await SQLite.openDatabaseAsync("toDoList");

		await db.execAsync(`
			PRAGMA journal_mode = WAL;
			CREATE TABLE IF NOT EXISTS categories (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name VARCHAR(20) NOT NULL
			);
		`);

		const query = await db.getAllAsync(`select count(*) as count from categories`);

		if (query[0].count == 0) {
			await db.execAsync(`
            INSERT INTO categories (name) VALUES ('Personal');
            INSERT INTO categories (name) VALUES ('Work');
            INSERT INTO categories (name) VALUES ('Daily routine');
            `);
		}
	}

	async createTaskTable() {
		const db = await SQLite.openDatabaseAsync("toDoList");

		await db.execAsync(`
			PRAGMA journal_mode = WAL;
			PRAGMA foreign_keys = ON;
			CREATE TABLE IF NOT EXISTS tasks (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				task VARCHAR(30) NOT NULL,
				description VARCHAR(150) NOT NULL,
				status TINYINT(3) NOT NULL,
				date DATETIME(30) NOT NULL,
				category_id INTEGER NOT NULL,
				CONSTRAINT fk_categories
				FOREIGN KEY (category_id)
				REFERENCES categories(id)
			);
		`);
	}

	async getTasks(limit) {
		const db = await SQLite.openDatabaseAsync("toDoList");

		const totalTasks = await db.getAllAsync(`select count(*) as count from tasks`);

		const dueTasks = await db.getAllAsync(`
			SELECT tasks.*, categories.name as category_name
			FROM tasks 
			LEFT JOIN categories ON tasks.category_id = categories.id
			WHERE (status = 0 OR status = 1) AND date = (select DATE('now') date) ${limit ? "" : "LIMIT 2"}
		`);

		const totalPendingTasks = await db.getAllAsync(`
			select count(*) as count from tasks 
			WHERE status = 0 OR status = 1
		`);

		const completeTasks = await db.getAllAsync(`select count(*) as count from tasks where status = 2`);

		return {
			totalTasks: totalTasks[0].count,
			dueTasks: dueTasks,
			totalPendingTasks: totalPendingTasks[0].count,
			completeTasks: completeTasks[0].count,
		};
	}

	async getAllTasks() {
		const db = await SQLite.openDatabaseAsync("toDoList");
		let result = await db.getAllAsync(`
			SELECT tasks.*, categories.name as category_name
			FROM tasks 
			LEFT JOIN categories ON tasks.category_id = categories.id
		`);

		return result;
	}

	async getAllTasksByCategory(id) {
		const db = await SQLite.openDatabaseAsync("toDoList");
		let result = await db.getAllAsync(`
			SELECT tasks.*, categories.name as category_name
			FROM tasks 
			LEFT JOIN categories ON tasks.category_id = categories.id
			WHERE tasks.category_id = ${id}
		`);

		return result;
	}

	async manageTask(task) {
		let taskObj = null;
		let message = "";

		if (task.id == "") {
			taskObj = await this.createTask(task);
			message = "New task successfully Created.";
		} else {
			taskObj = await this.updateTask(task);
			message = "Task successfully Updated.";
		}

		return {
			task: taskObj,
			message: message,
		};
	}

	async createTask(task) {
		const db = await SQLite.openDatabaseAsync("toDoList");

		let result = await db.getFirstAsync(`
			INSERT INTO tasks (task,description,status,date,category_id)
			VALUES ('${task.task}','${task.description}','${task.status}','${task.date}','${task.category_id}') RETURNING *;
			`);

		return result;
	}

	async updateTask(task) {
		const db = await SQLite.openDatabaseAsync("toDoList");

		let result = await db.getFirstAsync(`
			UPDATE tasks SET task = '${task.task}',description = '${task.description}',status = '${task.status}',date = '${task.date}',category_id = '${task.category_id}' WHERE id = ${task.id} RETURNING *;
			`);

		return result;
	}

	async completeTask(id) {
		const db = await SQLite.openDatabaseAsync("toDoList");

		let taskObj = await db.getFirstAsync(`
			UPDATE tasks SET status = '2' WHERE id = ${id} RETURNING *;
		`);

		return {
			task: taskObj,
			message: `Task '${taskObj.task}' is Completed.`,
		};
	}

	async destroyTask(id) {
		const db = await SQLite.openDatabaseAsync("toDoList");

		let taskObj = await db.getFirstAsync(`DELETE FROM tasks WHERE id = ${id}`);

		return {
			task: taskObj,
			message: "Task successfully Deleted.",
		};
	}
}
