export class AsyncTask {
  private tasks: (() => Promise<any>)[] = [];

  addTask(task: () => Promise<any>) {
    this.tasks.push(task);
  }

  async executeTasks() {
    for (const task of this.tasks) {
      await task();
    }
  }
}
