import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'

import { terser } from 'rollup-plugin-terser'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import license from 'rollup-plugin-license'
import path from 'path'
import json from '@rollup/plugin-json'

const VERSION = process.env.VERSION || 'snapshot' // default snapshot
const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development' // default development
const dependencies = Object.keys(require('./package.json').dependencies)
dependencies.splice(dependencies.indexOf('lit-html'), 1)
dependencies.splice(dependencies.indexOf('lit-element'), 1)
dependencies.push('grapholscape')

const input = './src/index.ts'
const name = 'Sparqling'

const envVariables = {
  preventAssignment: true,
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

const licenseHeaderOptions = {
  sourcemap: true,
  banner: {
    content: {
      file: path.join(__dirname, 'LICENSE')
    }
  }
}

const build_development = {
  input,
  output: {
    file: 'public/js/sparqling.js',
    format: 'iife',
    name,
    sourcemap: 'inline',
    globals: {
      grapholscape: 'Grapholscape'
    },
  },
  plugins: [
    json(getJsonOptions()),
    nodeResolve({ browser: true }),
    replace(envVariables),
    commonjs({ include: '**/node_modules/**' }),
    typescript({
      allowSyntheticDefaultImports: true,
      target: 'es6'
    }),
  ],
  external: ['grapholscape'],
}

const build_production = [
  {
    input,
    output: [
      {
        file: 'dist/sparqling.min.js',
        format: 'iife',
        name,
        sourcemap: false,
        globals:{
          grapholscape: 'Grapholscape'
        },
      },
      {
        file: 'public/js/sparqling.js',
        format: 'iife',
        name,
        sourcemap: false,
        globals:{
          grapholscape: 'Grapholscape'
        },
      }
    ],
    plugins: [
      json(getJsonOptions()),
      nodeResolve({ browser: true }),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
      typescript({
        allowSyntheticDefaultImports: true,
        target: 'es6'
      }),
      sizeSnapshot(),
      terser(),
      license(licenseHeaderOptions)
    ],
    external: ['grapholscape'],
  },
  {
    input,
    output: {
      file: 'dist/sparqling.esm.js',
      format: 'es',
    },
    plugins: [
      json(getJsonOptions()),
      nodeResolve({ browser: true }),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
      typescript({
        allowSyntheticDefaultImports: true,
        target: 'es6'
      }),
      license(licenseHeaderOptions)
    ],
    external: dependencies,
  },
  {
    input,
    output: {
      file: 'dist/sparqling.esm.min.js',
      format: 'es',
    },
    plugins: [
      json(getJsonOptions()),
      nodeResolve({ browser: true }),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
      typescript({
        allowSyntheticDefaultImports: true,
        target: 'es6'
      }),
      terser(),
      license(licenseHeaderOptions)
    ],
    external: dependencies,
  }
]

export default NODE_ENV === 'production' ? build_production : build_development
