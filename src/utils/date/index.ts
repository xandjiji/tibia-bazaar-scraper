import { time as constant } from 'Constants'

const MILLISECONDS_IN_AN_HOUR = 3600000
const TIMEZONE_OFFSET = MILLISECONDS_IN_AN_HOUR * constant.OFFSET_FROM_CIP

export const parseDate = (dateString: string) => {
  const [date, time] = dateString.split(', ')
  const [endTime] = time.split(' ')

  const newDateString = `${date}, ${endTime}`
  const newDate = new Date(newDateString)
  const newTimestamp =
    (+newDate + TIMEZONE_OFFSET) / constant.TIMESTAMP_MAGNITUDE
  return newTimestamp
}
