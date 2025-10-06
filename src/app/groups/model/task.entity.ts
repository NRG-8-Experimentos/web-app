// @ts-ignore
this.groupService.getAllTasksByGroupId(this.groupId).subscribe({
  next: (tasksData: any[]) => {
    // @ts-ignore
    this.tasks = tasksData.map(task => new Task(
      task.id,
      task.title,
      task.description,
      task.dueDate,
      task.createdAt,
      task.updatedAt,
      task.status,
      task.member.id,
      task.member.name,
      task.member.surname,
      task.member.urlImage,
      task.groupId
    ));
  },
  error: (err: any) => console.error('Error al obtener tareas:', err)
});
