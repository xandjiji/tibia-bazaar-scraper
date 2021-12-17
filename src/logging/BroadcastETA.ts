import { broadcast } from '.'
import { humanReadableTimestamp, coloredText } from './utils'

export class BroadcastETA {
  constructor(currentTask: number, totalTasks: number) {
    this.startTimestamp = +new Date()
    this.currentTask = currentTask
    this.totalTasks = totalTasks

    this.interval = setInterval(this.broadcastETA, 30000)
  }

  private startTimestamp: number = 0
  private interval: NodeJS.Timer | null = null
  private currentTask = 0
  private totalTasks = 1
  private percentageCompleted = 0

  private elapsedTime = () =>
    humanReadableTimestamp(+new Date() - this.startTimestamp)

  private getReadablePercentage = () =>
    coloredText(`${(this.percentageCompleted * 100).toFixed(2)}%`, 'system')

  private broadcastETA = () => {
    const elapsedTime = +new Date() - this.startTimestamp
    const tasksLeft = this.totalTasks - this.currentTask
    const estimatedTimeLeft = (elapsedTime * tasksLeft) / this.currentTask
    broadcast(
      `Task is ${this.getReadablePercentage()} completed. ${humanReadableTimestamp(
        estimatedTimeLeft,
      )} estimated time left`,
      'control',
    )
  }

  setCurrentTask = (currentTask: number) => {
    this.currentTask = currentTask
    this.percentageCompleted = this.currentTask / this.totalTasks
  }

  finish = () => {
    clearInterval(this.interval!)
    broadcast(
      `Task was ${this.getReadablePercentage()} completed in ${this.elapsedTime()}`,
      'success',
    )
  }
}
