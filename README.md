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

- link `./dist/sparqling.min.js` in a `<script>` tag in your `html` file:
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
- **`sparqling`**: meant to be used within other OBDA Systems' products.

You need to pass it the grapholscape instance and the Graphol ontology file which can be a `string` or a `Blob`.
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

## Repository npm targets
- **`start`**: build for development/debugging and serve the application at `localhost:8000` watching for changes
- **`watch`**: watch for changes in development environment
- **`build`**: build for production
- **`serve`**: serve the `./public` folder at `localhost:8000`
- **`apigen`**: generate api code from swagger
- **`inject-grapholscape`**: copy `./node_modules/grapholscape/dist/grapholscape.min.js` build into `./public/js` for the web-app to work
- **`clean`**: clean generated sparqling files in `./dist` and `./public/js`
- **`version`**: build and tag a new release version
- **`snapshot`**: build a snapshot prerelease version to be published with tag `snapshot` for testing


## Release a new version
1. Be sure to have a clean working tree (i.e. commit/stash your changes).
2. Use standard `npm version` command to tag a new version: `npm version [new-version]`.\
  this will generate a new git tag, update `package.json` and perform the builds.
3. Then review the generated builds and test the app using: `npm run serve`.
4. Push the new release: `git push && git push --tags"`
5. Publish to npm

## Release a snapshot test version
1. Use `npm run snapshot`
2. Publish using *snapshot* tag `npm publish --tag snapshot`
> To install latest snapshot version use `npm i sparqling@snapshot`

## Swagger
https://app.swaggerhub.com/apis/OBDASystems/swagger-sparqling_ws/1.0.0

In order to generate client/server model and api use swagger.editor.io
