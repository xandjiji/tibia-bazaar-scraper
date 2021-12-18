import { setFooterText } from '.'
import { humanReadableTimestamp, etaTimestamp, coloredText } from './utils'

export class TackETA {
  constructor(totalTasks: number) {
    this.startTimestamp = +new Date()
    this.totalTasks = totalTasks

    setFooterText(
      coloredText(`Task is ${this.getReadablePercentage()}`, 'reset'),
    )
  }

  private startTimestamp: number = 0
  private currentTask = 0
  private totalTasks = 1
  private percentageCompleted = 0

  private elapsedTime = () =>
    humanReadableTimestamp(+new Date() - this.startTimestamp)

  private getReadablePercentage = () =>
    coloredText(`${(this.percentageCompleted * 100).toFixed(2)}%`, 'system')

  private updateETA = () => {
    const elapsedTime = +new Date() - this.startTimestamp
    const tasksLeft = this.totalTasks - this.currentTask
    const estimatedTimeLeft = (elapsedTime * tasksLeft) / this.currentTask

    setFooterText(
      coloredText(
        `Task is ${this.getReadablePercentage()} completed. ${etaTimestamp(
          estimatedTimeLeft,
        )}`,
        'reset',
      ),
    )
  }

  public setCurrentTask = (currentTask: number) => {
    this.currentTask = currentTask
    this.percentageCompleted = this.currentTask / this.totalTasks

    this.updateETA()
  }

  public finish = () => {
    setFooterText(
      `Task was ${this.getReadablePercentage()} completed in ${this.elapsedTime()}`,
    )
  }
}
