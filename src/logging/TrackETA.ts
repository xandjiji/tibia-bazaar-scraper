import { log, setFooterText } from '.'
import { coloredText, progressBar, coloredProgress } from './utils'
import { Timestamp } from './Timestamp'
import { ColorKey } from './types'

export class TrackETA {
  constructor(totalTasks: number, taskName = 'Task') {
    this.taskName = taskName
    this.startTimestamp = +new Date()
    this.totalTasks = totalTasks

    this.setText(
      coloredText(
        `${this.taskName} is ${this.getReadablePercentage()} completed`,
        'reset',
      ),
    )
  }

  private taskName = 'Task'
  private startTimestamp: number = 0
  private currentTask = 0
  private totalTasks = 1
  private percentageCompleted = 0

  private getReadablePercentage = () =>
    coloredText(`${(this.percentageCompleted * 100).toFixed(2)}%`, 'system')

  private setText = (text: string) =>
    setFooterText(`${progressBar(this.percentageCompleted)} ${text}`)

  private updateETA = () => {
    const elapsedTime = +new Date() - this.startTimestamp
    const tasksLeft = this.totalTasks - this.currentTask
    const estimatedTimeLeft = (elapsedTime * tasksLeft) / this.currentTask

    if (tasksLeft) {
      this.setText(
        coloredText(
          `${
            this.taskName
          } is ${this.getReadablePercentage()} completed. ${Timestamp.ETA(
            estimatedTimeLeft,
          )}`,
          'reset',
        ),
      )
    }
  }

  public setCurrentTask = (newTask: number) => {
    this.currentTask = newTask
    this.percentageCompleted = this.currentTask / this.totalTasks
    this.updateETA()
  }

  public incTask = () => {
    this.currentTask++
    this.setCurrentTask(this.currentTask)
  }

  public getProgress = (color: ColorKey = 'system') =>
    coloredProgress([this.currentTask, this.totalTasks], color)

  finish = () => {
    log(
      `${progressBar(this.percentageCompleted, 'success')} ${
        this.taskName
      } was ${this.getReadablePercentage()} completed in ${Timestamp.humanReadable(
        +new Date() - this.startTimestamp,
      )}\n`,
    )
    setFooterText('')
  }
}
