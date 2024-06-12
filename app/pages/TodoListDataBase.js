import * as SQLite from "expo-sqlite";
export default class ToDoListDatabase {
	constructor() {}

	async dropTables() {
		let db = await this.connectDb();
		await db.execAsync(`
		DROP TABLE tasks;
		DROP TABLE categories;
		`);
		// DROP TABLE users;
	}

	async connectDb() {
		try {
			const db = await SQLite.openDatabaseAsync("toDoList");
			return db;
		} catch (e) {
			console.log("DataBase is not connected.");
		}
	}

	async createUserTable() {
		const db = await SQLite.openDatabaseAsync("toDoList");

		await db.execAsync(`
			PRAGMA journal_mode = WAL;
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name VARCHAR(20) NOT NULL,
				password VARCHAR(30) NOT NULL
				);
		`);

		const query = await db.getAllAsync(`select count(*) as count from users`);

		if (query[0].count == 0) {
			await db.execAsync(`
		    INSERT INTO users (name,password) 
			VALUES ('admin','123456'),('user','123456'),('test','123456');
		    `);
		}
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
				user_id INTEGER NOT NULL,
				constraint categories_fk foreign key (category_id) references categories(id),
    			constraint users_fk foreign key (user_id) references users(id)
			);

		`);
	}

	async isLogin(user) {
		const db = await SQLite.openDatabaseAsync("toDoList");
		const name = user.name;
		const password = user.password;
		try {
			console.log(await db.getAllAsync(`select * from users`));

			const loginUser = await db.getFirstAsync(`
				select * from users WHERE name='${name}' AND password='${password}'
			`);

			console.log(loginUser);

			let message = loginUser ? `'${loginUser.name}' is successfully login.` : `The user name or password is incorrect.`;

			return {
				user: loginUser,
				message: message,
			};
		} catch (e) {
			console.log("Login module database activity error.");
		}
	}

	async getTasks(limit) {
		let db = await this.connectDb();

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

	async getCategories() {
		let db = await this.connectDb();
		let result = await db.getAllAsync(`SELECT * FROM categories`);

		return result;
	}

	async getAllTasksByValue(category_id, status_id, currentPage = 1, user_id) {
		let totalRow = 6 * currentPage;
		let db = await this.connectDb();

		let query = "";
		let mainQuery = `
		SELECT tasks.*, categories.name as category_name, users.name as user_name
		FROM tasks
		LEFT JOIN categories ON tasks.category_id = categories.id LEFT JOIN users ON tasks.user_id = users.id WHERE users.id = '${user_id}'`;

		category_id != null && (query += `tasks.category_id = '${category_id}'`);

		if (status_id != null) {
			query != "" && (query += " AND ");
			query += `tasks.status = '${status_id}'`;
		}

		query != "" && (mainQuery += ` WHERE ${query}`);

		let result = await db.getAllAsync(mainQuery + `LIMIT ${totalRow}`);
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
		let db = await this.connectDb();

		let result = await db.getFirstAsync(`
			INSERT INTO tasks (task,description,status,date,category_id,user_id)
			VALUES ('${task.task}','${task.description}','${task.status}','${task.date}','${task.category_id}','${task.user_id}') RETURNING *;
			`);

		return result;
	}

	async updateTask(task) {
		let db = await this.connectDb();

		let result = await db.getFirstAsync(`
			UPDATE tasks SET task = '${task.task}',description = '${task.description}',status = '${task.status}',date = '${task.date}',category_id = '${task.category_id}' WHERE id = ${task.id} RETURNING *;
			`);

		return result;
	}

	async completeTask(id) {
		let db = await this.connectDb();

		let taskObj = await db.getFirstAsync(`
			UPDATE tasks SET status = '2' WHERE id = ${id} RETURNING *;
		`);

		return {
			task: taskObj,
			message: `Task '${taskObj.task}' is Completed.`,
		};
	}

	async destroyTask(id) {
		let db = await this.connectDb();

		let taskObj = await db.getFirstAsync(`DELETE FROM tasks WHERE id = ${id}`);

		return {
			task: taskObj,
			message: "Task successfully Deleted.",
		};
	}
}
