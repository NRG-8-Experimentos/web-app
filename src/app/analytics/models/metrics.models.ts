export interface TaskOverviewResource {
  type: string;
  totalTasks: number;
  details: { [status: string]: number }; // Ejemplo: { COMPLETED: 5, DONE: 3, ... }
}

export interface TaskDistributionResource {
  type: string;
  totalTasks: number;
  tasks: Array<{ title: string }>; // Lista de tareas, ajusta según la respuesta real
}

export interface RescheduledTasksResource {
  type: string;
  value: number; // Cantidad total de tareas reprogramadas
}

export interface AvgCompletionTimeResource {
  type: string;
  value: number; // Promedio en días (o ajusta según la respuesta real)
}
