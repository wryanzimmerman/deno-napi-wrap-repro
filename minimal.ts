import { createRequire } from "node:module"
declare global {
  var gc: () => void
}

const addon = createRequire(import.meta.url)("./minimal.node")

const iterations = [10000, 20000, 40000, 80000]
const timings = Object.fromEntries(iterations.map((n) => [n, 0]))

const loop = async () => {
  for (const n of iterations) {
    let objects = Array.from({ length: n }, () => addon.makeWrapped())
    const target = addon.finalizedCount() + n
    objects = []

    const start = performance.now()

    while (addon.finalizedCount() < target) {
      globalThis.gc()
      await new Promise((resolve) => setTimeout(resolve, 0))
    }

    timings[n] += performance.now() - start
  }
}

const limit = 10
let count = 0
while (count < limit) {
  await loop()
  count++
}

console.log(`Average over ${limit} runs`)
let totalTime = 0
for (const [objects, total] of Object.entries(timings)) {
  totalTime += total
  console.log(`n=${objects} ${(total / limit).toFixed(1)} ms`)
}
console.log(`Total time ${totalTime.toFixed(1)} ms`)
