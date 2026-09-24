import { createRequire } from "node:module"

const addon = createRequire(import.meta.url)("./minimal.node")

const iterations = [10000, 20000, 40000, 80000]

for (const n of iterations) {
  let objects = Array.from({ length: n }, () => addon.makeWrapped())
  const target = addon.finalizedCount() + n
  objects = null

  const start = performance.now()

  while (addon.finalizedCount() < target) {
    globalThis.gc()
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  console.log(`n=${n} ${(performance.now() - start).toFixed(1)} ms`)
}
