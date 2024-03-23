export type ID = string;

export interface Card {
	id: ID;
	title: string;
	tasks: Task[]
}

export interface Task {
	id: ID;
	title: string;
	createdAt: Date;
}