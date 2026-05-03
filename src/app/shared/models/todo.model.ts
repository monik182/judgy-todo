export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  priority: Priority;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface JudgeMessage {
  id: string;
  text: string;
  type: 'roast' | 'praise' | 'observation' | 'response';
  timestamp: Date;
}
