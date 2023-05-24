const fs = require('fs')

setTimeout(() => console.log("Timer 1 finisehd"), 0)
setImmediate(() => console.log("Immidiate 1 finished"))

fs.readFile('test-tile.txt', () => {
  console.log('I/O finished')
})

console.log('Hello from the top-level code')