# sparqling
Point and click SPARQL query builder based on [Grapholscape](https://github.com/obdasystems/grapholscape).
Build SPARQL queries interacting directly with the ontology graphical specification.

## Standalone
Check standalone releases in order to get the ready to use application: https://github.com/obdasystems/sparqling-standalone

## Installation
Sparqling works on top of [Grapholscape]() that is a peer dependecy, hence you need to install it before proceding.\
Once Grapholscape is ready and working you can proceed importing sparqling.

### HTML Environment
If you are using a HTML Environment (without a building system) you can:

- link `./build/sparqling.min.js` in a `<script>` tag in your `html` file:
```html
<script src="./sparqling.min.js" type="text/javascript" ></script>
```

- import sparqling as a ES6 module:
```html
<script type="module">
  import * as Sparqling from "./sparqling.esm.min.js";
</script>
```

### NPM
If you want to install it via npm: `npm install sparqling`.

## Initialisation
Sparqling offers two intialising functions:
- **`sparqlingStandalone`**: for the standalone version
- **`sparqling`**: meant to be used within other Obda Systems' products.

You need to pass the it the grapholscape instance and the Graphol ontology file which can be a `string` or a `Blob`.
The initialising function will return the core object, check the [API]().
```js
import * as Sparqling from 'sparqling'
// or import * as Sparqling from './sparqling.esm.min.js'
// or <script ...>

const grapholscape = ... // init grapholscape

const sparqlingCore = Sparqling.sparqlingStandalone(grapholscape, grapholFile)
```

## API
The Sparqling core object expose the following API:
  - `function` **`start(): void`**: initialise the UI components and activate sparqling's engine.
  - `property` **`onStart: () => void`**: onStart callback to perform actions every time sparqling is started.
      > Example:
      > ```js
      > sparqlingCore.onStart = function() {
      >   console.log('Sparqling has been started')
      > }
      >```
  - `function` **`stop(): void`**: stop sparqling's engine and hide UI components.
  - `property` **`onStop: () => void`**: onStop callback to perform actions every time sparqling is stopped.
      > Example:
      > ```js
      > sparqlingCore.onStop = function() {
      >   console.log('Sparqling has been stopped')
      > }
      >```
  - `function` **`getQueryBody(): QueryGraph`**: returns the actual QueryGraph
  - `property` **`onQueryRun: (sparqlQuery: string) => void`**: onQueryRun callback to perform actions every time the user click on the run query button.
      > Example:
      > ```js
      > sparqlingCore.onQueryRun = function(sparqlQuery) {
      >   console.log(`Please run this query: ${sparqlQuery}`)
      > }
      >```


## Swagger
https://app.swaggerhub.com/apis/OBDASystems/swagger-sparqling_ws/1.0.0

In order to generate client/server model and api use swagger.editor.io
