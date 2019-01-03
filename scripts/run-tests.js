require('babel-register')({
  plugins: [
    'transform-es2015-modules-commonjs',
    ['transform-object-rest-spread', {'useBuiltIns': true}],
  ],
  babelrc: false,
})

const path = require('path')
const glob = require('glob')

process.argv.slice(2).forEach((arg) => {
  glob(arg, (error, files) => {
    if (error) {
      throw error
    } else {
      files.forEach((file) => require(path.resolve(process.cwd(), file)))
    }
  })
})
