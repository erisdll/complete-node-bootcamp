const fs = require('fs')
const superagent = require('superagent')

const readFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('File not found!')
      resolve(data)
    })
  })
}

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile((file, data, err => {
      if (err) reject('Could not write file!')
      resolve('success')
    }))
  })
}

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`)
    console.log(`Breed: ${data}`)

    const res1pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    )
    const res2pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    )
    const res3pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    )
    const all = await Promise.all([res1pro, res2pro, res3pro])
    const imgs = all.map(el => el.body.message)
    console.log(imgs)

    console.log(res.body.message)

    await writeFilePro('dog-img.txt', imgs.join('\n'))
    console.log('Images saved to file!')
  } catch (err) {
    console.log(err)

    throw(err)
  }
  return '2: Ready!'
}

(async () => {
  try {
    console.log("1: Will get dog pics!")
    const x = await getDogPic()
    console.log(x)
    console.log("3: Done getting dog pics!")
  } catch (err) {
    console.log("Error!")
  }
})()

/*
console.log("1: Will get dog pics!")
getDogPic()
  .then(x => {
    console.log(x)
    console.log("3: Done getting dog pics!")
  })
  .catch(err => {
    console.log("Error!")
  })
*/
/*
readFilePro(`${__dirname}/dog.txt`)
.then(data => {
  console.log(`Breed: ${data}`)
  return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
})
.then(res => {
  console.log(res.body.message)
  return writeFilePro('dog-img.txt', res.body.message)
})
.then(() => {
  console.log('Image saved to file!')
})
.catch(err => {
  console.log(err)
}) */
