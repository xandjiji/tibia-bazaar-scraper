import { setFooterText } from '.'
import { coloredText, progressBar } from './utils'
import { Timestamp } from './Timestamp'

export class TackETA {
  constructor(totalTasks: number) {
    this.startTimestamp = +new Date()
    this.totalTasks = totalTasks

    setFooterText(
      coloredText(
        `${this.getProgressBar()} Task is ${this.getReadablePercentage()}`,
        'reset',
      ),
    )
  }

  private startTimestamp: number = 0
  private currentTask = 0
  private totalTasks = 1
  private percentageCompleted = 0

  private elapsedTime = () =>
    Timestamp.humanReadable(+new Date() - this.startTimestamp)

  private getReadablePercentage = () =>
    coloredText(`${(this.percentageCompleted * 100).toFixed(2)}%`, 'system')

  private getProgressBar = () => progressBar(this.percentageCompleted)

  private updateETA = () => {
    const elapsedTime = +new Date() - this.startTimestamp
    const tasksLeft = this.totalTasks - this.currentTask
    const estimatedTimeLeft = (elapsedTime * tasksLeft) / this.currentTask

    setFooterText(
      coloredText(
        `${this.getProgressBar()} Task is ${this.getReadablePercentage()} completed. ${Timestamp.ETA(
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
      `${this.getProgressBar()} Task was ${this.getReadablePercentage()} completed in ${this.elapsedTime()}`,
    )
  }
}
