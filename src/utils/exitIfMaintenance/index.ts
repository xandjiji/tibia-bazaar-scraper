import { logging } from 'utils'

export const exitIfMaintenance = (maintenanceCheck: () => boolean): void => {
  if (maintenanceCheck()) {
    logging.broadcast(
      'Server is on maintenance, exiting gracefully...',
      'control',
    )
    process.exit()
  }
}
