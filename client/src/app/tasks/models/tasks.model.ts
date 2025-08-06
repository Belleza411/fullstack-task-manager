export type PRIORITIES = 'Low' | 'Medium' | 'High';
export type STATUSES = 'Pending' | 'InProgress' | 'Completed';

export interface Task {
    taskId: string;
    userId: string;
    taskName: string;
    taskDescription: string;
    taskPriority: PRIORITIES;
    taskStatus: STATUSES;
    dueDate?: string;
    createdAt?: string;
    timeLeft?: string; 
}

export interface NewTask {
    taskName: string;
    taskDescription: string;
    taskStatus: STATUSES;
    taskPriority: PRIORITIES;
    dueDate?: string;
}