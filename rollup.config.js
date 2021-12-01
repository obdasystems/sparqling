import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import license from 'rollup-plugin-license'
import path from 'path'
import json from '@rollup/plugin-json'

const VERSION = process.env.VERSION || 'snapshot' // default snapshot
const FILE = process.env.FILE
const SOURCEMAPS = process.env.SOURCEMAPS === 'false' // default true
const BABEL = process.env.BABEL !== 'false' // default true
const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development' // default development
const matchSnapshot = process.env.SNAPSHOT === 'match'
const dependencies = Object.keys(require('./package.json').dependencies)
dependencies.splice(dependencies.indexOf('lit-html'), 1)
dependencies.splice(dependencies.indexOf('lit-element'), 1)

const input = './src/main.js'
const name = 'sparqling'

const envVariables = {
  'process.env.VERSION': JSON.stringify(VERSION),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
}

const getJsonOptions = () => ({
  // include: 'src/**',
  // exclude: [ '**./**' ],

  // for tree-shaking, properties will be declared as
  // variables, using either `var` or `const`
  preferConst: true, // Default: false

  // specify indentation for the generated default export —
  // defaults to '\t'
  indent: '  ',

  // ignores indent and generates the smallest code
  compact: true, // Default: false

  // generate a named export for every property of the JSON object
  namedExports: true // Default: true
})

const getBabelOptions = () => ({
  include: [
    'src/**',
    'node_modules/lit-html/**',
    'node_modules/lit-element/**',
    'node_modules/@material/**'
  ],
  babelrc: false,
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ]
})

const licenseHeaderOptions = {
  sourcemap: true,
  banner: {
    content: {
      file: path.join(__dirname, 'LICENSE')
    }
  }
}

export default {
  input,
  output: {
    file: 'build/sparqling.js',
    format: 'umd',
    name,
    sourcemap: SOURCEMAPS ? 'inline' : false
  },
  plugins: [
    nodeResolve(),
    commonjs({ include: '**/node_modules/**' }),
    replace(envVariables),
    BABEL ? babel(getBabelOptions()) : {},
  ]
}
