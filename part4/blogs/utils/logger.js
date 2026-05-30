export const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

export const err = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

