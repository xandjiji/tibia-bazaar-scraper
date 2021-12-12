type FileConstant = {
  name: string
  path: string
}

const OUTPUT_PATH = './Output'

const names = {
  SERVER_DATA: 'ServerData.json',
}

const SERVER_DATA = {
  name: names.SERVER_DATA,
  path: `${OUTPUT_PATH}/${names.SERVER_DATA}`,
}

export const file: Record<string, FileConstant> = {
  SERVER_DATA,
}
