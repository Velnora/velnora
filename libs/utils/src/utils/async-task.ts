/**
 * A class to execute async tasks in sequence
 */
export class AsyncTask {
  private tasks: (() => Promise<any>)[] = [];

  addTask(task: () => Promise<any>) {
    this.tasks.push(task);
  }

  async executeTasks() {
    let taskIdx = 0;

    while (taskIdx < this.tasks.length) {
      await this.tasks[taskIdx]();
      taskIdx++;
    }
  }
}
