// eslint-disable-next-line
export function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
