const sum = (x: number, y: number) => (x + y)
const square = (x: number) => (x * x)
const compare = (x: number, y: number) => {
  if (x < y) return -1
  else if (x > y) return 1
  else return 0
}

/**
 * Analyze a data list and calculate the info needed to draw a boxplot
 * @returns the array of []
 * @param data
 */
function boxplotAnalyze(data: number[]): number[] {
  // let mean: number = data.reduce(sum)/data.length
  // let deviations: number[] = data.map(x => x - mean)
  // let stddev: number = 0
  // if (data.length > 1)
  //   stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length - 1))

  let max: number = Math.max.apply(null, data)
  let min: number = Math.min.apply(null, data)

  data.sort(compare)
  let mid: number = 0
  if (data.length % 2 === 0)
    mid = (data[data.length / 2] + data[data.length / 2 + 1]) / 2
  else
    mid = data[(data.length + 1) / 2]
  let q1: number = data[Math.floor(data.length / 4)]
  let q3: number = data[Math.floor(data.length / 4 * 3)]

  return [
    min, q1, mid, q3, max
  ]
}

export { boxplotAnalyze }