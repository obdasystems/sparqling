/**
 * MIT License
 *
 * Copyright (c) 2022 OBDA Systems
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import globalAxios from 'axios';
import { ui, GrapholTypesEnum, Iri, RendererStatesEnum, EntityNameType, ColoursNames, LifecycleEvent } from 'grapholscape';
import cytoscape from 'cytoscape';
import klay from 'cytoscape-klay';
import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop';
import popper$1 from 'cytoscape-popper';

let body;
let activeElement;
// map GraphElementId+IRI -> EntityOccurrence: { OriginGrapholNodeID, diagramId }
// Use iri to distinguish children of a GraphElement
const originGrapholNodes = new Map();
function setQueryBody(newBody) {
    body = newBody;
    return body;
}
function setActiveElement(newActiveElement) {
    activeElement = newActiveElement;
}
function getActiveElement() { return activeElement; }
function getQueryBody() { return body; }
function getOriginGrapholNodes() {
    return originGrapholNodes;
}
function getTempQueryBody() {
    return JSON.parse(JSON.stringify(body));
}
function getHeadElementByID(headElementId, queryBody = body) {
    var _a;
    return (_a = queryBody === null || queryBody === void 0 ? void 0 : queryBody.head) === null || _a === void 0 ? void 0 : _a.find(headElement => headElement.id === headElementId);
}
function isCountStarActive() {
    var _a, _b;
    return ((_a = body === null || body === void 0 ? void 0 : body.head) === null || _a === void 0 ? void 0 : _a.length) === 1 && ((_b = body === null || body === void 0 ? void 0 : body.head[0]) === null || _b === void 0 ? void 0 : _b.graphElementId) === null;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/* tslint:disable */
const BASE_PATH = "http://localhost:7979/sparqling/1.0.0".replace(/\/+$/, "");
/**
 *
 * @export
 * @class BaseAPI
 */
class BaseAPI {
    constructor(configuration, basePath = BASE_PATH, axios = globalAxios) {
        this.basePath = basePath;
        this.axios = axios;
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
}
/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
class RequiredError extends Error {
    constructor(field, msg) {
        super(msg);
        this.field = field;
        this.name = "RequiredError";
    }
}

/* tslint:disable */
/**
 *
 * @export
 */
const DUMMY_BASE_URL = 'https://example.com';
/**
 *
 * @throws {RequiredError}
 * @export
 */
const assertParamExists = function (functionName, paramName, paramValue) {
    if (paramValue === null || paramValue === undefined) {
        throw new RequiredError(paramName, `Required parameter ${paramName} was null or undefined when calling ${functionName}.`);
    }
};
/**
 *
 * @export
 */
const setSearchParams = function (url, ...objects) {
    const searchParams = new URLSearchParams(url.search);
    for (const object of objects) {
        for (const key in object) {
            if (Array.isArray(object[key])) {
                searchParams.delete(key);
                for (const item of object[key]) {
                    searchParams.append(key, item);
                }
            }
            else {
                searchParams.set(key, object[key]);
            }
        }
    }
    url.search = searchParams.toString();
};
/**
 *
 * @export
 */
const serializeDataIfNeeded = function (value, requestOptions, configuration) {
    const nonString = typeof value !== 'string';
    const needsSerialization = nonString && configuration && configuration.isJsonMime
        ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
        : nonString;
    return needsSerialization
        ? JSON.stringify(value !== undefined ? value : {})
        : (value || "");
};
/**
 *
 * @export
 */
const toPathString = function (url) {
    return url.pathname + url.search + url.hash;
};
/**
 *
 * @export
 */
const createRequestFunction = function (axiosArgs, globalAxios, BASE_PATH, configuration) {
    return (axios = globalAxios, basePath = BASE_PATH) => {
        const axiosRequestArgs = Object.assign(Object.assign({}, axiosArgs.options), { url: ((configuration === null || configuration === void 0 ? void 0 : configuration.basePath) || basePath) + axiosArgs.url });
        return axios.request(axiosRequestArgs);
    };
};

/* tslint:disable */
const EntityTypeEnum = {
    Class: 'class',
    ObjectProperty: 'objectProperty',
    InverseObjectProperty: 'inverseObjectProperty',
    DataProperty: 'dataProperty'
};
const FilterExpressionOperatorEnum = {
    Equal: '=',
    NotEqual: '!=',
    LessThan: '<',
    GreaterThan: '>',
    LessThanOrEqualTo: '<=',
    GreaterThanOrEqualTo: '>=',
    In: 'IN',
    NotIn: 'NOT IN',
    Regex: 'REGEX'
};
const FunctionNameEnum = {
    Add: 'ADD',
    Subctract: 'SUBCTRACT',
    Multiply: 'MULTIPLY',
    Divide: 'DIVIDE',
    Substr: 'SUBSTR',
    Ucase: 'UCASE',
    Lcase: 'LCASE',
    Contains: 'CONTAINS',
    Concat: 'CONCAT',
    Round: 'ROUND',
    Ceil: 'CEIL',
    Floor: 'FLOOR',
    Year: 'YEAR',
    Month: 'MONTH',
    Day: 'DAY',
    Hours: 'HOURS',
    Minutes: 'MINUTES',
    Seconds: 'SECONDS'
};
const GroupByElementAggregateFunctionEnum = {
    Count: 'count',
    Sum: 'sum',
    Min: 'min',
    Max: 'max',
    Avarage: 'avarage'
};
const VarOrConstantTypeEnum = {
    Var: 'var',
    Constant: 'constant',
    Iri: 'iri'
};
const VarOrConstantConstantTypeEnum = {
    String: 'xsd:string',
    Decimal: 'xsd:decimal',
    DateTime: 'xsd:dateTime'
};
/**
 * OntologyGraphApi - axios parameter creator
 * @export
 */
const OntologyGraphApiAxiosParamCreator = function (configuration) {
    return {
        /**
         * This route is used to highlight the negihbours of the selected class. The neighbours can be classes (brother classes or child classes), object properties (the class or one of his father partecipate or are typed to domain/range) or data properties (the class or one of its fathers partecipates or is typed to its domain).
         * @summary Get the IRIs of the ontology entities \"related\" to the clicked and selected.
         * @param {string} clickedClassIRI The IRI of the class just clicked on the GRAPHOLscape ontology graph
         * @param {Array<string>} [params]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        highligths: (clickedClassIRI, params, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'clickedClassIRI' is not null or undefined
            assertParamExists('highligths', 'clickedClassIRI', clickedClassIRI);
            const localVarPath = `/highlights`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (clickedClassIRI !== undefined) {
                localVarQueryParameter['clickedClassIRI'] = clickedClassIRI;
            }
            if (params) {
                localVarQueryParameter['params'] = params;
            }
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * The results should be based on Dijkstra algorithm for shortest paths. ISA wieght is 0 while role weight is 1.
         * @summary Find paths between selected class and clicked class.
         * @param {string} lastSelectedIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
         * @param {string} clickedIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        highligthsPaths: (lastSelectedIRI, clickedIRI, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'lastSelectedIRI' is not null or undefined
            assertParamExists('highligthsPaths', 'lastSelectedIRI', lastSelectedIRI);
            // verify required parameter 'clickedIRI' is not null or undefined
            assertParamExists('highligthsPaths', 'clickedIRI', clickedIRI);
            const localVarPath = `/highlights/paths`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (lastSelectedIRI !== undefined) {
                localVarQueryParameter['lastSelectedIRI'] = lastSelectedIRI;
            }
            if (clickedIRI !== undefined) {
                localVarQueryParameter['clickedIRI'] = clickedIRI;
            }
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
/**
 * OntologyGraphApi - functional programming interface
 * @export
 */
const OntologyGraphApiFp = function (configuration) {
    const localVarAxiosParamCreator = OntologyGraphApiAxiosParamCreator(configuration);
    return {
        /**
         * This route is used to highlight the negihbours of the selected class. The neighbours can be classes (brother classes or child classes), object properties (the class or one of his father partecipate or are typed to domain/range) or data properties (the class or one of its fathers partecipates or is typed to its domain).
         * @summary Get the IRIs of the ontology entities \"related\" to the clicked and selected.
         * @param {string} clickedClassIRI The IRI of the class just clicked on the GRAPHOLscape ontology graph
         * @param {Array<string>} [params]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        highligths(clickedClassIRI, params, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.highligths(clickedClassIRI, params, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * The results should be based on Dijkstra algorithm for shortest paths. ISA wieght is 0 while role weight is 1.
         * @summary Find paths between selected class and clicked class.
         * @param {string} lastSelectedIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
         * @param {string} clickedIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        highligthsPaths(lastSelectedIRI, clickedIRI, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.highligthsPaths(lastSelectedIRI, clickedIRI, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
    };
};
/**
 * OntologyGraphApi - object-oriented interface
 * @export
 * @class OntologyGraphApi
 * @extends {BaseAPI}
 */
class OntologyGraphApi extends BaseAPI {
    /**
     * This route is used to highlight the negihbours of the selected class. The neighbours can be classes (brother classes or child classes), object properties (the class or one of his father partecipate or are typed to domain/range) or data properties (the class or one of its fathers partecipates or is typed to its domain).
     * @summary Get the IRIs of the ontology entities \"related\" to the clicked and selected.
     * @param {string} clickedClassIRI The IRI of the class just clicked on the GRAPHOLscape ontology graph
     * @param {Array<string>} [params]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OntologyGraphApi
     */
    highligths(clickedClassIRI, params, options) {
        return OntologyGraphApiFp(this.configuration).highligths(clickedClassIRI, params, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * The results should be based on Dijkstra algorithm for shortest paths. ISA wieght is 0 while role weight is 1.
     * @summary Find paths between selected class and clicked class.
     * @param {string} lastSelectedIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
     * @param {string} clickedIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OntologyGraphApi
     */
    highligthsPaths(lastSelectedIRI, clickedIRI, options) {
        return OntologyGraphApiFp(this.configuration).highligthsPaths(lastSelectedIRI, clickedIRI, options).then((request) => request(this.axios, this.basePath));
    }
}
/**
 * QueryGraphBGPApi - axios parameter creator
 * @export
 */
const QueryGraphBGPApiAxiosParamCreator = function (configuration) {
    return {
        /**
         * This path should be used to build the query graph using the path interaction. As a result there will be added to the query several triple pattern (depending on the length of the path) as a sequence of classes and object properties. Data properties never appear in paths, in order to add them use the simple PUT route.
         * @summary Get the query graph that will be rendered by Sparqling, the query head, the sparql code based on the chosen path.
         * @param {string} path Serialization of Path object.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addPathToQueryGraph: (path, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'path' is not null or undefined
            assertParamExists('addPathToQueryGraph', 'path', path);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('addPathToQueryGraph', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/path`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (path !== undefined) {
                localVarQueryParameter['path'] = path;
            }
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * This route is used when the user wants to delete a node from the query graph. All the children of this node will be deleted as well as we do not want to create query with completly separated branches. All the variables that are going to be deleted should also be deleted from the head of the query. **WARNING**, if the node has multiple occurrences (due to join operations) every node should be deleted.
         * @summary Delete the GraphElement (and all its children) from the query graph and head.
         * @param {string} graphElementId The GraphElement that should be deleted
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteGraphElementId: (graphElementId, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'graphElementId' is not null or undefined
            assertParamExists('deleteGraphElementId', 'graphElementId', graphElementId);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('deleteGraphElementId', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/delete/{graphElementId}`
                .replace(`{${"graphElementId"}}`, encodeURIComponent(String(graphElementId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Delete from GraphElement only the class
         * @param {string} graphElementId
         * @param {string} classIRI The class that should be deleted
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteGraphElementIdClass: (graphElementId, classIRI, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'graphElementId' is not null or undefined
            assertParamExists('deleteGraphElementIdClass', 'graphElementId', graphElementId);
            // verify required parameter 'classIRI' is not null or undefined
            assertParamExists('deleteGraphElementIdClass', 'classIRI', classIRI);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('deleteGraphElementIdClass', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/delete/{graphElementId}/class`
                .replace(`{${"graphElementId"}}`, encodeURIComponent(String(graphElementId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (classIRI !== undefined) {
                localVarQueryParameter['classIRI'] = classIRI;
            }
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Starting from only the clicked class get the query graph that will be rendered by Sparqling, the query head, the sparql code. The sparql query returned will be somthing like `select ?x { ?x a <clickedClassIRI>` }. The variable `?x` should be called according to the entity remainder or label. The variable will be added to the head of the query in order to create a valid SPARQL query.
         * @summary This is the first route to call in order to build the query graph.
         * @param {string} clickedClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getQueryGraph: (clickedClassIRI, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'clickedClassIRI' is not null or undefined
            assertParamExists('getQueryGraph', 'clickedClassIRI', clickedClassIRI);
            const localVarPath = `/queryGraph/node`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (clickedClassIRI !== undefined) {
                localVarQueryParameter['clickedClassIRI'] = clickedClassIRI;
            }
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * This call is used when the user click on a highlighted class and should add a triple pattern of the form like `?x rdf:type <targetClassIRI>`. The server should find `?x` in the SPARQL code as the variable associated to the `sourceClassIRI`.
         * @summary Starting from the current query graph continue to build the query graph through a class.
         * @param {string} graphElementId The id of the node of the selected class in the query graph.
         * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
         * @param {string} targetClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphClass: (graphElementId, sourceClassIRI, targetClassIRI, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'graphElementId' is not null or undefined
            assertParamExists('putQueryGraphClass', 'graphElementId', graphElementId);
            // verify required parameter 'sourceClassIRI' is not null or undefined
            assertParamExists('putQueryGraphClass', 'sourceClassIRI', sourceClassIRI);
            // verify required parameter 'targetClassIRI' is not null or undefined
            assertParamExists('putQueryGraphClass', 'targetClassIRI', targetClassIRI);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('putQueryGraphClass', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/class/{graphElementId}`
                .replace(`{${"graphElementId"}}`, encodeURIComponent(String(graphElementId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (sourceClassIRI !== undefined) {
                localVarQueryParameter['sourceClassIRI'] = sourceClassIRI;
            }
            if (targetClassIRI !== undefined) {
                localVarQueryParameter['targetClassIRI'] = targetClassIRI;
            }
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * This route is used when the user click a highlighted data property. The triple pattern to add is something like `?x <predicateIRI> ?y` where `?x` should be derived from `selectedClassIRI`. Note that `?y` is fresh new variable that should be added also to the head of the query (we assume data property values are interesting). The variable `?y` should be called according to the entity remainder or label and should add a counter if there is an already defined variable for that data property.
         * @summary Starting from the current query graph continue to build the query graph through a data property.
         * @param {string} graphElementId The id of the node of the selected class in the query graph.
         * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
         * @param {string} predicateIRI The IRI of the clicked data property.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphDataProperty: (graphElementId, sourceClassIRI, predicateIRI, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'graphElementId' is not null or undefined
            assertParamExists('putQueryGraphDataProperty', 'graphElementId', graphElementId);
            // verify required parameter 'sourceClassIRI' is not null or undefined
            assertParamExists('putQueryGraphDataProperty', 'sourceClassIRI', sourceClassIRI);
            // verify required parameter 'predicateIRI' is not null or undefined
            assertParamExists('putQueryGraphDataProperty', 'predicateIRI', predicateIRI);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('putQueryGraphDataProperty', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/dataProperty/{graphElementId}`
                .replace(`{${"graphElementId"}}`, encodeURIComponent(String(graphElementId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (sourceClassIRI !== undefined) {
                localVarQueryParameter['sourceClassIRI'] = sourceClassIRI;
            }
            if (predicateIRI !== undefined) {
                localVarQueryParameter['predicateIRI'] = predicateIRI;
            }
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Starting from a query graph which has two nodes representing the same class(es), it returns the query graph in which the two nodes have been joined into a single one. The children of the selected nodes will be grouped in `graphElementId1` and each time we add a children through the previous routes they will be added to this node.
         * @summary Join two GraphNodeElement in one.
         * @param {string} graphElementId1 The id of the node of the selected class in the query graph.
         * @param {string} graphElementId2 The id of the node of the selected class in the query graph.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphJoin: (graphElementId1, graphElementId2, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'graphElementId1' is not null or undefined
            assertParamExists('putQueryGraphJoin', 'graphElementId1', graphElementId1);
            // verify required parameter 'graphElementId2' is not null or undefined
            assertParamExists('putQueryGraphJoin', 'graphElementId2', graphElementId2);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('putQueryGraphJoin', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/join/{graphElementId1}/{graphElementId2}`
                .replace(`{${"graphElementId1"}}`, encodeURIComponent(String(graphElementId1)))
                .replace(`{${"graphElementId2"}}`, encodeURIComponent(String(graphElementId2)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * This route is used when the user click a highlighted object property with ornly one `relatedClasses` or, in the case of more than one `relatedClasses` immediatly after choosing one of them. In this case the triple pattern to add is something like `?x <predicateIRI> ?y` where `?x` and `?y` should be derived from the direction indicated by `isPredicateDirect` of the object property with respect to `sourceClassIRI` and `targetClassIRI`. If there is a cyclic object property the user also should specify the direction if order to correctly assign `?x` and `?y`. Either `?x` or `?y` should be a fresh new variable which should be linked to a new triple pattern `?y rdf:type <targetClassIRI>`. The variable `?y` should be called according to the entity remainder or label and should add a counter if there is an already defined variable for that class.
         * @summary Starting from the current query graph continue to build the query graph through a object property.
         * @param {string} graphElementId The id of the node of the selected class in the query graph.
         * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
         * @param {string} predicateIRI The IRI of the predicate which links source class and target class
         * @param {string} targetClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph.
         * @param {boolean} isPredicateDirect If true sourceClassIRI is the domain of predicateIRI, if false sourceClassIRI is the range of predicateIRI.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphObjectProperty: (graphElementId, sourceClassIRI, predicateIRI, targetClassIRI, isPredicateDirect, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'graphElementId' is not null or undefined
            assertParamExists('putQueryGraphObjectProperty', 'graphElementId', graphElementId);
            // verify required parameter 'sourceClassIRI' is not null or undefined
            assertParamExists('putQueryGraphObjectProperty', 'sourceClassIRI', sourceClassIRI);
            // verify required parameter 'predicateIRI' is not null or undefined
            assertParamExists('putQueryGraphObjectProperty', 'predicateIRI', predicateIRI);
            // verify required parameter 'targetClassIRI' is not null or undefined
            assertParamExists('putQueryGraphObjectProperty', 'targetClassIRI', targetClassIRI);
            // verify required parameter 'isPredicateDirect' is not null or undefined
            assertParamExists('putQueryGraphObjectProperty', 'isPredicateDirect', isPredicateDirect);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('putQueryGraphObjectProperty', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/objectProperty/{graphElementId}`
                .replace(`{${"graphElementId"}}`, encodeURIComponent(String(graphElementId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (sourceClassIRI !== undefined) {
                localVarQueryParameter['sourceClassIRI'] = sourceClassIRI;
            }
            if (predicateIRI !== undefined) {
                localVarQueryParameter['predicateIRI'] = predicateIRI;
            }
            if (targetClassIRI !== undefined) {
                localVarQueryParameter['targetClassIRI'] = targetClassIRI;
            }
            if (isPredicateDirect !== undefined) {
                localVarQueryParameter['isPredicateDirect'] = isPredicateDirect;
            }
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
/**
 * QueryGraphBGPApi - functional programming interface
 * @export
 */
const QueryGraphBGPApiFp = function (configuration) {
    const localVarAxiosParamCreator = QueryGraphBGPApiAxiosParamCreator(configuration);
    return {
        /**
         * This path should be used to build the query graph using the path interaction. As a result there will be added to the query several triple pattern (depending on the length of the path) as a sequence of classes and object properties. Data properties never appear in paths, in order to add them use the simple PUT route.
         * @summary Get the query graph that will be rendered by Sparqling, the query head, the sparql code based on the chosen path.
         * @param {string} path Serialization of Path object.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addPathToQueryGraph(path, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.addPathToQueryGraph(path, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * This route is used when the user wants to delete a node from the query graph. All the children of this node will be deleted as well as we do not want to create query with completly separated branches. All the variables that are going to be deleted should also be deleted from the head of the query. **WARNING**, if the node has multiple occurrences (due to join operations) every node should be deleted.
         * @summary Delete the GraphElement (and all its children) from the query graph and head.
         * @param {string} graphElementId The GraphElement that should be deleted
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteGraphElementId(graphElementId, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.deleteGraphElementId(graphElementId, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Delete from GraphElement only the class
         * @param {string} graphElementId
         * @param {string} classIRI The class that should be deleted
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteGraphElementIdClass(graphElementId, classIRI, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.deleteGraphElementIdClass(graphElementId, classIRI, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * Starting from only the clicked class get the query graph that will be rendered by Sparqling, the query head, the sparql code. The sparql query returned will be somthing like `select ?x { ?x a <clickedClassIRI>` }. The variable `?x` should be called according to the entity remainder or label. The variable will be added to the head of the query in order to create a valid SPARQL query.
         * @summary This is the first route to call in order to build the query graph.
         * @param {string} clickedClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getQueryGraph(clickedClassIRI, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.getQueryGraph(clickedClassIRI, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * This call is used when the user click on a highlighted class and should add a triple pattern of the form like `?x rdf:type <targetClassIRI>`. The server should find `?x` in the SPARQL code as the variable associated to the `sourceClassIRI`.
         * @summary Starting from the current query graph continue to build the query graph through a class.
         * @param {string} graphElementId The id of the node of the selected class in the query graph.
         * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
         * @param {string} targetClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphClass(graphElementId, sourceClassIRI, targetClassIRI, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.putQueryGraphClass(graphElementId, sourceClassIRI, targetClassIRI, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * This route is used when the user click a highlighted data property. The triple pattern to add is something like `?x <predicateIRI> ?y` where `?x` should be derived from `selectedClassIRI`. Note that `?y` is fresh new variable that should be added also to the head of the query (we assume data property values are interesting). The variable `?y` should be called according to the entity remainder or label and should add a counter if there is an already defined variable for that data property.
         * @summary Starting from the current query graph continue to build the query graph through a data property.
         * @param {string} graphElementId The id of the node of the selected class in the query graph.
         * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
         * @param {string} predicateIRI The IRI of the clicked data property.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphDataProperty(graphElementId, sourceClassIRI, predicateIRI, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.putQueryGraphDataProperty(graphElementId, sourceClassIRI, predicateIRI, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * Starting from a query graph which has two nodes representing the same class(es), it returns the query graph in which the two nodes have been joined into a single one. The children of the selected nodes will be grouped in `graphElementId1` and each time we add a children through the previous routes they will be added to this node.
         * @summary Join two GraphNodeElement in one.
         * @param {string} graphElementId1 The id of the node of the selected class in the query graph.
         * @param {string} graphElementId2 The id of the node of the selected class in the query graph.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphJoin(graphElementId1, graphElementId2, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.putQueryGraphJoin(graphElementId1, graphElementId2, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * This route is used when the user click a highlighted object property with ornly one `relatedClasses` or, in the case of more than one `relatedClasses` immediatly after choosing one of them. In this case the triple pattern to add is something like `?x <predicateIRI> ?y` where `?x` and `?y` should be derived from the direction indicated by `isPredicateDirect` of the object property with respect to `sourceClassIRI` and `targetClassIRI`. If there is a cyclic object property the user also should specify the direction if order to correctly assign `?x` and `?y`. Either `?x` or `?y` should be a fresh new variable which should be linked to a new triple pattern `?y rdf:type <targetClassIRI>`. The variable `?y` should be called according to the entity remainder or label and should add a counter if there is an already defined variable for that class.
         * @summary Starting from the current query graph continue to build the query graph through a object property.
         * @param {string} graphElementId The id of the node of the selected class in the query graph.
         * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
         * @param {string} predicateIRI The IRI of the predicate which links source class and target class
         * @param {string} targetClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph.
         * @param {boolean} isPredicateDirect If true sourceClassIRI is the domain of predicateIRI, if false sourceClassIRI is the range of predicateIRI.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphObjectProperty(graphElementId, sourceClassIRI, predicateIRI, targetClassIRI, isPredicateDirect, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.putQueryGraphObjectProperty(graphElementId, sourceClassIRI, predicateIRI, targetClassIRI, isPredicateDirect, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
    };
};
/**
 * QueryGraphBGPApi - factory interface
 * @export
 */
const QueryGraphBGPApiFactory = function (configuration, basePath, axios) {
    const localVarFp = QueryGraphBGPApiFp(configuration);
    return {
        /**
         * This path should be used to build the query graph using the path interaction. As a result there will be added to the query several triple pattern (depending on the length of the path) as a sequence of classes and object properties. Data properties never appear in paths, in order to add them use the simple PUT route.
         * @summary Get the query graph that will be rendered by Sparqling, the query head, the sparql code based on the chosen path.
         * @param {string} path Serialization of Path object.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addPathToQueryGraph(path, queryGraph, options) {
            return localVarFp.addPathToQueryGraph(path, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * This route is used when the user wants to delete a node from the query graph. All the children of this node will be deleted as well as we do not want to create query with completly separated branches. All the variables that are going to be deleted should also be deleted from the head of the query. **WARNING**, if the node has multiple occurrences (due to join operations) every node should be deleted.
         * @summary Delete the GraphElement (and all its children) from the query graph and head.
         * @param {string} graphElementId The GraphElement that should be deleted
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteGraphElementId(graphElementId, queryGraph, options) {
            return localVarFp.deleteGraphElementId(graphElementId, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Delete from GraphElement only the class
         * @param {string} graphElementId
         * @param {string} classIRI The class that should be deleted
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteGraphElementIdClass(graphElementId, classIRI, queryGraph, options) {
            return localVarFp.deleteGraphElementIdClass(graphElementId, classIRI, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * Starting from only the clicked class get the query graph that will be rendered by Sparqling, the query head, the sparql code. The sparql query returned will be somthing like `select ?x { ?x a <clickedClassIRI>` }. The variable `?x` should be called according to the entity remainder or label. The variable will be added to the head of the query in order to create a valid SPARQL query.
         * @summary This is the first route to call in order to build the query graph.
         * @param {string} clickedClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getQueryGraph(clickedClassIRI, options) {
            return localVarFp.getQueryGraph(clickedClassIRI, options).then((request) => request(axios, basePath));
        },
        /**
         * This call is used when the user click on a highlighted class and should add a triple pattern of the form like `?x rdf:type <targetClassIRI>`. The server should find `?x` in the SPARQL code as the variable associated to the `sourceClassIRI`.
         * @summary Starting from the current query graph continue to build the query graph through a class.
         * @param {string} graphElementId The id of the node of the selected class in the query graph.
         * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
         * @param {string} targetClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphClass(graphElementId, sourceClassIRI, targetClassIRI, queryGraph, options) {
            return localVarFp.putQueryGraphClass(graphElementId, sourceClassIRI, targetClassIRI, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * This route is used when the user click a highlighted data property. The triple pattern to add is something like `?x <predicateIRI> ?y` where `?x` should be derived from `selectedClassIRI`. Note that `?y` is fresh new variable that should be added also to the head of the query (we assume data property values are interesting). The variable `?y` should be called according to the entity remainder or label and should add a counter if there is an already defined variable for that data property.
         * @summary Starting from the current query graph continue to build the query graph through a data property.
         * @param {string} graphElementId The id of the node of the selected class in the query graph.
         * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
         * @param {string} predicateIRI The IRI of the clicked data property.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphDataProperty(graphElementId, sourceClassIRI, predicateIRI, queryGraph, options) {
            return localVarFp.putQueryGraphDataProperty(graphElementId, sourceClassIRI, predicateIRI, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * Starting from a query graph which has two nodes representing the same class(es), it returns the query graph in which the two nodes have been joined into a single one. The children of the selected nodes will be grouped in `graphElementId1` and each time we add a children through the previous routes they will be added to this node.
         * @summary Join two GraphNodeElement in one.
         * @param {string} graphElementId1 The id of the node of the selected class in the query graph.
         * @param {string} graphElementId2 The id of the node of the selected class in the query graph.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphJoin(graphElementId1, graphElementId2, queryGraph, options) {
            return localVarFp.putQueryGraphJoin(graphElementId1, graphElementId2, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * This route is used when the user click a highlighted object property with ornly one `relatedClasses` or, in the case of more than one `relatedClasses` immediatly after choosing one of them. In this case the triple pattern to add is something like `?x <predicateIRI> ?y` where `?x` and `?y` should be derived from the direction indicated by `isPredicateDirect` of the object property with respect to `sourceClassIRI` and `targetClassIRI`. If there is a cyclic object property the user also should specify the direction if order to correctly assign `?x` and `?y`. Either `?x` or `?y` should be a fresh new variable which should be linked to a new triple pattern `?y rdf:type <targetClassIRI>`. The variable `?y` should be called according to the entity remainder or label and should add a counter if there is an already defined variable for that class.
         * @summary Starting from the current query graph continue to build the query graph through a object property.
         * @param {string} graphElementId The id of the node of the selected class in the query graph.
         * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
         * @param {string} predicateIRI The IRI of the predicate which links source class and target class
         * @param {string} targetClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph.
         * @param {boolean} isPredicateDirect If true sourceClassIRI is the domain of predicateIRI, if false sourceClassIRI is the range of predicateIRI.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putQueryGraphObjectProperty(graphElementId, sourceClassIRI, predicateIRI, targetClassIRI, isPredicateDirect, queryGraph, options) {
            return localVarFp.putQueryGraphObjectProperty(graphElementId, sourceClassIRI, predicateIRI, targetClassIRI, isPredicateDirect, queryGraph, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * QueryGraphBGPApi - object-oriented interface
 * @export
 * @class QueryGraphBGPApi
 * @extends {BaseAPI}
 */
class QueryGraphBGPApi extends BaseAPI {
    /**
     * This path should be used to build the query graph using the path interaction. As a result there will be added to the query several triple pattern (depending on the length of the path) as a sequence of classes and object properties. Data properties never appear in paths, in order to add them use the simple PUT route.
     * @summary Get the query graph that will be rendered by Sparqling, the query head, the sparql code based on the chosen path.
     * @param {string} path Serialization of Path object.
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphBGPApi
     */
    addPathToQueryGraph(path, queryGraph, options) {
        return QueryGraphBGPApiFp(this.configuration).addPathToQueryGraph(path, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * This route is used when the user wants to delete a node from the query graph. All the children of this node will be deleted as well as we do not want to create query with completly separated branches. All the variables that are going to be deleted should also be deleted from the head of the query. **WARNING**, if the node has multiple occurrences (due to join operations) every node should be deleted.
     * @summary Delete the GraphElement (and all its children) from the query graph and head.
     * @param {string} graphElementId The GraphElement that should be deleted
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphBGPApi
     */
    deleteGraphElementId(graphElementId, queryGraph, options) {
        return QueryGraphBGPApiFp(this.configuration).deleteGraphElementId(graphElementId, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Delete from GraphElement only the class
     * @param {string} graphElementId
     * @param {string} classIRI The class that should be deleted
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphBGPApi
     */
    deleteGraphElementIdClass(graphElementId, classIRI, queryGraph, options) {
        return QueryGraphBGPApiFp(this.configuration).deleteGraphElementIdClass(graphElementId, classIRI, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Starting from only the clicked class get the query graph that will be rendered by Sparqling, the query head, the sparql code. The sparql query returned will be somthing like `select ?x { ?x a <clickedClassIRI>` }. The variable `?x` should be called according to the entity remainder or label. The variable will be added to the head of the query in order to create a valid SPARQL query.
     * @summary This is the first route to call in order to build the query graph.
     * @param {string} clickedClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphBGPApi
     */
    getQueryGraph(clickedClassIRI, options) {
        return QueryGraphBGPApiFp(this.configuration).getQueryGraph(clickedClassIRI, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * This call is used when the user click on a highlighted class and should add a triple pattern of the form like `?x rdf:type <targetClassIRI>`. The server should find `?x` in the SPARQL code as the variable associated to the `sourceClassIRI`.
     * @summary Starting from the current query graph continue to build the query graph through a class.
     * @param {string} graphElementId The id of the node of the selected class in the query graph.
     * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
     * @param {string} targetClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph.
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphBGPApi
     */
    putQueryGraphClass(graphElementId, sourceClassIRI, targetClassIRI, queryGraph, options) {
        return QueryGraphBGPApiFp(this.configuration).putQueryGraphClass(graphElementId, sourceClassIRI, targetClassIRI, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * This route is used when the user click a highlighted data property. The triple pattern to add is something like `?x <predicateIRI> ?y` where `?x` should be derived from `selectedClassIRI`. Note that `?y` is fresh new variable that should be added also to the head of the query (we assume data property values are interesting). The variable `?y` should be called according to the entity remainder or label and should add a counter if there is an already defined variable for that data property.
     * @summary Starting from the current query graph continue to build the query graph through a data property.
     * @param {string} graphElementId The id of the node of the selected class in the query graph.
     * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
     * @param {string} predicateIRI The IRI of the clicked data property.
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphBGPApi
     */
    putQueryGraphDataProperty(graphElementId, sourceClassIRI, predicateIRI, queryGraph, options) {
        return QueryGraphBGPApiFp(this.configuration).putQueryGraphDataProperty(graphElementId, sourceClassIRI, predicateIRI, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Starting from a query graph which has two nodes representing the same class(es), it returns the query graph in which the two nodes have been joined into a single one. The children of the selected nodes will be grouped in `graphElementId1` and each time we add a children through the previous routes they will be added to this node.
     * @summary Join two GraphNodeElement in one.
     * @param {string} graphElementId1 The id of the node of the selected class in the query graph.
     * @param {string} graphElementId2 The id of the node of the selected class in the query graph.
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphBGPApi
     */
    putQueryGraphJoin(graphElementId1, graphElementId2, queryGraph, options) {
        return QueryGraphBGPApiFp(this.configuration).putQueryGraphJoin(graphElementId1, graphElementId2, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * This route is used when the user click a highlighted object property with ornly one `relatedClasses` or, in the case of more than one `relatedClasses` immediatly after choosing one of them. In this case the triple pattern to add is something like `?x <predicateIRI> ?y` where `?x` and `?y` should be derived from the direction indicated by `isPredicateDirect` of the object property with respect to `sourceClassIRI` and `targetClassIRI`. If there is a cyclic object property the user also should specify the direction if order to correctly assign `?x` and `?y`. Either `?x` or `?y` should be a fresh new variable which should be linked to a new triple pattern `?y rdf:type <targetClassIRI>`. The variable `?y` should be called according to the entity remainder or label and should add a counter if there is an already defined variable for that class.
     * @summary Starting from the current query graph continue to build the query graph through a object property.
     * @param {string} graphElementId The id of the node of the selected class in the query graph.
     * @param {string} sourceClassIRI The IRI of the last selected class. It could be selected from the ontology graph or from the query graph.
     * @param {string} predicateIRI The IRI of the predicate which links source class and target class
     * @param {string} targetClassIRI The IRI of the entity clicked on the GRAPHOLscape ontology graph.
     * @param {boolean} isPredicateDirect If true sourceClassIRI is the domain of predicateIRI, if false sourceClassIRI is the range of predicateIRI.
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphBGPApi
     */
    putQueryGraphObjectProperty(graphElementId, sourceClassIRI, predicateIRI, targetClassIRI, isPredicateDirect, queryGraph, options) {
        return QueryGraphBGPApiFp(this.configuration).putQueryGraphObjectProperty(graphElementId, sourceClassIRI, predicateIRI, targetClassIRI, isPredicateDirect, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
}
/**
 * QueryGraphExtraApi - axios parameter creator
 * @export
 */
const QueryGraphExtraApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary Remove query head and replace it with `count(*)`.
         * @param {boolean} distinct
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        countStarQueryGraph: (distinct, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'distinct' is not null or undefined
            assertParamExists('countStarQueryGraph', 'distinct', distinct);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('countStarQueryGraph', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/countStar`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (distinct !== undefined) {
                localVarQueryParameter['distinct'] = distinct;
            }
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * The distinct value is defined in the query graph in the request body.
         * @summary Set the distinct value.
         * @param {boolean} distinct
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        distinctQueryGraph: (distinct, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'distinct' is not null or undefined
            assertParamExists('distinctQueryGraph', 'distinct', distinct);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('distinctQueryGraph', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/distinct`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (distinct !== undefined) {
                localVarQueryParameter['distinct'] = distinct;
            }
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * The limit value is defined in the query graph in the request body.
         * @summary Set the limit value.
         * @param {number} limit
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        limitQueryGraph: (limit, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'limit' is not null or undefined
            assertParamExists('limitQueryGraph', 'limit', limit);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('limitQueryGraph', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/limit`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * The offset value is defined in the query graph in the request body.
         * @summary Set the offset value.
         * @param {number} offset
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        offsetQueryGraph: (offset, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'offset' is not null or undefined
            assertParamExists('offsetQueryGraph', 'offset', offset);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('offsetQueryGraph', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/offset`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
/**
 * QueryGraphExtraApi - functional programming interface
 * @export
 */
const QueryGraphExtraApiFp = function (configuration) {
    const localVarAxiosParamCreator = QueryGraphExtraApiAxiosParamCreator(configuration);
    return {
        /**
         *
         * @summary Remove query head and replace it with `count(*)`.
         * @param {boolean} distinct
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        countStarQueryGraph(distinct, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.countStarQueryGraph(distinct, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * The distinct value is defined in the query graph in the request body.
         * @summary Set the distinct value.
         * @param {boolean} distinct
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        distinctQueryGraph(distinct, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.distinctQueryGraph(distinct, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * The limit value is defined in the query graph in the request body.
         * @summary Set the limit value.
         * @param {number} limit
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        limitQueryGraph(limit, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.limitQueryGraph(limit, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * The offset value is defined in the query graph in the request body.
         * @summary Set the offset value.
         * @param {number} offset
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        offsetQueryGraph(offset, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.offsetQueryGraph(offset, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
    };
};
/**
 * QueryGraphExtraApi - object-oriented interface
 * @export
 * @class QueryGraphExtraApi
 * @extends {BaseAPI}
 */
class QueryGraphExtraApi extends BaseAPI {
    /**
     *
     * @summary Remove query head and replace it with `count(*)`.
     * @param {boolean} distinct
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphExtraApi
     */
    countStarQueryGraph(distinct, queryGraph, options) {
        return QueryGraphExtraApiFp(this.configuration).countStarQueryGraph(distinct, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * The distinct value is defined in the query graph in the request body.
     * @summary Set the distinct value.
     * @param {boolean} distinct
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphExtraApi
     */
    distinctQueryGraph(distinct, queryGraph, options) {
        return QueryGraphExtraApiFp(this.configuration).distinctQueryGraph(distinct, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * The limit value is defined in the query graph in the request body.
     * @summary Set the limit value.
     * @param {number} limit
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphExtraApi
     */
    limitQueryGraph(limit, queryGraph, options) {
        return QueryGraphExtraApiFp(this.configuration).limitQueryGraph(limit, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * The offset value is defined in the query graph in the request body.
     * @summary Set the offset value.
     * @param {number} offset
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphExtraApi
     */
    offsetQueryGraph(offset, queryGraph, options) {
        return QueryGraphExtraApiFp(this.configuration).offsetQueryGraph(offset, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
}
/**
 * QueryGraphFilterApi - axios parameter creator
 * @export
 */
const QueryGraphFilterApiAxiosParamCreator = function (configuration) {
    return {
        /**
         * Translate the filter at index `filterId` to a filter in SPARQL.
         * @summary Modify a filter in the query.
         * @param {number} filterId
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        editFilter: (filterId, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'filterId' is not null or undefined
            assertParamExists('editFilter', 'filterId', filterId);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('editFilter', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/filter/edit/{filterId}`
                .replace(`{${"filterId"}}`, encodeURIComponent(String(filterId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Translate the filter at index `filterId` to a new filter in SPARQL.
         * @summary Create a new filter in the query.
         * @param {number} filterId
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        newFilter: (filterId, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'filterId' is not null or undefined
            assertParamExists('newFilter', 'filterId', filterId);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('newFilter', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/filter/{filterId}`
                .replace(`{${"filterId"}}`, encodeURIComponent(String(filterId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Remove the filters.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeAllFilters: (queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('removeAllFilters', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/filter/remove/all`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Remove the filter at index `filterId` from the query.
         * @param {number} filterId
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeFilter: (filterId, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'filterId' is not null or undefined
            assertParamExists('removeFilter', 'filterId', filterId);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('removeFilter', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/filter/remove/{filterId}`
                .replace(`{${"filterId"}}`, encodeURIComponent(String(filterId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
/**
 * QueryGraphFilterApi - functional programming interface
 * @export
 */
const QueryGraphFilterApiFp = function (configuration) {
    const localVarAxiosParamCreator = QueryGraphFilterApiAxiosParamCreator(configuration);
    return {
        /**
         * Translate the filter at index `filterId` to a filter in SPARQL.
         * @summary Modify a filter in the query.
         * @param {number} filterId
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        editFilter(filterId, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.editFilter(filterId, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * Translate the filter at index `filterId` to a new filter in SPARQL.
         * @summary Create a new filter in the query.
         * @param {number} filterId
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        newFilter(filterId, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.newFilter(filterId, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Remove the filters.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeAllFilters(queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.removeAllFilters(queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Remove the filter at index `filterId` from the query.
         * @param {number} filterId
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeFilter(filterId, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.removeFilter(filterId, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
    };
};
/**
 * QueryGraphFilterApi - object-oriented interface
 * @export
 * @class QueryGraphFilterApi
 * @extends {BaseAPI}
 */
class QueryGraphFilterApi extends BaseAPI {
    /**
     * Translate the filter at index `filterId` to a filter in SPARQL.
     * @summary Modify a filter in the query.
     * @param {number} filterId
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphFilterApi
     */
    editFilter(filterId, queryGraph, options) {
        return QueryGraphFilterApiFp(this.configuration).editFilter(filterId, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Translate the filter at index `filterId` to a new filter in SPARQL.
     * @summary Create a new filter in the query.
     * @param {number} filterId
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphFilterApi
     */
    newFilter(filterId, queryGraph, options) {
        return QueryGraphFilterApiFp(this.configuration).newFilter(filterId, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Remove the filters.
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphFilterApi
     */
    removeAllFilters(queryGraph, options) {
        return QueryGraphFilterApiFp(this.configuration).removeAllFilters(queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Remove the filter at index `filterId` from the query.
     * @param {number} filterId
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphFilterApi
     */
    removeFilter(filterId, queryGraph, options) {
        return QueryGraphFilterApiFp(this.configuration).removeFilter(filterId, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
}
/**
 * QueryGraphHeadApi - axios parameter creator
 * @export
 */
const QueryGraphHeadApiAxiosParamCreator = function (configuration) {
    return {
        /**
         * Explicitley add a term to the query head. All the data property variables are added automatically to the head during the query graph construction. This will add to the head only variables associated to classes (`rdf:type` triple pattern) or data properties.
         * @summary Add the head term to the query graph.
         * @param {string} graphElementId The id of the graph node that should be added to the head
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addHeadTerm: (graphElementId, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'graphElementId' is not null or undefined
            assertParamExists('addHeadTerm', 'graphElementId', graphElementId);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('addHeadTerm', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/head/add/{graphElementId}`
                .replace(`{${"graphElementId"}}`, encodeURIComponent(String(graphElementId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * The aggregation function is defined in the group by field of the query graph in the request body along with the HAVING clause. Remember to set the alias of the head based on function name and variable.
         * @summary Set the aggregation function to the head term.
         * @param {string} headTerm The head term that should be involved in the aggregation function
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        aggregationHeadTerm: (headTerm, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'headTerm' is not null or undefined
            assertParamExists('aggregationHeadTerm', 'headTerm', headTerm);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('aggregationHeadTerm', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/head/aggregation/{headTerm}`
                .replace(`{${"headTerm"}}`, encodeURIComponent(String(headTerm)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * The path param should be the id of the HeadElement.
         * @summary Delete the head term from the query graph.
         * @param {string} headTerm The head term that should be deleted
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteHeadTerm: (headTerm, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'headTerm' is not null or undefined
            assertParamExists('deleteHeadTerm', 'headTerm', headTerm);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('deleteHeadTerm', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/head/delete/{headTerm}`
                .replace(`{${"headTerm"}}`, encodeURIComponent(String(headTerm)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * The function is defined in the head term of the query graph in the request body. Remember to set the alias of the head based on function name and variable.
         * @summary Set a function to the head term from the query graph.
         * @param {string} headTerm The head term that should be involved inthe function
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        functionHeadTerm: (headTerm, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'headTerm' is not null or undefined
            assertParamExists('functionHeadTerm', 'headTerm', headTerm);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('functionHeadTerm', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/head/function/{headTerm}`
                .replace(`{${"headTerm"}}`, encodeURIComponent(String(headTerm)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * The OrderBy object is passed in the request body in the Query Graph.
         * @summary Order by the head from the query graph.
         * @param {string} headTerm The head term that should be ordered
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        orderByHeadTerm: (headTerm, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'headTerm' is not null or undefined
            assertParamExists('orderByHeadTerm', 'headTerm', headTerm);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('orderByHeadTerm', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/head/orderBy/{headTerm}`
                .replace(`{${"headTerm"}}`, encodeURIComponent(String(headTerm)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Put the alias in the HeadElement passed via request body.
         * @summary Rename the head term from the query graph using alias.
         * @param {string} headTerm The head term that should be renamed
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        renameHeadTerm: (headTerm, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'headTerm' is not null or undefined
            assertParamExists('renameHeadTerm', 'headTerm', headTerm);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('renameHeadTerm', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/head/rename/{headTerm}`
                .replace(`{${"headTerm"}}`, encodeURIComponent(String(headTerm)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Reorder the head elements accrding to Query GRaph object.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reorderHeadTerms: (queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('reorderHeadTerms', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/head/reorderHeadTerms`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
/**
 * QueryGraphHeadApi - functional programming interface
 * @export
 */
const QueryGraphHeadApiFp = function (configuration) {
    const localVarAxiosParamCreator = QueryGraphHeadApiAxiosParamCreator(configuration);
    return {
        /**
         * Explicitley add a term to the query head. All the data property variables are added automatically to the head during the query graph construction. This will add to the head only variables associated to classes (`rdf:type` triple pattern) or data properties.
         * @summary Add the head term to the query graph.
         * @param {string} graphElementId The id of the graph node that should be added to the head
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addHeadTerm(graphElementId, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.addHeadTerm(graphElementId, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * The aggregation function is defined in the group by field of the query graph in the request body along with the HAVING clause. Remember to set the alias of the head based on function name and variable.
         * @summary Set the aggregation function to the head term.
         * @param {string} headTerm The head term that should be involved in the aggregation function
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        aggregationHeadTerm(headTerm, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.aggregationHeadTerm(headTerm, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * The path param should be the id of the HeadElement.
         * @summary Delete the head term from the query graph.
         * @param {string} headTerm The head term that should be deleted
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteHeadTerm(headTerm, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.deleteHeadTerm(headTerm, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * The function is defined in the head term of the query graph in the request body. Remember to set the alias of the head based on function name and variable.
         * @summary Set a function to the head term from the query graph.
         * @param {string} headTerm The head term that should be involved inthe function
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        functionHeadTerm(headTerm, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.functionHeadTerm(headTerm, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * The OrderBy object is passed in the request body in the Query Graph.
         * @summary Order by the head from the query graph.
         * @param {string} headTerm The head term that should be ordered
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        orderByHeadTerm(headTerm, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.orderByHeadTerm(headTerm, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * Put the alias in the HeadElement passed via request body.
         * @summary Rename the head term from the query graph using alias.
         * @param {string} headTerm The head term that should be renamed
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        renameHeadTerm(headTerm, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.renameHeadTerm(headTerm, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Reorder the head elements accrding to Query GRaph object.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reorderHeadTerms(queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.reorderHeadTerms(queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
    };
};
/**
 * QueryGraphHeadApi - factory interface
 * @export
 */
const QueryGraphHeadApiFactory = function (configuration, basePath, axios) {
    const localVarFp = QueryGraphHeadApiFp(configuration);
    return {
        /**
         * Explicitley add a term to the query head. All the data property variables are added automatically to the head during the query graph construction. This will add to the head only variables associated to classes (`rdf:type` triple pattern) or data properties.
         * @summary Add the head term to the query graph.
         * @param {string} graphElementId The id of the graph node that should be added to the head
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addHeadTerm(graphElementId, queryGraph, options) {
            return localVarFp.addHeadTerm(graphElementId, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * The aggregation function is defined in the group by field of the query graph in the request body along with the HAVING clause. Remember to set the alias of the head based on function name and variable.
         * @summary Set the aggregation function to the head term.
         * @param {string} headTerm The head term that should be involved in the aggregation function
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        aggregationHeadTerm(headTerm, queryGraph, options) {
            return localVarFp.aggregationHeadTerm(headTerm, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * The path param should be the id of the HeadElement.
         * @summary Delete the head term from the query graph.
         * @param {string} headTerm The head term that should be deleted
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteHeadTerm(headTerm, queryGraph, options) {
            return localVarFp.deleteHeadTerm(headTerm, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * The function is defined in the head term of the query graph in the request body. Remember to set the alias of the head based on function name and variable.
         * @summary Set a function to the head term from the query graph.
         * @param {string} headTerm The head term that should be involved inthe function
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        functionHeadTerm(headTerm, queryGraph, options) {
            return localVarFp.functionHeadTerm(headTerm, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * The OrderBy object is passed in the request body in the Query Graph.
         * @summary Order by the head from the query graph.
         * @param {string} headTerm The head term that should be ordered
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        orderByHeadTerm(headTerm, queryGraph, options) {
            return localVarFp.orderByHeadTerm(headTerm, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * Put the alias in the HeadElement passed via request body.
         * @summary Rename the head term from the query graph using alias.
         * @param {string} headTerm The head term that should be renamed
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        renameHeadTerm(headTerm, queryGraph, options) {
            return localVarFp.renameHeadTerm(headTerm, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Reorder the head elements accrding to Query GRaph object.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reorderHeadTerms(queryGraph, options) {
            return localVarFp.reorderHeadTerms(queryGraph, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * QueryGraphHeadApi - object-oriented interface
 * @export
 * @class QueryGraphHeadApi
 * @extends {BaseAPI}
 */
class QueryGraphHeadApi extends BaseAPI {
    /**
     * Explicitley add a term to the query head. All the data property variables are added automatically to the head during the query graph construction. This will add to the head only variables associated to classes (`rdf:type` triple pattern) or data properties.
     * @summary Add the head term to the query graph.
     * @param {string} graphElementId The id of the graph node that should be added to the head
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphHeadApi
     */
    addHeadTerm(graphElementId, queryGraph, options) {
        return QueryGraphHeadApiFp(this.configuration).addHeadTerm(graphElementId, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * The aggregation function is defined in the group by field of the query graph in the request body along with the HAVING clause. Remember to set the alias of the head based on function name and variable.
     * @summary Set the aggregation function to the head term.
     * @param {string} headTerm The head term that should be involved in the aggregation function
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphHeadApi
     */
    aggregationHeadTerm(headTerm, queryGraph, options) {
        return QueryGraphHeadApiFp(this.configuration).aggregationHeadTerm(headTerm, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * The path param should be the id of the HeadElement.
     * @summary Delete the head term from the query graph.
     * @param {string} headTerm The head term that should be deleted
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphHeadApi
     */
    deleteHeadTerm(headTerm, queryGraph, options) {
        return QueryGraphHeadApiFp(this.configuration).deleteHeadTerm(headTerm, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * The function is defined in the head term of the query graph in the request body. Remember to set the alias of the head based on function name and variable.
     * @summary Set a function to the head term from the query graph.
     * @param {string} headTerm The head term that should be involved inthe function
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphHeadApi
     */
    functionHeadTerm(headTerm, queryGraph, options) {
        return QueryGraphHeadApiFp(this.configuration).functionHeadTerm(headTerm, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * The OrderBy object is passed in the request body in the Query Graph.
     * @summary Order by the head from the query graph.
     * @param {string} headTerm The head term that should be ordered
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphHeadApi
     */
    orderByHeadTerm(headTerm, queryGraph, options) {
        return QueryGraphHeadApiFp(this.configuration).orderByHeadTerm(headTerm, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Put the alias in the HeadElement passed via request body.
     * @summary Rename the head term from the query graph using alias.
     * @param {string} headTerm The head term that should be renamed
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphHeadApi
     */
    renameHeadTerm(headTerm, queryGraph, options) {
        return QueryGraphHeadApiFp(this.configuration).renameHeadTerm(headTerm, queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Reorder the head elements accrding to Query GRaph object.
     * @param {QueryGraph} queryGraph
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof QueryGraphHeadApi
     */
    reorderHeadTerms(queryGraph, options) {
        return QueryGraphHeadApiFp(this.configuration).reorderHeadTerms(queryGraph, options).then((request) => request(this.axios, this.basePath));
    }
}
/**
 * QueryGraphOptionalApi - axios parameter creator
 * @export
 */
const QueryGraphOptionalApiAxiosParamCreator = function (configuration) {
    return {
        /**
         * Create a new optional in the query and add the triple pattern(s) identified by the GraphElementId. - If it is a class the query parameter should be used and the triple pattern `?graphElementId rdf:type <classIRI>` will be moved from the bgp to the new optional. - If it is a data property the tp `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2` will be added to the new optional. - If it is a object property the tps `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2. ?graphElementIdVar2 rdf:type <classIRI>` till the leaves will be moved to the new optional.
         * @summary Add the `graphElementId` to a new optional.
         * @param {string} graphElementId The GraphElement that should be added to the optional
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        newOptionalGraphElementId: (graphElementId, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'graphElementId' is not null or undefined
            assertParamExists('newOptionalGraphElementId', 'graphElementId', graphElementId);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('newOptionalGraphElementId', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/optional/{graphElementId}`
                .replace(`{${"graphElementId"}}`, encodeURIComponent(String(graphElementId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Remove the optionals and move them back to the bgp.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeAllOptional: (queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('removeAllOptional', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/optional/remove/all`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         * Remove the triple pattern(s) identified by the `graphElementId` from all the optional that contains the graphElementId. - If it is a class the query parameter should be used and the triple pattern `?graphElementId rdf:type <classIRI>` will be moved from the optional to the bgp. - If it is a data property the tp `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2` will be moved from the optional to the bgp. - If it is a object property the tps `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2. ?graphElementIdVar2 rdf:type <classIRI>` will be moved from the optional to the bgp.
         * @summary Remove the graphElementId from the optional and move it back to the bgp.
         * @param {string} graphElementId The GraphElement that should be removed from the optional
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeOptionalGraphElementId: (graphElementId, queryGraph, options = {}) => __awaiter(this, void 0, void 0, function* () {
            // verify required parameter 'graphElementId' is not null or undefined
            assertParamExists('removeOptionalGraphElementId', 'graphElementId', graphElementId);
            // verify required parameter 'queryGraph' is not null or undefined
            assertParamExists('removeOptionalGraphElementId', 'queryGraph', queryGraph);
            const localVarPath = `/queryGraph/node/optional/remove/{graphElementId}`
                .replace(`{${"graphElementId"}}`, encodeURIComponent(String(graphElementId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'PUT' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter['Content-Type'] = 'application/json';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = serializeDataIfNeeded(queryGraph, localVarRequestOptions, configuration);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
/**
 * QueryGraphOptionalApi - functional programming interface
 * @export
 */
const QueryGraphOptionalApiFp = function (configuration) {
    const localVarAxiosParamCreator = QueryGraphOptionalApiAxiosParamCreator(configuration);
    return {
        /**
         * Create a new optional in the query and add the triple pattern(s) identified by the GraphElementId. - If it is a class the query parameter should be used and the triple pattern `?graphElementId rdf:type <classIRI>` will be moved from the bgp to the new optional. - If it is a data property the tp `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2` will be added to the new optional. - If it is a object property the tps `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2. ?graphElementIdVar2 rdf:type <classIRI>` till the leaves will be moved to the new optional.
         * @summary Add the `graphElementId` to a new optional.
         * @param {string} graphElementId The GraphElement that should be added to the optional
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        newOptionalGraphElementId(graphElementId, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.newOptionalGraphElementId(graphElementId, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Remove the optionals and move them back to the bgp.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeAllOptional(queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.removeAllOptional(queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         * Remove the triple pattern(s) identified by the `graphElementId` from all the optional that contains the graphElementId. - If it is a class the query parameter should be used and the triple pattern `?graphElementId rdf:type <classIRI>` will be moved from the optional to the bgp. - If it is a data property the tp `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2` will be moved from the optional to the bgp. - If it is a object property the tps `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2. ?graphElementIdVar2 rdf:type <classIRI>` will be moved from the optional to the bgp.
         * @summary Remove the graphElementId from the optional and move it back to the bgp.
         * @param {string} graphElementId The GraphElement that should be removed from the optional
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeOptionalGraphElementId(graphElementId, queryGraph, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.removeOptionalGraphElementId(graphElementId, queryGraph, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
    };
};
/**
 * QueryGraphOptionalApi - factory interface
 * @export
 */
const QueryGraphOptionalApiFactory = function (configuration, basePath, axios) {
    const localVarFp = QueryGraphOptionalApiFp(configuration);
    return {
        /**
         * Create a new optional in the query and add the triple pattern(s) identified by the GraphElementId. - If it is a class the query parameter should be used and the triple pattern `?graphElementId rdf:type <classIRI>` will be moved from the bgp to the new optional. - If it is a data property the tp `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2` will be added to the new optional. - If it is a object property the tps `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2. ?graphElementIdVar2 rdf:type <classIRI>` till the leaves will be moved to the new optional.
         * @summary Add the `graphElementId` to a new optional.
         * @param {string} graphElementId The GraphElement that should be added to the optional
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        newOptionalGraphElementId(graphElementId, queryGraph, options) {
            return localVarFp.newOptionalGraphElementId(graphElementId, queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Remove the optionals and move them back to the bgp.
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeAllOptional(queryGraph, options) {
            return localVarFp.removeAllOptional(queryGraph, options).then((request) => request(axios, basePath));
        },
        /**
         * Remove the triple pattern(s) identified by the `graphElementId` from all the optional that contains the graphElementId. - If it is a class the query parameter should be used and the triple pattern `?graphElementId rdf:type <classIRI>` will be moved from the optional to the bgp. - If it is a data property the tp `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2` will be moved from the optional to the bgp. - If it is a object property the tps `?graphElementIdVar1 <graphElementIdDataPropertyIRI> ?graphElementIdVar2. ?graphElementIdVar2 rdf:type <classIRI>` will be moved from the optional to the bgp.
         * @summary Remove the graphElementId from the optional and move it back to the bgp.
         * @param {string} graphElementId The GraphElement that should be removed from the optional
         * @param {QueryGraph} queryGraph
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeOptionalGraphElementId(graphElementId, queryGraph, options) {
            return localVarFp.removeOptionalGraphElementId(graphElementId, queryGraph, options).then((request) => request(axios, basePath));
        },
    };
};
/**
 * StandaloneApi - axios parameter creator
 * @export
 */
const StandaloneApiAxiosParamCreator = function (configuration) {
    return {
        /**
         *
         * @summary Return the graphol file as a string to be parsed by Grapholscape.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        standaloneOntologyGrapholGet: (options = {}) => __awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/standalone/ontology/graphol`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'GET' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
        /**
         *
         * @summary Uploads a .graphol or .owl file. This will be used only by standalone Sparqling.
         * @param {any} [file]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        standaloneOntologyUploadPost: (file, options = {}) => __awaiter(this, void 0, void 0, function* () {
            const localVarPath = `/standalone/ontology/upload`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = Object.assign(Object.assign({ method: 'POST' }, baseOptions), options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();
            if (file !== undefined) {
                localVarFormParams.append('file', file);
            }
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = Object.assign(Object.assign(Object.assign({}, localVarHeaderParameter), headersFromBaseOptions), options.headers);
            localVarRequestOptions.data = localVarFormParams;
            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        }),
    };
};
/**
 * StandaloneApi - functional programming interface
 * @export
 */
const StandaloneApiFp = function (configuration) {
    const localVarAxiosParamCreator = StandaloneApiAxiosParamCreator(configuration);
    return {
        /**
         *
         * @summary Return the graphol file as a string to be parsed by Grapholscape.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        standaloneOntologyGrapholGet(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.standaloneOntologyGrapholGet(options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
        /**
         *
         * @summary Uploads a .graphol or .owl file. This will be used only by standalone Sparqling.
         * @param {any} [file]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        standaloneOntologyUploadPost(file, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const localVarAxiosArgs = yield localVarAxiosParamCreator.standaloneOntologyUploadPost(file, options);
                return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
            });
        },
    };
};
/**
 * StandaloneApi - object-oriented interface
 * @export
 * @class StandaloneApi
 * @extends {BaseAPI}
 */
class StandaloneApi extends BaseAPI {
    /**
     *
     * @summary Return the graphol file as a string to be parsed by Grapholscape.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StandaloneApi
     */
    standaloneOntologyGrapholGet(options) {
        return StandaloneApiFp(this.configuration).standaloneOntologyGrapholGet(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     *
     * @summary Uploads a .graphol or .owl file. This will be used only by standalone Sparqling.
     * @param {any} [file]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StandaloneApi
     */
    standaloneOntologyUploadPost(file, options) {
        return StandaloneApiFp(this.configuration).standaloneOntologyUploadPost(file, options).then((request) => request(this.axios, this.basePath));
    }
}

function getFilterById(filterId) {
    const body = getQueryBody();
    if (body.filters) {
        return body.filters[filterId];
    }
}
function getFiltersOnVariable(variable) {
    var _a;
    const body = getQueryBody();
    let filters = (_a = body === null || body === void 0 ? void 0 : body.filters) === null || _a === void 0 ? void 0 : _a.map((filter, index) => {
        return { id: index, value: filter };
    });
    return filters === null || filters === void 0 ? void 0 : filters.filter(f => {
        var _a;
        if ((_a = f.value.expression) === null || _a === void 0 ? void 0 : _a.parameters)
            return f.value.expression.parameters[0].type === VarOrConstantTypeEnum.Var &&
                f.value.expression.parameters[0].value === variable;
    });
}

let _requestOptions = {
    basePath: undefined,
    version: undefined,
    headers: undefined,
};
function setRequestOptions(requestOptions) {
    _requestOptions = requestOptions;
}
function getBasePath() { return _requestOptions.basePath; }
function getRequestOptions() {
    // { params: { version: 'version' }, headers: { "x-monolith-session-id": '0de2de0a-af44-4046-a91b-46b10394f068', 'Access-Control-Allow-Origin': '*', } }
    return {
        params: { version: _requestOptions.version },
        headers: _requestOptions.headers,
    };
}
function isStandalone() {
    return _requestOptions.basePath ? false : true;
}

let numberLoadingProcesses = 0;
function increaseLoadingProcesses() {
    numberLoadingProcesses += 1;
}
function decreaseLoadingProcesses() {
    numberLoadingProcesses -= 1;
}
function getNumberLoadingProcesses() {
    return numberLoadingProcesses;
}

let file;
let isInitialised = false;
let isRunning = false;
function getOntologyFile() {
    return file;
}
function setOntologyFile(value) {
    file = value;
}
function isSparqlingInitialised() {
    return isInitialised;
}
function setInitialised(value) {
    isInitialised = value;
}
function isSparqlingRunning() {
    return isRunning;
}
function setSparqlingRunning(value) {
    isRunning = value;
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e$2=Symbol(),n$3=new WeakMap;class s$3{constructor(t,n,s){if(this._$cssResult$=!0,s!==e$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=n;}get styleSheet(){let e=this.o;const s=this.t;if(t$1&&void 0===e){const t=void 0!==s&&1===s.length;t&&(e=n$3.get(s)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&n$3.set(s,e));}return e}toString(){return this.cssText}}const o$3=t=>new s$3("string"==typeof t?t:t+"",void 0,e$2),r$2=(t,...n)=>{const o=1===t.length?t[0]:n.reduce(((e,n,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[s+1]),t[0]);return new s$3(o,t,e$2)},i$1=(e,n)=>{t$1?e.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((t=>{const n=document.createElement("style"),s=window.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,e.appendChild(n);}));},S$1=t$1?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return o$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$1=window.trustedTypes,r$1=e$1?e$1.emptyScript:"",h$1=window.reactiveElementPolyfillSupport,o$2={toAttribute(t,i){switch(i){case Boolean:t=t?r$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},n$2=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:o$2,reflect:!1,hasChanged:n$2};class a$1 extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;null!==(i=this.h)&&void 0!==i||(this.h=[]),this.h.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(S$1(i));}else void 0!==i&&s.push(S$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return i$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e,r;const h=this.constructor._$Ep(t,s);if(void 0!==h&&!0===s.reflect){const n=(null!==(r=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==r?r:o$2.toAttribute)(i,s.type);this._$El=t,null==n?this.removeAttribute(h):this.setAttribute(h,n),this._$El=null;}}_$AK(t,i){var s,e;const r=this.constructor,h=r._$Ev.get(t);if(void 0!==h&&this._$El!==h){const t=r.getPropertyOptions(h),n=t.converter,l=null!==(e=null!==(s=null==n?void 0:n.fromAttribute)&&void 0!==s?s:"function"==typeof n?n:null)&&void 0!==e?e:o$2.fromAttribute;this._$El=h,this[h]=l(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||n$2)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}}a$1.finalized=!0,a$1.elementProperties=new Map,a$1.elementStyles=[],a$1.shadowRootOptions={mode:"open"},null==h$1||h$1({ReactiveElement:a$1}),(null!==(s$2=globalThis.reactiveElementVersions)&&void 0!==s$2?s$2:globalThis.reactiveElementVersions=[]).push("1.3.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i=globalThis.trustedTypes,s$1=i?i.createPolicy("lit-html",{createHTML:t=>t}):void 0,e=`lit$${(Math.random()+"").slice(9)}$`,o$1="?"+e,n$1=`<${o$1}>`,l$1=document,h=(t="")=>l$1.createComment(t),r=t=>null===t||"object"!=typeof t&&"function"!=typeof t,d=Array.isArray,u=t=>{var i;return d(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},c=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,a=/>/g,f=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,_=/'/g,m=/"/g,g=/^(?:script|style|textarea|title)$/i,p=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),$=p(1),y=p(2),b=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),T=new WeakMap,x=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N(i.insertBefore(h(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l},A=l$1.createTreeWalker(l$1,129,null,!1),C=(t,i)=>{const o=t.length-1,l=[];let h,r=2===i?"<svg>":"",d=c;for(let i=0;i<o;i++){const s=t[i];let o,u,p=-1,$=0;for(;$<s.length&&(d.lastIndex=$,u=d.exec(s),null!==u);)$=d.lastIndex,d===c?"!--"===u[1]?d=v:void 0!==u[1]?d=a:void 0!==u[2]?(g.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=f):void 0!==u[3]&&(d=f):d===f?">"===u[0]?(d=null!=h?h:c,p=-1):void 0===u[1]?p=-2:(p=d.lastIndex-u[2].length,o=u[1],d=void 0===u[3]?f:'"'===u[3]?m:_):d===m||d===_?d=f:d===v||d===a?d=c:(d=f,h=void 0);const y=d===f&&t[i+1].startsWith("/>")?" ":"";r+=d===c?s+n$1:p>=0?(l.push(o),s.slice(0,p)+"$lit$"+s.slice(p)+e+y):s+e+(-2===p?(l.push(void 0),i):y);}const u=r+(t[o]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==s$1?s$1.createHTML(u):u,l]};class E{constructor({strings:t,_$litType$:s},n){let l;this.parts=[];let r=0,d=0;const u=t.length-1,c=this.parts,[v,a]=C(t,s);if(this.el=E.createElement(v,n),A.currentNode=this.el.content,2===s){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(e)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(e),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?M:"?"===i[1]?H:"@"===i[1]?I:S});}else c.push({type:6,index:r});}for(const i of t)l.removeAttribute(i);}if(g.test(l.tagName)){const t=l.textContent.split(e),s=t.length-1;if(s>0){l.textContent=i?i.emptyScript:"";for(let i=0;i<s;i++)l.append(t[i],h()),A.nextNode(),c.push({type:2,index:++r});l.append(t[s],h());}}}else if(8===l.nodeType)if(l.data===o$1)c.push({type:2,index:r});else {let t=-1;for(;-1!==(t=l.data.indexOf(e,t+1));)c.push({type:7,index:r}),t+=e.length-1;}r++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function P(t,i,s=t,e){var o,n,l,h;if(i===b)return i;let d=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const u=r(i)?void 0:i._$litDirective$;return (null==d?void 0:d.constructor)!==u&&(null===(n=null==d?void 0:d._$AO)||void 0===n||n.call(d,!1),void 0===u?d=void 0:(d=new u(t),d._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Cl)&&void 0!==l?l:h._$Cl=[])[e]=d:s._$Cu=d),void 0!==d&&(i=P(t,d._$AS(t,i.values),d,e)),i}class V{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:l$1).importNode(s,!0);A.currentNode=o;let n=A.nextNode(),h=0,r=0,d=e[0];for(;void 0!==d;){if(h===d.index){let i;2===d.type?i=new N(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new L(n,this,t)),this.v.push(i),d=e[++r];}h!==(null==d?void 0:d.index)&&(n=A.nextNode(),h++);}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=P(this,t,i),r(t)?t===w||null==t||""===t?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==b&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):u(t)?this.S(t):this.$(t);}M(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t));}$(t){this._$AH!==w&&r(this._$AH)?this._$AA.nextSibling.data=t:this.k(l$1.createTextNode(t)),this._$AH=t;}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=E.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else {const t=new V(o,this),i=t.p(this.options);t.m(s),this.k(i),this._$AH=t;}}_$AC(t){let i=T.get(t.strings);return void 0===i&&T.set(t.strings,i=new E(t)),i}S(t){d(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.M(h()),this.M(h()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class S{constructor(t,i,s,e,o){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=P(this,t,i,0),n=!r(t)||t!==this._$AH&&t!==b,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=P(this,e[s+l],i,l),h===b&&(h=this._$AH[l]),n||(n=!r(h)||h!==this._$AH[l]),h===w?t=w:t!==w&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.C(t);}C(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class M extends S{constructor(){super(...arguments),this.type=3;}C(t){this.element[this.name]=t===w?void 0:t;}}const k=i?i.emptyScript:"";class H extends S{constructor(){super(...arguments),this.type=4;}C(t){t&&t!==w?this.element.setAttribute(this.name,k):this.element.removeAttribute(this.name);}}class I extends S{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=P(this,t,i,0))&&void 0!==s?s:w)===b)return;const e=this._$AH,o=t===w&&e!==w||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==w&&(e===w||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class L{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t);}}const z=window.litHtmlPolyfillSupport;null==z||z(E,N),(null!==(t=globalThis.litHtmlVersions)&&void 0!==t?t:globalThis.litHtmlVersions=[]).push("2.2.6");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends a$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=x(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return b}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.2.1");

function getFormTemplate(formComponent, operators) {
    var _a;
    const op = formComponent.operator || "Operator";
    const dt = formComponent.datatype || "Datatype";
    // const addInputButton = new UI.GscapeButton(UI.icons.plus, "Add input value")
    // addInputButton.id = "add-input-btn"
    return $ `
    <div class="section">
      ${formComponent.formTitle ? $ `<div class="header">${formComponent.formTitle}</div>` : null}
      <form id="form-dialog" class="form" action="javascript:void(0)" onsubmit="this.handleSubmit">
        <div class="selects-wrapper">
          <div id="select-operator">
            <label>Operator</label>
            ${getSelect(op, operators)}
          </div>
          ${formComponent.parametersType === VarOrConstantTypeEnum.Constant
        ? $ `
              <div id="select-datatype">
                <label>Datatype</label>
                ${getSelect(dt, Object.values(VarOrConstantConstantTypeEnum), formComponent.datatype !== undefined)}
              </div>`
        : null}
        </div>
        <div class="inputs-wrapper">
          ${(_a = formComponent.parametersIriOrConstants) === null || _a === void 0 ? void 0 : _a.map((parameter, index) => getInput(index, formComponent.datatype, parameter.value, "Set input value"))}
          ${formComponent.operator === FilterExpressionOperatorEnum.In ||
        formComponent.operator === FilterExpressionOperatorEnum.NotIn
        ? $ `
              <div>
                <gscape-button id="add-input-btn" type="subtle" title="Add input value">
                  <span slot="icon">${ui.icons.plus}</span>
                </gscape-button>
                ${formComponent.parameters && formComponent.parameters.length > 3 // at least 3 custom inputs to remove one
            ? $ `
                    <gscape-button id="remove-input-btn" type="subtle" title="Remove input value">
                      <span slot="icon">${ui.icons.minus}</span>
                    </gscape-button>
                  `
            : null}
              </div>
            `
        : null}
        </div>
      </form>
    </div>
    <div id="message-tray"></div>
  `;
}
function getInput(index, datatype, value, titleText = '') {
    if (datatype === VarOrConstantConstantTypeEnum.DateTime) {
        value = (value === null || value === void 0 ? void 0 : value.split('T')[0]) || 'value'; // Take only date from ISO format 2022-01-01T00:00:....
    }
    let placeholder = value || 'value';
    return $ `
    <input
      type="${getInputType(datatype)}"
      placeholder="${placeholder}"
      value="${value}"
      title="${titleText}"
      index="${index + 1}"
      required
    />`;
}
function getSelect(defaultOpt, options, disabled = false) {
    const isDefaultAlreadySet = options.includes(defaultOpt);
    return $ `
    <select required ?disabled=${disabled}>
      ${isDefaultAlreadySet ? null : $ `<option value="" hidden selected>${defaultOpt}</option>`}
      ${options.map(op => {
        if (op === defaultOpt)
            return $ `<option value="${op}" selected>${op}</option>`;
        else
            return $ `<option value="${op}">${op}</option>`;
    })}
    </select>
  `;
}
function getInputType(datatype) {
    switch (datatype) {
        case VarOrConstantConstantTypeEnum.DateTime:
            return 'date';
        case VarOrConstantConstantTypeEnum.Decimal:
            return 'number';
        case VarOrConstantConstantTypeEnum.String:
            return 'text';
        default:
            return '';
    }
}

function validateForm (form) {
    const inputs = form.querySelectorAll('input');
    const selects = form.querySelectorAll('select');
    let isValid = true;
    inputs === null || inputs === void 0 ? void 0 : inputs.forEach(input => {
        isValid = isValid && validateInputElement(input);
    });
    selects === null || selects === void 0 ? void 0 : selects.forEach(select => {
        isValid = isValid && validateSelectElement(select);
    });
    return isValid;
}
function validateInputElement(input) {
    const validityState = input.validity;
    if (validityState.valueMissing) {
        input.setCustomValidity('Please fill out this field.');
    }
    else if (validityState.rangeUnderflow) {
        input.setCustomValidity(`Please select a number that is no lower than ${input.min}`);
    }
    else if (validityState.rangeOverflow) {
        input.setCustomValidity(`Please select a number that is no greater than ${input.max}`);
    }
    else if (validityState.typeMismatch) {
        input.setCustomValidity(`Please select a ${input.type}`);
    }
    else {
        input.setCustomValidity('');
    }
    return input.reportValidity();
}
function validateSelectElement(select) {
    if (!select.checkValidity()) {
        select.setCustomValidity('Please select an item in the list.');
    }
    const returnValue = select.reportValidity();
    // reset message, otherwise checkValidity returns always false at next validations
    select.setCustomValidity('');
    return returnValue;
}

var formStyle = r$2 `
  :host {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0)
  }

  .dialog-body {
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
    min-width: 350px;
    max-width: 450px;
    padding: 8px;
    margin-top: 8px;
  }

  .form, .inputs-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .form {
    margin: 0 12px;
  }

  .gscape-panel {
    max-height: unset;
  }

  .selects-wrapper {
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .inputs-wrapper {
    flex-direction: column;
    overflow: auto;
    max-height: 260px;
    padding-right: 8px;
  }

  .inputs-wrapper gscape-button {
    --gscape-icon-size: 18px;
  }

  .bottom-buttons {
    display:flex;
    width: 100%;
    justify-content: end;
    gap: 4px;
  }

  .section-header {
    text-align: center;
    font-weight: bold;
    border-bottom: solid 1px var(--theme-gscape-borders);
    color: var(--theme-gscape-secondary);
    width: 85%;
    margin: auto;
    margin-bottom: auto;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }

  #message-tray {
    font-size: 90%;
  }
  #message-tray > .correct-message {
    color: var(--gscape-color-success);
  }
  #message-tray > .error-message {
    color: var(--gscape-color-danger);
  }


  form *:invalid {
    border-color: var(--gscape-color-danger);
    background-color: var(--gscape-color-danger-muted);
  }

  form *:invalid:focus {
    box-shadow: var(--gscape-color-danger) 0px 0px 0px 1px inset;
    border-color: var(--gscape-color-danger);
  }

  form abbr {
    margin: 0 5px;
  }

  *:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

var sparqlingWidgetStyle = r$2 `
  .top-bar {
    font-size: 12px;
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    box-sizing: border-box;
    width: 100%;
    border-top-left-radius: var(--gscape-border-radius);
    border-top-right-radius: var(--gscape-border-radius);
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    background: var(--gscape-color-bg-inset);
  }

  .top-bar.traslated-down {
    top: unset;
    right: unset;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    width: fit-content;
    height: fit-content;
  }

  #widget-header {
    margin-left: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  #buttons-tray > * {
    position: initial;
  }

  #buttons-tray {
    display: flex;
    align-items: center;
    justify-content: end;
    flex-grow: 3;
    padding: 0 10px;
  }

  #buttons-tray > gscape-button {
    --gscape-icon-size: 20px;
  }

  #buttons-tray > input {
    max-width: 130px;
    margin: 0 5px;
    padding-right: 2px;
  }

  .gscape-panel {
    width: unset;
    max-width: unset;
    height: 100%;
    box-sizing: border-box;
    overflow: unset;
    padding: 0;
    padding-top: 27px;
  }

  .sparqling-blank-slate {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: unset;
    width: 100%;
    box-sizing: border-box;
  }

  [disabled] {
    cursor: not-allowed;
  }
`;

var Modality;
(function (Modality) {
    Modality["DEFINE"] = "Define";
    Modality["EDIT"] = "Edit";
})(Modality || (Modality = {}));
class SparqlingFormDialog extends ui.BaseMixin(s) {
    constructor() {
        super();
        this.modality = Modality.DEFINE;
        this.deleteCallback = (filterId) => { };
        // this.saveButton.onClick = () => this.handleSubmit()
        // this.deleteButton.onClick = () => this.deleteCallback(this._id)
        // this.deleteButton.classList.add('danger')
    }
    handleSubmit() {
        if (this.formElement && validateForm(this.formElement)) {
            this.onValidSubmit();
        }
    }
    onOperatorChange(value) {
        var _a, _b;
        this.operator = value;
        switch (this.operator) {
            case FilterExpressionOperatorEnum.In:
            case FilterExpressionOperatorEnum.NotIn:
                // IN and NOT IN needs at least 2 constants, so at least 3 parameters, variable + 2 constants
                if (this.parametersIriOrConstants && this.parametersIriOrConstants.length < 2) {
                    this.addInputValue(2 - this.parametersIriOrConstants.length);
                }
                break;
            case FunctionNameEnum.Ceil:
            case FunctionNameEnum.Floor:
            case FunctionNameEnum.Round:
            case FunctionNameEnum.Day:
            case FunctionNameEnum.Year:
            case FunctionNameEnum.Month:
            case FunctionNameEnum.Hours:
            case FunctionNameEnum.Minutes:
            case FunctionNameEnum.Seconds:
            case FunctionNameEnum.Lcase:
            case FunctionNameEnum.Ucase:
                (_a = this.parameters) === null || _a === void 0 ? void 0 : _a.splice(1); // no parameters
                break;
            default:
                (_b = this.parameters) === null || _b === void 0 ? void 0 : _b.splice(2);
                if (this.parametersIriOrConstants && this.parametersIriOrConstants.length <= 0) {
                    this.addInputValue();
                }
        }
    }
    onDatatypeChange(value) {
        this.datatype = value;
    }
    onInputChange(index, inputElem) {
        var _a;
        if (this.parameters) {
            if (this.datatype === VarOrConstantConstantTypeEnum.DateTime) {
                this.parameters[index].value = (_a = inputElem.valueAsDate) === null || _a === void 0 ? void 0 : _a.toISOString();
            }
            else {
                this.parameters[index].value = inputElem.value;
            }
        }
    }
    // show = () => {
    //   super.show()
    //   this.isDatatypeSelectorDisabled = this.datatype ? true : false
    // }
    addInputValue(number = 1) {
        var _a;
        for (let i = 0; i < number; i++) {
            (_a = this.parameters) === null || _a === void 0 ? void 0 : _a.push({
                type: this.parametersType,
                value: "",
                constantType: this.datatype
            });
        }
        this.requestUpdate();
    }
    removeInputValue() {
        var _a;
        (_a = this.parameters) === null || _a === void 0 ? void 0 : _a.pop();
        this.requestUpdate();
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.hide();
    }
    updated(_changedProperties) {
        var _a, _b, _c;
        super.updated(_changedProperties);
        if (this.selectOperatorElem)
            this.selectOperatorElem.onchange = () => this.onOperatorChange(this.selectOperatorElem.value);
        if (this.selectDatatypeElem)
            this.selectDatatypeElem.onchange = (e) => this.onDatatypeChange(this.selectDatatypeElem.value);
        (_a = this.inputElems) === null || _a === void 0 ? void 0 : _a.forEach((input) => input.onchange = (e) => this.onInputChange(input.getAttribute('index'), e.currentTarget));
        const addInputButton = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('#add-input-btn');
        if (addInputButton)
            addInputButton.onclick = () => this.addInputValue();
        const removeInputButton = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelector('#remove-input-btn');
        if (removeInputButton)
            removeInputButton.onclick = () => this.removeInputValue();
    }
    addMessage(msg, msgType) {
        if (!this.messagesElem)
            return;
        let msgDiv = document.createElement('div');
        msgDiv.classList.add(msgType);
        msgDiv.innerHTML = msg;
        this.messagesElem.appendChild(msgDiv);
    }
    resetMessages() {
        if (this.messagesElem)
            this.messagesElem.textContent = '';
    }
    setAsCorrect(customText) {
        const text = customText || 'Correctly Saved';
        this.addMessage(text, 'correct-message');
        setTimeout(() => this.resetMessages(), 2000);
    }
    onValidSubmit() {
        this.submitCallback(this._id, this.operator, this.parameters);
    }
    get selectOperatorElem() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#select-operator > select');
    }
    get selectDatatypeElem() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#select-datatype > select');
    }
    get inputElems() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.inputs-wrapper > input');
    }
    get messagesElem() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#message-tray');
    }
    get variable() {
        var _a;
        return (_a = this.parameters) === null || _a === void 0 ? void 0 : _a.find(p => p.type === VarOrConstantTypeEnum.Var);
    }
    get datatype() { var _a; return (_a = this.variable) === null || _a === void 0 ? void 0 : _a.constantType; }
    set datatype(value) {
        var _a;
        if (this.variable)
            this.variable.constantType = value;
        (_a = this.parameters) === null || _a === void 0 ? void 0 : _a.map(p => p.constantType = value);
        this.requestUpdate();
    }
    get parametersIriOrConstants() {
        var _a;
        return (_a = this.parameters) === null || _a === void 0 ? void 0 : _a.filter(p => p.type !== VarOrConstantTypeEnum.Var);
    }
    get formElement() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('form');
    }
}
SparqlingFormDialog.properties = {
    operator: { attribute: false },
    parameters: { attribute: false },
    modality: { attribute: false },
    datatype: { attribute: false },
    aggregateOperator: { attribute: false },
};
SparqlingFormDialog.styles = [
    ui.baseStyle,
    formStyle,
    sparqlingWidgetStyle
];

const rubbishBin = y `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M6.5 17q-.625 0-1.062-.438Q5 16.125 5 15.5v-10H4V4h4V3h4v1h4v1.5h-1v10q0 .625-.438 1.062Q14.125 17 13.5 17Zm7-11.5h-7v10h7ZM8 14h1.5V7H8Zm2.5 0H12V7h-1.5Zm-4-8.5v10Z"/></svg>`;
const code = y `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M12 16v-1.5h1.75q.312 0 .531-.219.219-.219.219-.531v-1.5q0-.854.573-1.469.573-.614 1.427-.719v-.083q-.854-.167-1.427-.771-.573-.604-.573-1.458v-1.5q0-.312-.219-.531-.219-.219-.531-.219H12V4h1.75q.938 0 1.594.656Q16 5.312 16 6.25v1.5q0 .312.219.531.219.219.531.219H18v3h-1.25q-.312 0-.531.219-.219.219-.219.531v1.5q0 .938-.656 1.594-.656.656-1.594.656Zm-5.75 0q-.938 0-1.594-.656Q4 14.688 4 13.75v-1.5q0-.312-.219-.531-.219-.219-.531-.219H2v-3h1.25q.312 0 .531-.219Q4 8.062 4 7.75v-1.5q0-.938.656-1.594Q5.312 4 6.25 4H8v1.5H6.25q-.312 0-.531.219-.219.219-.219.531v1.5q0 .875-.573 1.49-.573.614-1.427.718v.084q.854.083 1.427.708.573.625.573 1.5v1.5q0 .312.219.531.219.219.531.219H8V16Z"/></svg>`;
// https://github.com/Templarian/MaterialDesign/blob/master/svg/table-eye.svg
const tableEye = y `<svg fill="currentColor" viewBox="0 0 24 24" style="height: 20px; width: 20px; padding:2px; box-sizing: border-box"><path d="M17 16.88C17.56 16.88 18 17.32 18 17.88S17.56 18.88 17 18.88 16 18.43 16 17.88 16.44 16.88 17 16.88M17 13.88C19.73 13.88 22.06 15.54 23 17.88C22.06 20.22 19.73 21.88 17 21.88S11.94 20.22 11 17.88C11.94 15.54 14.27 13.88 17 13.88M17 15.38C15.62 15.38 14.5 16.5 14.5 17.88S15.62 20.38 17 20.38 19.5 19.26 19.5 17.88 18.38 15.38 17 15.38M18 3H4C2.9 3 2 3.9 2 5V17C2 18.1 2.9 19 4 19H9.42C9.26 18.68 9.12 18.34 9 18C9.12 17.66 9.26 17.32 9.42 17H4V13H10V15.97C10.55 15.11 11.23 14.37 12 13.76V13H13.15C14.31 12.36 15.62 12 17 12C18.06 12 19.07 12.21 20 12.59V5C20 3.9 19.1 3 18 3M10 11H4V7H10V11M18 11H12V7H18V11Z" /></svg>`;
// https://github.com/Templarian/MaterialDesign/blob/master/svg/asterisk.svg
const asterisk = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M11,3H13V10.27L19.29,6.64L20.29,8.37L14,12L20.3,15.64L19.3,17.37L13,13.72V21H11V13.73L4.69,17.36L3.69,15.63L10,12L3.72,8.36L4.72,6.63L11,10.26V3Z" /></svg>`;
// https://cygri.github.io/rdf-logos/
const rdfLogo = y `<svg viewBox="0 0 943 1019" style="fill: currentColor; display: inline-block; height: 20px; width: 20px; padding:2px; box-sizing: border-box"><path fill-rule="evenodd" d="M845,668c-6-3-13-6-19-9l5-0c0,0-42-18-45-152 c-4-133,40-156,40-156l-0,0c33-17,61-43,79-78c48-91,14-203-77-252 C729-26,617,8,569,99c-20,37-25,78-19,117l-2-3c0,0,11,48-103,119 c-113,71-165,35-165,35l3,5c-3-2-6-4-10-6C183,317,70,352,22,443 c-48,91-14,203,77,252c68,36,147,26,204-19l-1,2c0,0,41-34,160,30 c94,50,108,100,110,118c-2,69,33,137,98,171c91,48,203,14,252-77 C970,829,935,717,845,668z M635,693c-15,5-58,11-148-37 c-98-53-113-97-115-110c1-16,1-32-2-48l1,1c0,0-8-43,104-112 c100-62,146-50,154-47c5,4,11,7,17,10c11,6,23,11,35,14 c14,13,39,50,42,149c3,99-26,137-42,150C664,671,648,681,635,693z   M622,81c-54,59-55,146-3,196c-26-25-25-77,1-126 c3-4,13-15,27-10c1,0,2,1,3,1c3,1,7,1,10,1 c22-1,38-19,37-41c-0-10-4-18-11-25c50-33,107-37,131-15l1,0 C765,12,677,21,622,81z   M78,431c-54,59-55,146-03,196c-26-25-25-77,1-126 c3-4,13-15,27-10c1,0,2,1,3,1c3,1,7,1,10,1 c22-1,38-19,37-41c-0-10-4-18-11-25c50-33,107-37,131-15l1,0 C221,363,133,371,78,431z   M654,728c-54,59-55,146-3,196c-26-25-25-77,1-126 c3-4,13-15,27-10c1,0,2,1,3,1c3,1,7,1,10,1 c22-1,38-19,37-41c-0-10-4-18-11-25c50-33,107-37,131-15l1,0 C797,659,709,668,654,728z"></path></svg>`;
const crosshair = y `<svg fill="currentcolor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M9.333 18.5v-1.458q-2.541-.271-4.323-2.052-1.781-1.782-2.052-4.323H1.5V9.333h1.458Q3.229 6.792 5.01 5.01q1.782-1.781 4.323-2.052V1.5h1.334v1.458q2.541.271 4.323 2.052 1.781 1.782 2.052 4.323H18.5v1.334h-1.458q-.271 2.541-2.052 4.323-1.782 1.781-4.323 2.052V18.5ZM10 15.729q2.396 0 4.062-1.667 1.667-1.666 1.667-4.062 0-2.396-1.667-4.062Q12.396 4.271 10 4.271q-2.396 0-4.062 1.667Q4.271 7.604 4.271 10q0 2.396 1.667 4.062Q7.604 15.729 10 15.729Zm0-2.75q-1.229 0-2.104-.875T7.021 10q0-1.229.875-2.104T10 7.021q1.229 0 2.104.875T12.979 10q0 1.229-.875 2.104T10 12.979Zm0-1.333q.667 0 1.156-.49.49-.489.49-1.156 0-.667-.49-1.156-.489-.49-1.156-.49-.667 0-1.156.49-.49.489-.49 1.156 0 .667.49 1.156.489.49 1.156.49Zm.021-1.667Z"/></svg>`;
// https://materialdesignicons.com/icon/lightbulb-question
const lightbulb = y `<svg fill="currentcolor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20" style="padding:1px; box-sizing:border-box"><path d="m18.292 8.375-.521-1.187-1.188-.521 1.188-.542.521-1.167.541 1.167L20 6.667l-1.167.521Zm-2.459-3.292-.812-1.729-1.729-.812 1.729-.813L15.833 0l.813 1.729 1.729.813-1.729.812ZM7.5 18.333q-.688 0-1.177-.489-.49-.49-.49-1.177h3.313q0 .687-.479 1.177-.479.489-1.167.489Zm-3.333-2.416v-1.75h6.645v1.75Zm.229-2.5q-1.458-.855-2.302-2.302-.844-1.448-.844-3.157 0-2.646 1.802-4.468Q4.854 1.667 7.5 1.667q2.604 0 4.417 1.823 1.812 1.822 1.812 4.468 0 1.709-.844 3.157-.843 1.447-2.302 2.302Zm.542-1.75h5.124Q11 11 11.49 10.042q.489-.959.489-2.084 0-1.896-1.291-3.218Q9.396 3.417 7.5 3.417q-1.896 0-3.198 1.323Q3 6.062 3 7.958q0 1.125.5 2.084.5.958 1.438 1.625Zm2.562 0Z"/></svg>`;
// https://materialdesignicons.com/icon/filter-plus
const addFilter$1 = y `<svg  fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px" style="padding: 1px; box-sizing:border-box"><path d="M12 12V19.88C12.04 20.18 11.94 20.5 11.71 20.71C11.32 21.1 10.69 21.1 10.3 20.71L8.29 18.7C8.06 18.47 7.96 18.16 8 17.87V12H7.97L2.21 4.62C1.87 4.19 1.95 3.56 2.38 3.22C2.57 3.08 2.78 3 3 3H17C17.22 3 17.43 3.08 17.62 3.22C18.05 3.56 18.13 4.19 17.79 4.62L12.03 12H12M15 17H18V14H20V17H23V19H20V22H18V19H15V17Z" /></svg>`;
// https://materialdesignicons.com/icon/pencil
const edit = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>`;
// https://materialdesignicons.com/icon/playlist-edit
const editList = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M2,6V8H14V6H2M2,10V12H14V10H2M20.04,10.13C19.9,10.13 19.76,10.19 19.65,10.3L18.65,11.3L20.7,13.35L21.7,12.35C21.92,12.14 21.92,11.79 21.7,11.58L20.42,10.3C20.31,10.19 20.18,10.13 20.04,10.13M18.07,11.88L12,17.94V20H14.06L20.12,13.93L18.07,11.88M2,14V16H10V14H2Z" /></svg>`;
// https://materialdesignicons.com/icon/filter
const filter = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" /></svg>`;
// https://materialdesignicons.com/icon/table-column-plus-after
const tableColumnPlus = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M11,2A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H2V2H11M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M15,11H18V8H20V11H23V13H20V16H18V13H15V11Z" /></svg>`;
const questionMarkDashed = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M13 2.03V4.05C17.39 4.59 20.5 8.58 19.96 12.97C19.5 16.61 16.64 19.5 13 19.93V21.93C18.5 21.38 22.5 16.5 21.95 11C21.5 6.25 17.73 2.5 13 2.03M11 2.06C9.05 2.25 7.19 3 5.67 4.26L7.1 5.74C8.22 4.84 9.57 4.26 11 4.06V2.06M4.26 5.67C3 7.19 2.25 9.04 2.05 11H4.05C4.24 9.58 4.8 8.23 5.69 7.1L4.26 5.67M2.06 13C2.26 14.96 3.03 16.81 4.27 18.33L5.69 16.9C4.81 15.77 4.24 14.42 4.06 13H2.06M7.1 18.37L5.67 19.74C7.18 21 9.04 21.79 11 22V20C9.58 19.82 8.23 19.25 7.1 18.37M20 4H44M13 18H11V16H13V18M13 15H11C11 11.75 14 12 14 10C14 8.9 13.1 8 12 8S10 8.9 10 10H8C8 7.79 9.79 6 12 6S16 7.79 16 10C16 12.5 13 12.75 13 15Z" /></svg>`;
// https://materialdesignicons.com/icon/content-copy
const copyContent = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px" style="padding: 1px; box-sizing:border-box"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" /></svg>`;
// https://materialdesignicons.com/icon/alpha-s-circle
//export const sparqlingIcon = svg`<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M11,7A2,2 0 0,0 9,9V11A2,2 0 0,0 11,13H13V15H9V17H13A2,2 0 0,0 15,15V13A2,2 0 0,0 13,11H11V9H15V7H11M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z" /></svg>`
// https://materialdesignicons.com/icon/play-circle-outline
const playOutlined = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z" /></svg>`;
// https://materialdesignicons.com/icon/refresh
const refresh = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" /></svg>`;
const dragHandler = y `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M7.5 15.688q-.5 0-.844-.355-.344-.354-.344-.833 0-.5.355-.844.354-.344.833-.344.5 0 .844.355.344.354.344.833 0 .5-.355.844-.354.344-.833.344Zm5 0q-.5 0-.844-.355-.344-.354-.344-.833 0-.5.355-.844.354-.344.833-.344.5 0 .844.355.344.354.344.833 0 .5-.355.844-.354.344-.833.344Zm-5-4.5q-.5 0-.844-.355-.344-.354-.344-.833 0-.5.355-.844.354-.344.833-.344.5 0 .844.355.344.354.344.833 0 .5-.355.844-.354.344-.833.344Zm5 0q-.5 0-.844-.355-.344-.354-.344-.833 0-.5.355-.844.354-.344.833-.344.5 0 .844.355.344.354.344.833 0 .5-.355.844-.354.344-.833.344Zm-5-4.5q-.5 0-.844-.355-.344-.354-.344-.833 0-.5.355-.844.354-.344.833-.344.5 0 .844.355.344.354.344.833 0 .5-.355.844-.354.344-.833.344Zm5 0q-.5 0-.844-.355-.344-.354-.344-.833 0-.5.355-.844.354-.344.833-.344.5 0 .844.355.344.354.344.833 0 .5-.355.844-.354.344-.833.344Z"/></svg>`;
// https://materialdesignicons.com/icon/function
const functionIcon = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M15.6,5.29C14.5,5.19 13.53,6 13.43,7.11L13.18,10H16V12H13L12.56,17.07C12.37,19.27 10.43,20.9 8.23,20.7C6.92,20.59 5.82,19.86 5.17,18.83L6.67,17.33C6.91,18.07 7.57,18.64 8.4,18.71C9.5,18.81 10.47,18 10.57,16.89L11,12H8V10H11.17L11.44,6.93C11.63,4.73 13.57,3.1 15.77,3.3C17.08,3.41 18.18,4.14 18.83,5.17L17.33,6.67C17.09,5.93 16.43,5.36 15.6,5.29Z" /></svg>`;
// https://materialdesignicons.com/icon/sort-alphabetical-variant
const sortIcon = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M9.25,5L12.5,1.75L15.75,5H9.25M15.75,19L12.5,22.25L9.25,19H15.75M8.89,14.3H6L5.28,17H2.91L6,7H9L12.13,17H9.67L8.89,14.3M6.33,12.68H8.56L7.93,10.56L7.67,9.59L7.42,8.63H7.39L7.17,9.6L6.93,10.58L6.33,12.68M13.05,17V15.74L17.8,8.97V8.91H13.5V7H20.73V8.34L16.09,15V15.08H20.8V17H13.05Z" /></svg>`;
// https://materialdesignicons.com/icon/sort-alphabetical-ascending
const sortAscendingIcon = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M19 17H22L18 21L14 17H17V3H19M11 13V15L7.67 19H11V21H5V19L8.33 15H5V13M9 3H7C5.9 3 5 3.9 5 5V11H7V9H9V11H11V5C11 3.9 10.11 3 9 3M9 7H7V5H9Z" /></svg>`;
// https://materialdesignicons.com/icon/sort-alphabetical-descending
const sortDescendingIcon = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M19 7H22L18 3L14 7H17V21H19M11 13V15L7.67 19H11V21H5V19L8.33 15H5V13M9 3H7C5.9 3 5 3.9 5 5V11H7V9H9V11H11V5C11 3.9 10.11 3 9 3M9 7H7V5H9Z" /></svg>`;
// https://materialdesignicons.com/icon/sigma
const sigma = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M18,6H8.83L14.83,12L8.83,18H18V20H6V18L12,12L6,6V4H18V6Z" /></svg>`;
// https://materialdesignicons.com/icon/gesture-double-tap
const dbClick = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5M11,3A6,6 0 0,1 17,9C17,10.7 16.29,12.23 15.16,13.33L14.16,12.88C15.28,11.96 16,10.56 16,9A5,5 0 0,0 11,4A5,5 0 0,0 6,9C6,11.05 7.23,12.81 9,13.58V14.66C6.67,13.83 5,11.61 5,9A6,6 0 0,1 11,3Z" /></svg>`;
// https://materialdesignicons.com/icon/counter
const counter = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H18.76C19,6.54 18.95,7.07 18.95,7.13C18.88,7.8 18.41,8.5 18.24,8.75L15.91,11.3L19.23,11.28L19.24,12.5L14.04,12.47L14,11.47C14,11.47 17.05,8.24 17.2,7.95C17.34,7.67 17.91,6 16.5,6C15.27,6.05 15.41,7.3 15.41,7.3L13.87,7.31C13.87,7.31 13.88,6.65 14.25,6H13V18H15.58L15.57,17.14L16.54,17.13C16.54,17.13 17.45,16.97 17.46,16.08C17.5,15.08 16.65,15.08 16.5,15.08C16.37,15.08 15.43,15.13 15.43,15.95H13.91C13.91,15.95 13.95,13.89 16.5,13.89C19.1,13.89 18.96,15.91 18.96,15.91C18.96,15.91 19,17.16 17.85,17.63L18.37,18H20M8.92,16H7.42V10.2L5.62,10.76V9.53L8.76,8.41H8.92V16Z" /></svg>`;
// https://materialdesignicons.com/icon/progress-close
const dashedCross = y `<svg fill="currentColor" viewBox="0 0 24 24" height="20px" width="20px"><path d="M13 2.03V4.05C17.39 4.59 20.5 8.58 19.96 12.97C19.5 16.61 16.64 19.5 13 19.93V21.93C18.5 21.38 22.5 16.5 21.95 11C21.5 6.25 17.73 2.5 13 2.03M11 2.06C9.05 2.25 7.19 3 5.67 4.26L7.1 5.74C8.22 4.84 9.57 4.26 11 4.06V2.06M4.26 5.67C3 7.19 2.25 9.04 2.05 11H4.05C4.24 9.58 4.8 8.23 5.69 7.1L4.26 5.67M2.06 13C2.26 14.96 3.03 16.81 4.27 18.33L5.69 16.9C4.81 15.77 4.24 14.42 4.06 13H2.06M7.1 18.37L5.67 19.74C7.18 21 9.04 21.79 11 22V20C9.58 19.82 8.23 19.25 7.1 18.37M14.59 8L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41L14.59 8Z" /></svg>`;
const kebab = y `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M5.688 11.083q-.459 0-.771-.323-.313-.322-.313-.76 0-.458.323-.771.323-.312.761-.312.458 0 .77.323.313.322.313.76 0 .458-.313.771-.312.312-.77.312Zm4.312 0q-.458 0-.771-.323-.312-.322-.312-.76 0-.458.323-.771.322-.312.76-.312.458 0 .771.323.312.322.312.76 0 .458-.323.771-.322.312-.76.312Zm4.312 0q-.458 0-.77-.323-.313-.322-.313-.76 0-.458.313-.771.312-.312.77-.312.459 0 .771.323.313.322.313.76 0 .458-.323.771-.323.312-.761.312Z"/></svg>`;
const expandMore = y `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m10 12.792-4.708-4.73.77-.77L10 11.229l3.938-3.937.77.77Z"/></svg>`;
const expandLess = y `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m6.062 12.729-.77-.791L10 7.229l4.708 4.709-.77.791L10 8.792Z"/></svg>`;
const placeItem = y `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M4.5 17.083q-.667 0-1.125-.458-.458-.458-.458-1.125V7.833q0-.666.458-1.125.458-.458 1.125-.458h2.896v1.333H4.5q-.083 0-.167.084-.083.083-.083.166V15.5q0 .083.083.167.084.083.167.083h11q.083 0 .167-.083.083-.084.083-.167V7.833q0-.083-.083-.166-.084-.084-.167-.084h-2.896V6.25H15.5q.667 0 1.125.458.458.459.458 1.125V15.5q0 .667-.458 1.125-.458.458-1.125.458Zm5.5-4.041L6.938 9.979l.937-.937L9.333 10.5V.625h1.334V10.5l1.458-1.458.937.937Z"/></svg>`;
const error = y `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M10 13.771q.25 0 .417-.167.166-.166.166-.416 0-.25-.166-.417-.167-.167-.417-.167-.25 0-.417.167-.166.167-.166.417 0 .25.166.416.167.167.417.167Zm-.542-2.709h1.084v-5H9.458ZM10 17.583q-1.562 0-2.948-.593-1.385-.594-2.417-1.625-1.031-1.032-1.625-2.417-.593-1.386-.593-2.948 0-1.583.593-2.958.594-1.375 1.625-2.407Q5.667 3.604 7.052 3.01 8.438 2.417 10 2.417q1.583 0 2.958.593 1.375.594 2.407 1.625 1.031 1.032 1.625 2.417.593 1.386.593 2.948t-.593 2.948q-.594 1.385-1.625 2.417-1.032 1.031-2.417 1.625-1.386.593-2.948.593Zm0-1.083q2.708 0 4.604-1.896T16.5 10q0-2.708-1.896-4.604T10 3.5q-2.708 0-4.604 1.896T3.5 10q0 2.708 1.896 4.604T10 16.5Zm0-6.5Z"/></svg>`;
const ellipsis = y `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M0 5.75C0 4.784.784 4 1.75 4h12.5c.966 0 1.75.784 1.75 1.75v4.5A1.75 1.75 0 0114.25 12H1.75A1.75 1.75 0 010 10.25v-4.5zM4 7a1 1 0 100 2 1 1 0 000-2zm3 1a1 1 0 112 0 1 1 0 01-2 0zm5-1a1 1 0 100 2 1 1 0 000-2z"></path></svg>`;

var _a, _b;
class FilterDialog extends (_b = SparqlingFormDialog) {
    constructor() {
        super();
        this.deleteCallback = (filterId) => { };
        // this.saveButton.label = "Save Filter"
    }
    render() {
        this.title = `${this.modality} filter for ${this.variableName}`;
        return $ `
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${filter}
            <span>${this.title}</span>
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="dialog-body">
          ${getFormTemplate(this, Object.values(FilterExpressionOperatorEnum))}
          
          <div class="bottom-buttons">
            ${this.modality === Modality.EDIT
            ? $ `
                <gscape-button type="subtle" title="Delete" style="margin-right: auto" id="delete-button" @click=${this.handleDeleteClick}>
                  <span slot="icon">${rubbishBin}</span>
                </gscape-button>
              `
            : null}
            <gscape-button label="Cancel" @click=${this.hide}></gscape-button>
            <gscape-button type="primary" @click=${this.handleSubmit} label="Save Filter"></gscape-button>
          </div>
        </div>
      </div>
    `;
    }
    onSubmit(callback) {
        this.submitCallback = callback;
    }
    onDelete(callback) {
        this.deleteCallback = callback;
    }
    handleDeleteClick() {
        this.deleteCallback(this._id);
    }
}
_a = FilterDialog;
FilterDialog.styles = Reflect.get(_b, "styles", _a);
customElements.define('sparqling-filter-dialog', FilterDialog);

function getElemWithOperatorStyle() {
    return r$2 `
    .elem-with-operator {
      display: flex;
      gap: 10px;
      align-items:center;
      justify-content: center;
      padding-left: 8px;
    }

    .parameters {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex-grow:2;
      min-width: 0;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .parameter {
      background: var(--gscape-color-neutral-subtle);
      padding: 4px;
      padding-bottom: 4px;
      padding-bottom: 1px;
      border-radius: var(--gscape-border-radius);
      border: solid 1px var(--gscape-color-border-subtle);
    }
  `;
}

function getTrayButtonTemplate(title, icon, alternateIcon, id, clickHandler = (e) => { }) {
    return $ `
    <gscape-button
      id=${id}
      size="s"
      type="subtle"
      title=${title}
      @click=${clickHandler}
    >
      <span slot="icon">${icon}</span>
      ${alternateIcon
        ? $ `<span slot="alt-icon">${alternateIcon}</span>`
        : null}
    </gscape-button>
  `;
}

function getElemWithOperatorList(list, editElemCallback, deleteElemCallback) {
    return $ `
    ${list === null || list === void 0 ? void 0 : list.map((elemWithOperator) => {
        var _a, _b;
        const elem = elemWithOperator.value || elemWithOperator;
        const operator = ((_a = elem === null || elem === void 0 ? void 0 : elem.expression) === null || _a === void 0 ? void 0 : _a.operator) || elem.name || elem.aggregateFunction;
        if (!operator)
            return null;
        const parameters = ((_b = elem.expression) === null || _b === void 0 ? void 0 : _b.parameters) || elem.parameters;
        const operatorFullName = Object.keys(FilterExpressionOperatorEnum).find(k => { var _a; return FilterExpressionOperatorEnum[k] === ((_a = elem.expression) === null || _a === void 0 ? void 0 : _a.operator); })
            || Object.keys(FunctionNameEnum).find(k => FunctionNameEnum[k] === elem.name)
            || Object.keys(GroupByElementAggregateFunctionEnum).find(k => GroupByElementAggregateFunctionEnum[k] === elem.aggregateFunction);
        // const editButton = new UI.GscapeButton(edit, 'Edit Filter')
        // const deleteButton = new UI.GscapeButton(rubbishBin, 'Delete Filter')
        // if (editElemCallback) {
        //   editButton.onClick = () => editElemCallback(elemWithOperator.id)
        // }
        // if (deleteElemCallback) {
        //   deleteButton.onClick = () => deleteElemCallback(elemWithOperator.id)
        //   deleteButton.classList.add('danger')
        // }
        return $ `
        <div class="elem-with-operator">
          <div class="chip" title="${operatorFullName}">${operator}</div>

          ${parameters
            ? $ `
              <div class="parameters">
                ${parameters === null || parameters === void 0 ? void 0 : parameters.map((param, index) => {
                if (index === 0)
                    return null;
                let value = param.value;
                if (param.constantType === VarOrConstantConstantTypeEnum.DateTime) {
                    value = (value === null || value === void 0 ? void 0 : value.split('T')[0]) || value; // Take only date from ISO format 2022-01-01T00:00:....
                }
                return $ `
                    <div class="parameter ellipsed">
                      ${value}
                    </div>
                  `;
            })}
              </div>
            `
            : null}

          <div>
            ${editElemCallback
            ? getTrayButtonTemplate('Edit', edit, undefined, `edit-${elemWithOperator.id}`, () => editElemCallback(elemWithOperator.id))
            : null}
            ${deleteElemCallback
            ? getTrayButtonTemplate('Delete', rubbishBin, undefined, `delete-${elemWithOperator.id}`, () => deleteElemCallback(elemWithOperator.id))
            : null}
          </div>
        </div>
      `;
    })}
  `;
}

class FilterListDialog extends ui.BaseMixin(s) {
    constructor() {
        super(...arguments);
        this.filterList = [];
        this.title = ' ';
        this.editFilterCallback = () => { };
        this.deleteFilterCallback = () => { };
    }
    static get properties() {
        const props = {
            filterList: { attribute: false },
            variable: { attribute: false },
        };
        return Object.assign(props, super.properties);
    }
    static get styles() {
        return [
            ui.baseStyle,
            sparqlingWidgetStyle,
            getElemWithOperatorStyle(),
            r$2 `
        :host {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, 0)
        }

        .dialog-body {
          display:flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px 5px;
        }

        gscape-button {
          position: initial;
        }

        .danger:hover {
          color: var(--theme-gscape-error);
        }
      `,
        ];
    }
    render() {
        this.title = `Defined Filters for ${this.variable}`;
        return $ `
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${filter}
            <span>${this.title}</span>
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="dialog-body">
        ${this.filterList
            ? getElemWithOperatorList(this.filterList, this.editFilterCallback, this.deleteFilterCallback)
            : null}
        </div>
      </div>
    `;
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.hide();
    }
    onEdit(callback) {
        this.editFilterCallback = callback;
    }
    onDelete(callback) {
        this.deleteFilterCallback = callback;
    }
}
customElements.define('sparqling-filter-list', FilterListDialog);

class HighlightsList extends ui.BaseMixin(ui.DropPanelMixin(s)) {
    constructor() {
        super();
        this.title = 'Suggestions';
        this.searchEntityComponent = new ui.GscapeEntitySearch();
        this._onSuggestionLocalization = (element) => { };
        this._onSuggestionAddToQuery = (entityIri, entityType, relatedClassIri) => { };
        this.togglePanel = () => {
            super.togglePanel();
            this.requestUpdate();
        };
        this.searchEntityComponent.onSearch(e => {
            var _a, _b, _c, _d;
            const inputElement = e.target;
            if (e.key === 'Escape') {
                inputElement.value = '';
                inputElement.blur();
                this.setHighlights();
            }
            else {
                if (this.allHighlights && this.highlights && ((_a = inputElement.value) === null || _a === void 0 ? void 0 : _a.length) > 2) {
                    const isAmatch = (value1, value2) => value1.toLowerCase().includes(value2.toLowerCase());
                    this.highlights.classes = (_b = this.highlights.classes) === null || _b === void 0 ? void 0 : _b.filter(classIri => isAmatch(classIri, inputElement.value));
                    this.highlights.dataProperties = (_c = this.highlights.dataProperties) === null || _c === void 0 ? void 0 : _c.filter(dataPropertyIri => isAmatch(dataPropertyIri, inputElement.value));
                    this.highlights.objectProperties = (_d = this.highlights.objectProperties) === null || _d === void 0 ? void 0 : _d.filter(branch => branch.objectPropertyIRI ? isAmatch(branch.objectPropertyIRI, inputElement.value) : false);
                    this.requestUpdate();
                }
                else {
                    this.setHighlights();
                }
            }
        });
        this.searchEntityComponent.onEntityFilterToggle(() => this.setHighlights());
    }
    render() {
        return $ `
      ${this.isPanelClosed()
            ? $ `
          <div>
            <gscape-button 
              id="toggle-panel-button"
              @click=${this.togglePanel}
              label=${this.title}
            > 
              <span slot="icon">${lightbulb}</span>
              <span slot="trailing-icon">${ui.icons.plus}</span>
            </gscape-button>
          </div>
        `
            : $ `
          <div class="gscape-panel" id="drop-panel">
            <div class="top-bar">
              <div id="widget-header" class="bold-text">
                ${lightbulb}
                <span>${this.title}</span>
              </div>

              <gscape-button 
                id="toggle-panel-button"
                size="s" 
                type="subtle"
                @click=${this.togglePanel}
              > 
                <span slot="icon">${ui.icons.minus}</span>
              </gscape-button>
            </div>
            ${this.searchEntityComponent}
            <div class="list">
              ${this.highlights
                ? $ `
                  ${this.dataProperties.map((dataPropertyIri) => this.getEntitySuggestionTemplate(dataPropertyIri, EntityTypeEnum.DataProperty))}
                  ${this.objectProperties.map(objectPropertyHighlight => this.getObjectPropertySuggestionTemplate(objectPropertyHighlight))}
                  ${this.classes.map((classIri) => this.getEntitySuggestionTemplate(classIri, EntityTypeEnum.Class))}
                `
                : $ `
                  <div class="blank-slate">
                    ${ui.icons.searchOff}
                    <div class="header">No suggestions available</div>
                    <div class="description">Add elements to the query and we will provide you next steps suggestions</div>
                  </div>
                `}
              
            </div>
          </div>
        `}
    `;
    }
    getObjectPropertySuggestionTemplate(objectPropertyHighlight) {
        var _a;
        return $ `
      <details class="ellipsed entity-list-item" iri=${objectPropertyHighlight.objectPropertyIRI} title=${objectPropertyHighlight.objectPropertyIRI}>
        <summary class="actionable">
          <span class="entity-icon">${ui.icons.objectPropertyIcon}</span>
          <span @click=${this.handleEntityNameClick} class="entity-name">
            ${objectPropertyHighlight.objectPropertyIRI}
          </span>
        </summary>

        <div class="summary-body">
          ${(_a = objectPropertyHighlight.relatedClasses) === null || _a === void 0 ? void 0 : _a.map((relatedClass) => this.getEntitySuggestionTemplate(relatedClass, EntityTypeEnum.Class, objectPropertyHighlight.objectPropertyIRI))}
        </div>
      </details>
    `;
    }
    getEntitySuggestionTemplate(entityIri, entityType, objectPropertyIri) {
        let entityIcon;
        switch (entityType) {
            case EntityTypeEnum.Class:
                entityIcon = ui.icons.classIcon;
                break;
            case EntityTypeEnum.DataProperty:
                entityIcon = ui.icons.dataPropertyIcon;
                break;
            case EntityTypeEnum.ObjectProperty:
            case EntityTypeEnum.InverseObjectProperty:
                entityIcon = ui.icons.objectPropertyIcon;
                break;
        }
        return $ `
      <div iri=${entityIri} entity-type="${entityType}" class="ellipsed entity-list-item">
        <span class="entity-icon">${entityIcon}</span>
        <span class="entity-name actionable" @click=${this.handleEntityNameClick}>${entityIri}</span>
        <span class="actions">
          ${getTrayButtonTemplate('Add to query', placeItem, undefined, 'add-to-query-action', (e) => {
            this.handleAddToQueryClick(e, objectPropertyIri);
        })}
        </span>
      </div>
    `;
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.closePanel();
        this.requestUpdate();
        this.hide();
    }
    handleEntityNameClick(e) {
        var _a;
        e.preventDefault();
        const entityIri = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.getAttribute('iri');
        if (entityIri)
            this._onSuggestionLocalization(entityIri);
    }
    handleAddToQueryClick(e, objectPropertyIri) {
        var _a, _b, _c, _d;
        e.preventDefault();
        const entityIri = (_b = (_a = e.currentTarget.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getAttribute('iri');
        const entityType = (_d = (_c = e.currentTarget.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.getAttribute('entity-type');
        if (entityIri && entityType) {
            if (objectPropertyIri) { // if it's from object property, then the entityIri is the relatedClass iri
                this._onSuggestionAddToQuery(objectPropertyIri, EntityTypeEnum.ObjectProperty, entityIri);
            }
            else {
                this._onSuggestionAddToQuery(entityIri, entityType);
            }
        }
    }
    onSuggestionLocalization(callback) {
        this._onSuggestionLocalization = callback;
    }
    onSuggestionAddToQuery(callback) {
        this._onSuggestionAddToQuery = callback;
    }
    get objectProperties() {
        var _a, _b;
        return ((_b = (_a = this.highlights) === null || _a === void 0 ? void 0 : _a.objectProperties) === null || _b === void 0 ? void 0 : _b.sort((a, b) => {
            if (a.objectPropertyIRI && b.objectPropertyIRI)
                return a.objectPropertyIRI.localeCompare(b.objectPropertyIRI);
            else
                return 0;
        })) || [];
    }
    get classes() {
        var _a, _b;
        return ((_b = (_a = this.highlights) === null || _a === void 0 ? void 0 : _a.classes) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.localeCompare(b))) || [];
    }
    get dataProperties() {
        var _a, _b;
        return ((_b = (_a = this.highlights) === null || _a === void 0 ? void 0 : _a.dataProperties) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.localeCompare(b))) || [];
    }
    set allHighlights(highlights) {
        this._allHighlights = highlights;
        this.setHighlights();
    }
    get allHighlights() {
        return this._allHighlights;
    }
    setHighlights() {
        if (this.allHighlights)
            this.highlights = JSON.parse(JSON.stringify(this.allHighlights));
        else
            this.highlights = this.allHighlights;
        if (this.highlights) {
            let count = 0;
            if (this.searchEntityComponent[GrapholTypesEnum.CLASS] !== true) {
                this.highlights.classes = [];
                count += 1;
            }
            if (this.searchEntityComponent[GrapholTypesEnum.OBJECT_PROPERTY] !== true) {
                this.highlights.objectProperties = [];
                count += 1;
            }
            if (this.searchEntityComponent[GrapholTypesEnum.DATA_PROPERTY] !== true) {
                this.highlights.dataProperties = [];
                count += 1;
            }
            // if count = 3 then highlights empty, this will show the blank-slate
            if (count === 3) {
                this.highlights = undefined;
            }
        }
    }
    blur() {
        var _a;
        // do not call super.blur() cause it will collapse highlights suggestions body.
        // This because each click on cytoscape background calls document.activeElement.blur(), 
        // so if any input field has focus, query-head will be the activeElement and will be
        // blurred at each tap. this way we only blur the input elements.
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('input').forEach(inputElement => inputElement.blur());
    }
}
HighlightsList.properties = {
    class: { type: String, attribute: false },
    highlights: { type: Object, attribute: false }
};
HighlightsList.styles = [
    ui.baseStyle,
    ui.entityListItemStyle,
    sparqlingWidgetStyle,
    r$2 `
      :host {
        position:initial;
        pointer-events:initial;
        margin-top: 60px;
        max-height: 55%;
      }

      .gscape-panel {
        max-height: unset;
        overflow-y: clip;
      }

      .list {
        overflow: hidden auto;
        scrollbar-width: inherit;
        max-height: 100%;
        padding: 0 8px 8px 8px;
        position: relative;
        box-sizing: border-box;
      }

      details.entity-list-item > .summary-body {
        padding: 4px 8px;
      }

      details {
        white-space: nowrap;
      }

      div.entity-list-item {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 0 8px;
      }

      div.entity-list-item > .entity-name {
        flex-grow: 2;
      }

      div.entity-list-item > .entity-icon {
        line-height: 0;
      }

      div.entity-list-item > .actions {
        display: none;
      }

      div.entity-list-item:hover > .actions {
        display: unset;
      }

      .blank-slate {
        margin: 0 auto;
      }

      .ellipsed .actions, .ellipsed .entity-icon {
        overflow-x: unset
      }
    `
];
customElements.define('sparqling-highlights-list', HighlightsList);

class RelatedClassSelection extends ui.BaseMixin(s) {
    constructor() {
        super(...arguments);
        this.reverseArrow = false;
        this.onSelection = (listItem) => { };
    }
    render() {
        var _a;
        return $ `
      <div class="gscape-panel">
        <div class="header">Add Object Property</div>
        <div class="gscape-panel-body">
          <div id="left-panel">
            <span class="text class">${this.class}</span>
            <span class="arrow${this.reverse}">
              <span class="arrow-tail"></span>
              <span class="text obj-property">${this.objProperty}</span>
              <span class="arrow-body"></span>
              <span class="arrow-head"></span>
            </span>
          </div>
          <div id="right-panel" class="list">
            ${(_a = this.list) === null || _a === void 0 ? void 0 : _a.map((classItem, i) => {
            return $ `<span class="actionable" index="${i}" @click=${this.handleSelection}>${classItem}</span>`;
        })}
          </div>
        </div>
      </div>
    `;
    }
    handleSelection(e) {
        e.preventDefault();
        if (this.list) {
            const index = e.currentTarget.getAttribute('index');
            if (index !== null) {
                let listItem = this.list[index];
                this.onSelection(listItem);
            }
        }
    }
    showInPosition(position) {
        this.show();
        if (position) {
            this.style.top = position.y + "px";
            this.style.left = position.x + "px";
        }
    }
    get reverse() {
        return this.reverseArrow ? '-reverse' : null;
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.hide();
    }
}
RelatedClassSelection.properties = {
    class: { attribute: false },
    objProperty: { attribute: false },
};
RelatedClassSelection.styles = [
    ui.baseStyle,
    r$2 `
      :host {
        position: absolute;
        min-width: 100px;
        transform: translate(-100%, -50%);
      }

      .gscape-panel-body {
        display: flex;
        padding: 0px 0px 8px 8px;
      }

      .gscape-panel {
        max-width: unset;
        max-height: unset;
        padding:0
      }

      .header {
        text-align:center;
      }

      #left-panel {
        display:flex;
        align-items:center;
      }

      .class {
        padding: 10px 20px;
        border-radius: 6px;
        background-color: var(--gscape-color-class);
        border: solid 2px var(--gscape-color-class-contrast);
      }

      .arrow {
        margin: 10px;
        display: flex;
        align-items: center;
      }

      .arrow-reverse {
        margin: 10px;
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
      }

      .arrow-tail, .arrow-body {
        height:8px;
        background-color: var(--gscape-color-object-property-contrast);
      }

      .arrow-tail {
        width: 20px;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border-top-right-radius: 0px;
        border-bottom-right-radius:0px;
      }

      .arrow-reverse > .arrow-tail {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-top-left-radius: 0px;
        border-bottom-left-radius:0px;
      }

      .arrow-body {
        width: 15px;
      }

      .arrow-head {
        width: 0; 
          width: 0; 
        width: 0; 
          width: 0; 
        width: 0; 
        height: 0; 
          height: 0; 
        height: 0; 
          height: 0; 
        height: 0; 
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        background-color: initial;
      }

      .arrow > .arrow-head {
        border-left: 15px solid var(--gscape-color-object-property-contrast);
        border-right: 0;
      }

      .arrow-reverse > .arrow-head {
        border-right: 15px solid var(--gscape-color-object-property-contrast);
        border-left: 0;
      }

      .obj-property {
        padding: 5px;
      }

      .list {
        display: flex;
        flex-direction: column;
        max-height: 200px;
        overflow: hidden auto;
        padding-right: 8px;
      }

      .gscape-panel-title {
        padding-top:10px;
      }
    `
];
customElements.define('sparqling-related-classes', RelatedClassSelection);

let lang = 'en';
const emptyQueryMsg = (l = lang) => {
    const text = { en: 'Empty Query' };
    return text[l];
};
const emptyHeadMsg = (l = lang) => {
    const text = {
        en: 'Your query will output everything'
    };
    return text[l];
};
const emptyHeadTipMsg = (l = lang) => {
    const text = {
        en: 'The query head is the output of your query\n\
and it seems like you have nothing in it yet.\n\n\
We don\'t think an empty query is what you want\n\
so your result now will be everything. \n\n\
You can choose what to see in output from the\n\
query graph, data properties \n\
will automatically go in the query head.'
    };
    return text[l];
};
const tipWhy = (l = lang) => {
    const text = {
        en: 'Why?',
        it: 'Perché?'
    };
    return text[l];
};
const emptyGraphMsg = (l = lang) => {
    const text = {
        en: 'Double click on a class to add it to the query'
    };
    return text[l];
};
const tipWhatIsQueryGraph = (l = lang) => {
    const text = {
        en: 'What is a Query Graph?',
        it: 'Cos\'è il Query Graph?'
    };
    return text[l];
};
const emptyGraphTipMsg = (l = lang) => {
    const text = {
        en: 'The query graph is the set of conditions\n\
you specify to be satisfied by results.\n\n\
If you add a class (e.g. Person), only\n\
instances belonging to that class will\n\
be included in the results (e.g. only persons). \n\n\
If you then add a object property \n\
involving that class (e.g. hasCar), results will now\n\
include only those participating in such relationship\n\
(e.g. only persons having a Car).'
    };
    return text[l];
};
const commandAddHeadText = (l = lang) => {
    const text = {
        en: 'Add to Query Head',
        it: 'Aggiungi in Query Head'
    };
    return text[l];
};
const commandDeleteText = (l = lang) => {
    const text = {
        en: 'Delete',
        it: 'Elimina'
    };
    return text[l];
};
const commandAddFilterText = (l = lang) => {
    const text = {
        en: 'Add Filter',
        it: 'Aggiungi Filtro'
    };
    return text[l];
};
const commandMakeOptionalText = (l = lang) => {
    const text = {
        en: 'Make Optional',
        it: 'Rendi Opzionale'
    };
    return text[l];
};
const commandRemoveOptionalText = (l = lang) => {
    const text = {
        en: 'Remove Optional',
        it: 'Rendi non Opzionale'
    };
    return text[l];
};
const countStarMsg = (l = lang) => {
    const text = {
        en: 'Count the number of results',
        it: 'Conta il numero di risultati'
    };
    return text[l];
};

class SparqlDialog extends ui.BaseMixin(s) {
    constructor() {
        super(...arguments);
        this.text = emptyQueryMsg();
        //copyButton = new UI.GscapeButton(copyContent, "Copy Query")
        this.title = 'SPARQL';
        this.arePrefixesVisible = false;
    }
    render() {
        return $ `
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${code}
            <span>${this.title}</span>
          </div>

          <div id="buttons-tray">
            ${getTrayButtonTemplate('Copy Query', copyContent, undefined, 'copyt-query-code-btn', this.copyQuery)}
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
            title="Close"
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="sparql-code-wrapper" title="Click to copy query" @click=${this.copyQuery}>
          ${this.text === emptyQueryMsg()
            ? $ `<div class="sparql-code">${this.text.trim()}</div>`
            : $ `
              ${this.arePrefixesVisible
                ? $ `
                  <div class="sparql-code">${this.queryPrefixes}</div>
                `
                : null}
              <gscape-button type="subtle" title="Show Prefixes" size="s" @click="${this.togglePrefixes}">
                <span slot="icon">${ellipsis}</span>
              </gscape-button>
              <div class="sparql-code">${this.queryText}</div>
            `}
        </div>
      </div>
    `;
    }
    togglePrefixes() {
        this.arePrefixesVisible = !this.arePrefixesVisible;
    }
    copyQuery() {
        navigator.clipboard.writeText(this.text).then(_ => {
            console.log('query copied successfully');
        });
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.hide();
    }
    get queryPrefixes() {
        return this.text.substring(0, this.text.search('SELECT')).trim();
    }
    get queryText() {
        return this.text.substring(this.text.search('SELECT')).trim();
    }
}
SparqlDialog.styles = [
    ui.baseStyle,
    sparqlingWidgetStyle,
    r$2 `
      :host {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%, 0);
        min-width: 200px;
        max-width: 800px;
      }

      .sparql-code-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
        cursor: copy;
        font-family: monospace;
        overflow: auto;
        max-height: 300px;
        padding: 10px 20px;
        scrollbar-width: inherit;
      }

      .sparql-code {
        white-space: pre;
      }
    `
];
SparqlDialog.properties = {
    text: { type: String, attribute: false },
    arePrefixesVisible: { type: Boolean, state: true },
};
customElements.define('sparqling-sparql-dialog', SparqlDialog);

var sparqlingIcon = y `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   version="1.1"
   viewBox="0 0 20 20"
   xml:space="preserve"
   fill="currentColor"
   style="width: 20px; height:20px; padding: 2px; box-sizing: border-box;"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
<g
   transform="translate(-268.25923,-224.085)"><path
     style="display:inline;stroke-width:0.04"
     class="st0"
     d="m 278.25923,224.085 c -2.672,0 -5.18396,1.03997 -7.07195,2.92797 -1.888,1.888 -2.92805,4.40003 -2.92805,7.07203 0,2.672 1.04005,5.18396 2.92805,7.07195 1.88799,1.888 4.39995,2.92805 7.07195,2.92805 2.672,0 5.18403,-1.04005 7.07203,-2.92805 1.888,-1.88799 2.92797,-4.39995 2.92797,-7.07195 0,-2.672 -1.03997,-5.18403 -2.92797,-7.07203 -1.888,-1.888 -4.40003,-2.92797 -7.07203,-2.92797 z m 10e-4,1.94516 1.55563,1.55562 -0.77781,0.77781 -5.72532,5.72532 1.69391,1.69382 5.72703,-5.7271 a 1.10011,1.10011 0 0 1 1.55563,0 l 3.2489,3.24882 a 1.10011,1.10011 0 0 1 0,1.55563 l -6.50187,6.50187 -0.77781,0.77782 -1.55563,-1.55563 0.77781,-0.77781 5.72407,-5.72406 -1.69321,-1.69321 -5.72711,5.72711 a 1.10011,1.10011 0 0 1 -1.55562,8e-5 l -3.24953,-3.24945 a 1.10011,1.10011 0 0 1 0,-1.55571 l 6.50312,-6.50312 z" /></g>

</svg>
`;

class SparqlingStartRunButtons extends ui.BaseMixin(s) {
    constructor() {
        super();
        this.isLoading = false;
        this.canQueryRun = false;
        this._onSparqlingStartCallback = () => { };
        this._onSparqlingStopCallback = () => { };
        this._onQueryRunCallback = () => { };
        this.classList.add(ui.BOTTOM_RIGHT_WIDGET_CLASS.toString());
    }
    render() {
        return $ `
    ${this.canQueryRun
            ? $ `
          <gscape-button
            @click="${this._onQueryRunCallback}"
            type="subtle"
            title="Send query to SPARQL endpoint"
          >
            <span slot="icon">${playOutlined}</span>
          </gscape-button>
          <div class="hr"></div>
        `
            : null}

    ${this.isLoading
            ? $ `<div class="lds-ring btn-m" title="Sparqling is loading"><div></div><div></div><div></div><div></div></div>`
            : $ `
        <gscape-button
          @click="${this.handleStartButtonCLick}" 
          type="subtle"
          title="Start/Stop Sparqling"
          ?active=${isSparqlingRunning()}
        >
          <span slot="icon">${sparqlingIcon}</span>
        </gscape-button>
      `}

    `;
    }
    onSparqlingStart(callback) {
        this._onSparqlingStartCallback = callback;
    }
    onSparqlingStop(callback) {
        this._onSparqlingStopCallback = callback;
    }
    onQueryRun(callback) {
        this._onQueryRunCallback = callback;
    }
    handleStartButtonCLick() {
        isSparqlingRunning() ? this._onSparqlingStopCallback() : this._onSparqlingStartCallback();
    }
    startLoadingAnimation() {
        this.isLoading = true;
    }
    stopLoadingAnimation() {
        this.isLoading = false;
    }
    get startButton() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('');
    }
}
SparqlingStartRunButtons.properties = {
    canQueryRun: { type: Boolean, attribute: false },
    isLoading: { type: Boolean, attribute: false },
};
SparqlingStartRunButtons.styles = [
    ui.GscapeButtonStyle,
    ui.baseStyle,
    r$2 `
      :host {
        order: 8;
      }

      .lds-ring {
        width: 20px;
        height: 20px;
      }

      .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        margin: 2px;
        border: 2px solid var(--gscape-color-accent);
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: var(--gscape-color-accent) transparent transparent transparent;
      }
      .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
      }
      .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
      }
      .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
      }
      @keyframes lds-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
];
customElements.define('sparqling-start-run-buttons', SparqlingStartRunButtons);

class FunctionDialog extends SparqlingFormDialog {
    constructor() {
        super();
    }
    render() {
        this.title = `${this.modality} function for ${this.variableName}`;
        return $ `
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${functionIcon}
            <span>${this.title}</span>
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="dialog-body">
          ${getFormTemplate(this, this.operators)}
          
          <div class="bottom-buttons">
            <gscape-button label="Cancel" @click=${this.hide}></gscape-button>
            <gscape-button type="primary" @click=${this.handleSubmit} label="Save Function"></gscape-button>
          </div>
        </div>
      </div>
    `;
    }
    onSubmit(callback) {
        this.submitCallback = callback;
    }
    setAsCorrect(customText) {
        var _a, _b;
        super.setAsCorrect(customText);
        (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('gscape-button[type = "primary"]')) === null || _b === void 0 ? void 0 : _b.remove();
    }
    get operators() {
        switch (this.datatype) {
            case VarOrConstantConstantTypeEnum.String:
                return this.operatorsOnString;
            case VarOrConstantConstantTypeEnum.Decimal:
                return this.operatorsOnNumber;
            case VarOrConstantConstantTypeEnum.DateTime:
                return this.operatorsOnDate;
            default:
                return this.operatorsOnString;
        }
    }
    get operatorsOnString() {
        return [
            FunctionNameEnum.Concat,
            FunctionNameEnum.Contains,
            FunctionNameEnum.Lcase,
            FunctionNameEnum.Substr,
            FunctionNameEnum.Ucase
        ];
    }
    get operatorsOnNumber() {
        return [
            FunctionNameEnum.Add,
            FunctionNameEnum.Subctract,
            FunctionNameEnum.Multiply,
            FunctionNameEnum.Divide,
            FunctionNameEnum.Round,
            FunctionNameEnum.Ceil,
            FunctionNameEnum.Floor
        ];
    }
    get operatorsOnDate() {
        return [
            FunctionNameEnum.Year,
            FunctionNameEnum.Month,
            FunctionNameEnum.Day,
            FunctionNameEnum.Hours,
            FunctionNameEnum.Minutes,
            FunctionNameEnum.Seconds,
        ];
    }
}
customElements.define('sparqling-function-dialog', FunctionDialog);

class AggregationDialog extends SparqlingFormDialog {
    constructor() {
        super(...arguments);
        // private showHavingFormButton = new UI.GscapeButton(addFilter, "Add Having")
        this.definingHaving = false;
        this.distinct = false;
        this.formTitle = 'Having';
    }
    static get properties() {
        const props = super.properties;
        const newProps = {
            definingHaving: { type: Boolean, state: true },
            distinct: { type: Boolean, state: true },
        };
        return Object.assign(props, newProps);
    }
    render() {
        this.title = `${this.modality} aggregate function for ${this.variableName}`;
        return $ `
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${sigma}
            <span>${this.title}</span>
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="dialog-body">
          <div style="text-align: center;">
            <div id="select-aggregate-function">
              ${getSelect(this.aggregateOperator || "Aggregate Function", Object.values(GroupByElementAggregateFunctionEnum))}
            </div>
            <div style="margin: 10px 0">
              <label>
                <input id="distinct-checkbox" type="checkbox" @click="${this.onDistinctChange}" ?checked=${this.distinct}>
                Only distinct values
              </label>
            </div>
          </div>
          
          ${!this.definingHaving
            ? $ `
                <gscape-button title="Add Having" label="Filter Groups - Having" @click=${this.handleHavingButtonClick}>
                  <span slot="icon">${addFilter$1}</span>
                </gscape-button>
                <div id="message-tray"></div>
              `
            : getFormTemplate(this, Object.values(FilterExpressionOperatorEnum))}
          
          <div class="bottom-buttons">
            <gscape-button label="Cancel" @click=${this.hide}></gscape-button>
            <gscape-button type="primary" @click=${this.handleSubmit} label="Save Function"></gscape-button>
          </div>
        </div>
      </div>
    `;
    }
    handleHavingButtonClick() {
        this.definingHaving = true;
    }
    handleSubmit() {
        if (validateSelectElement(this.selectAggregateOperatorElem)) {
            if (this.definingHaving)
                super.handleSubmit(); // this evaluate validity of the having too
            else
                this.onValidSubmit();
        }
    }
    onValidSubmit() {
        if (this._id && this.aggregateOperator && this.parameters)
            this.submitCallback(this._id, this.aggregateOperator, this.distinct, this.operator, this.parameters);
    }
    onSubmit(callback) {
        this.submitCallback = callback;
    }
    setAsCorrect(customText) {
        var _a, _b;
        super.setAsCorrect(customText);
        (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('gscape-button[type = "primary"]')) === null || _b === void 0 ? void 0 : _b.remove();
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        if (this.selectAggregateOperatorElem) {
            this.selectAggregateOperatorElem.onchange = () => this.onAggregateOperatorChange(this.selectAggregateOperatorElem.value);
        }
    }
    onAggregateOperatorChange(value) {
        this.aggregateOperator = value;
    }
    onDistinctChange(e) {
        this.distinct = e.target.checked;
    }
    get isAggregateOperatorValid() {
        return this.aggregateOperator && Object.values(GroupByElementAggregateFunctionEnum).includes(this.aggregateOperator);
    }
    get selectAggregateOperatorElem() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#select-aggregate-function > select');
    }
    get distinctCheckboxElem() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#distinct-checkbox');
    }
    get datatype() {
        return super.datatype;
    }
    set datatype(value) {
        super.datatype = value;
    }
}
customElements.define('sparqling-aggregation-dialog', AggregationDialog);

class ErrorsDialog extends ui.BaseMixin(s) {
    constructor() {
        super(...arguments);
        this.errorText = '';
    }
    render() {
        return $ `
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${error}
            <span>Error</span>
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="dialog-body">
          ${this.errorText}
        </div>
      </div>
    `;
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.hide();
    }
}
ErrorsDialog.properties = {
    errorText: { attribute: false, type: String }
};
ErrorsDialog.styles = [
    ui.baseStyle,
    sparqlingWidgetStyle,
    r$2 `
      :host {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%, 0)
      }

      .dialog-body {
        display: flex;
        flex-direction: column;
        gap: 30px;
        align-items: center;
        min-width: 350px;
        max-width: 450px;
        padding: 16px 8px;
        background: var(--gscape-color-danger-subtle);
      }

      .dialog-body, #widget-header {
        color: var(--gscape-color-danger);
      }
    `
];
customElements.define('error-dialog', ErrorsDialog);

function isResponseError(response) {
    return !response || (response === null || response === void 0 ? void 0 : response.code) === 1 || (response === null || response === void 0 ? void 0 : response.type) === 'error';
}
function getErrorMessage(response) {
    if (isResponseError(response))
        return response.message;
}
function handlePromise(promise, showError = true) {
    return new Promise(executor);
    function executor(resolve) {
        startLoading();
        promise
            .then(response => {
            if (isResponseError(response.data)) {
                throw new Error(getErrorMessage(response.data));
            }
            else {
                resolve(response.data);
            }
        })
            .catch(error => {
            console.error(error);
            if (showError) {
                errorsDialog.errorText = `${error.name} : ${error.message}`;
                errorsDialog.show();
            }
        })
            .finally(() => stopLoading());
    }
}
function startLoading() {
    increaseLoadingProcesses();
    startRunButtons.startLoadingAnimation();
}
function stopLoading() {
    decreaseLoadingProcesses();
    if (getNumberLoadingProcesses() === 0) {
        startRunButtons.stopLoadingAnimation();
    }
}

let gscape;
var getGscape = () => gscape;
function setGrapholscapeInstance(grapholscape) {
    gscape = grapholscape;
}
function clearSelected() {
    for (const diagram of gscape.ontology.diagrams) {
        for (const [_, diagramRepresentation] of diagram.representations) {
            diagramRepresentation.cy.elements().unselect();
        }
    }
}
function isIriSelected(iriToCheck) {
    var _a, _b;
    let sparqlingSelectedNode = (_b = (_a = gscape.renderer) === null || _a === void 0 ? void 0 : _a.cy) === null || _b === void 0 ? void 0 : _b.$('.sparqling-selected');
    if (!sparqlingSelectedNode || (sparqlingSelectedNode === null || sparqlingSelectedNode === void 0 ? void 0 : sparqlingSelectedNode.empty()))
        return false;
    else {
        return iriToCheck.equals(sparqlingSelectedNode.first().data().iri);
    }
}

function getPrefixedIri (iriValue) {
    const iri = new Iri(iriValue, getGscape().ontology.namespaces);
    return iri.prefixed || iriValue;
}

let actualHighlights;
const HIGHLIGHT_CLASS = 'highlighted';
const FADED_ClASS = 'faded';
const SPARQLING_SELECTED = 'sparqling-selected';
// highlightsList.onSuggestionLocalization(iri => getGscape().centerOnEntity(iri))
const getActualHighlights = () => actualHighlights;
function highlightIRI(iri) {
    var _a, _b;
    const gscape = getGscape();
    const iriOccurrences = (_a = gscape.ontology.getEntityOccurrences(iri)) === null || _a === void 0 ? void 0 : _a.get(RendererStatesEnum.GRAPHOL);
    if (gscape.renderState !== RendererStatesEnum.GRAPHOL) {
        const occurrencesInActualRendererState = (_b = gscape.ontology.getEntityOccurrences(iri)) === null || _b === void 0 ? void 0 : _b.get(gscape.renderState);
        if (occurrencesInActualRendererState)
            iriOccurrences === null || iriOccurrences === void 0 ? void 0 : iriOccurrences.push(...occurrencesInActualRendererState);
    }
    if (iriOccurrences) {
        iriOccurrences.forEach(occurrence => {
            var _a;
            if (occurrence.diagramId === gscape.diagramId)
                (_a = gscape.renderer.cy) === null || _a === void 0 ? void 0 : _a.$id(occurrence.elementId).addClass(HIGHLIGHT_CLASS);
        });
    }
}
function highlightSuggestions(clickedIRI) {
    if (!clickedIRI)
        return;
    resetHighlights();
    const ogApi = new OntologyGraphApi(undefined, getBasePath());
    handlePromise(ogApi.highligths(clickedIRI, undefined, getRequestOptions())).then(newHighlights => {
        actualHighlights = newHighlights;
        performHighlights(clickedIRI);
        highlightsList.allHighlights = transformHighlightsToPrefixedIRIs();
    });
}
function resetHighlights() {
    const gscape = getGscape();
    gscape.ontology.diagrams.forEach(diagram => {
        for (let [_, diagramRepresentation] of diagram.representations) {
            diagramRepresentation.cy.$(`.${SPARQLING_SELECTED}`).removeClass(SPARQLING_SELECTED);
            diagramRepresentation.cy.$(`.${HIGHLIGHT_CLASS}`).removeClass(HIGHLIGHT_CLASS);
            diagramRepresentation.cy.$(`.${FADED_ClASS}`).removeClass(FADED_ClASS).selectify();
        }
    });
    actualHighlights = undefined;
    highlightsList.allHighlights = undefined;
}
function isHighlighted(iri) {
    var _a, _b, _c;
    // if ((actualHighlights as AxiosError).isAxiosError) return true
    return ((_a = actualHighlights === null || actualHighlights === void 0 ? void 0 : actualHighlights.classes) === null || _a === void 0 ? void 0 : _a.includes(iri)) ||
        ((_b = actualHighlights === null || actualHighlights === void 0 ? void 0 : actualHighlights.dataProperties) === null || _b === void 0 ? void 0 : _b.includes(iri)) ||
        ((_c = actualHighlights === null || actualHighlights === void 0 ? void 0 : actualHighlights.objectProperties) === null || _c === void 0 ? void 0 : _c.map(obj => obj.objectPropertyIRI).includes(iri)) || false;
}
function refreshHighlights() {
    let activeElement = getActiveElement();
    if (activeElement) {
        performHighlights(activeElement.iri.fullIri);
    }
}
function performHighlights(clickedIRI) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const gscape = getGscape();
    (_a = actualHighlights === null || actualHighlights === void 0 ? void 0 : actualHighlights.classes) === null || _a === void 0 ? void 0 : _a.forEach((iri) => highlightIRI(iri));
    (_b = actualHighlights === null || actualHighlights === void 0 ? void 0 : actualHighlights.dataProperties) === null || _b === void 0 ? void 0 : _b.forEach((iri) => highlightIRI(iri));
    (_c = actualHighlights === null || actualHighlights === void 0 ? void 0 : actualHighlights.objectProperties) === null || _c === void 0 ? void 0 : _c.forEach((o) => highlightIRI(o.objectPropertyIRI));
    const iriOccurrences = (_d = gscape.ontology.getEntityOccurrences(clickedIRI)) === null || _d === void 0 ? void 0 : _d.get(RendererStatesEnum.GRAPHOL);
    if (gscape.renderState !== RendererStatesEnum.GRAPHOL) {
        const occurrencesInActualRendererState = (_e = gscape.ontology.getEntityOccurrences(clickedIRI)) === null || _e === void 0 ? void 0 : _e.get(gscape.renderState);
        if (occurrencesInActualRendererState)
            iriOccurrences === null || iriOccurrences === void 0 ? void 0 : iriOccurrences.push(...occurrencesInActualRendererState);
    }
    if (iriOccurrences) {
        // select all nodes having iri = clickedIRI
        for (const occurrence of iriOccurrences) {
            const diagram = gscape.ontology.getDiagram(occurrence.diagramId);
            const occurrenceCyElement = (_f = diagram === null || diagram === void 0 ? void 0 : diagram.representations.get(gscape.renderState)) === null || _f === void 0 ? void 0 : _f.cy.$id(occurrence.elementId);
            occurrenceCyElement === null || occurrenceCyElement === void 0 ? void 0 : occurrenceCyElement.addClass(SPARQLING_SELECTED);
        }
        const highlightedElems = ((_g = gscape.renderer.cy) === null || _g === void 0 ? void 0 : _g.$('.highlighted, .sparqling-selected')) || cytoscape().collection();
        const fadedElems = (_h = gscape.renderer.cy) === null || _h === void 0 ? void 0 : _h.elements().difference(highlightedElems);
        fadedElems === null || fadedElems === void 0 ? void 0 : fadedElems.addClass(FADED_ClASS);
    }
    //fadedElems.unselectify()
}
function transformHighlightsToPrefixedIRIs() {
    var _a, _b, _c;
    let transformedHighlights = JSON.parse(JSON.stringify(actualHighlights));
    transformedHighlights.classes = (_a = transformedHighlights.classes) === null || _a === void 0 ? void 0 : _a.map(iri => getPrefixedIri(iri));
    transformedHighlights.dataProperties = (_b = transformedHighlights.dataProperties) === null || _b === void 0 ? void 0 : _b.map(iri => getPrefixedIri(iri));
    transformedHighlights.objectProperties = (_c = transformedHighlights.objectProperties) === null || _c === void 0 ? void 0 : _c.map(branch => {
        var _a;
        branch.objectPropertyIRI = getPrefixedIri(branch.objectPropertyIRI || '');
        branch.relatedClasses = (_a = branch.relatedClasses) === null || _a === void 0 ? void 0 : _a.map(iri => getPrefixedIri(iri));
        return branch;
    });
    return transformedHighlights;
}

/**
 * Get the entity occurrence (elementId, diagramId).
 * Prefer instance in actual diagram, pick first one in the list as fallback
 * @param entityIri the entity's IRI to look for
 */
function getEntityOccurrence(entityIri) {
    const gscape = getGscape();
    // Prefer instance in actual diagram, first one as fallback
    const selectedClassEntity = gscape.ontology.getEntity(entityIri);
    let selectedClassOccurrences = selectedClassEntity.occurrences.get(gscape.renderState);
    // If the actual representation has no occurrences, then take the original ones
    if (!selectedClassOccurrences) {
        selectedClassOccurrences = selectedClassEntity.occurrences.get(RendererStatesEnum.GRAPHOL);
    }
    if (selectedClassOccurrences) {
        return (selectedClassOccurrences === null || selectedClassOccurrences === void 0 ? void 0 : selectedClassOccurrences.find(occurrence => occurrence.diagramId === gscape.diagramId)) ||
            selectedClassOccurrences[0];
    }
}
function addStylesheet(cy, stylesheet) {
    stylesheet.forEach(styleObj => {
        cy.style().selector(styleObj.selector).style(styleObj.style);
    });
}

let _onRelatedClassSelection = (objectProperty, relatedClass) => { };
function showRelatedClassesWidget(objPropertyIri, position) {
    var _a;
    const actualHighlights = getActualHighlights();
    if (!actualHighlights || !isHighlighted(objPropertyIri))
        return;
    const gscape = getGscape();
    const objPropertyEntity = gscape.ontology.getEntity(objPropertyIri);
    let objPropertyFromApi = (_a = actualHighlights.objectProperties) === null || _a === void 0 ? void 0 : _a.find((o) => {
        if (o === null || o === void 0 ? void 0 : o.objectPropertyIRI)
            return objPropertyEntity.iri.equals(o.objectPropertyIRI);
    });
    if (!objPropertyFromApi || !objPropertyFromApi.relatedClasses || objPropertyFromApi.relatedClasses.length <= 0) {
        return;
    }
    //listSelectionDialog.title = classSelectDialogTitle()
    // Use prefixed iri if possible, full iri as fallback
    relatedClassDialog.list = objPropertyFromApi.relatedClasses.map((iriValue) => {
        const iri = new Iri(iriValue, gscape.ontology.namespaces);
        return iri.prefixed;
    });
    const activeElement = getActiveElement();
    if (activeElement) {
        relatedClassDialog.class = activeElement.iri.prefixed || activeElement.iri.fullIri;
        relatedClassDialog.objProperty = objPropertyEntity.iri.prefixed;
        relatedClassDialog.reverseArrow = !objPropertyFromApi.direct;
        relatedClassDialog.showInPosition(position);
        relatedClassDialog.onSelection = (selectedClassIri) => {
            try {
                if (objPropertyFromApi) {
                    const relatedClassOccurrence = getEntityOccurrence(selectedClassIri);
                    if (relatedClassOccurrence)
                        _onRelatedClassSelection(objPropertyFromApi, relatedClassOccurrence);
                }
            }
            catch (e) {
                console.error(e);
            }
        };
    }
}
function hideRelatedClassesWidget() {
    relatedClassDialog.list = [];
    relatedClassDialog.hide();
}
function onRelatedClassSelection(callback) {
    _onRelatedClassSelection = callback;
}

function centerOnElement (elem, zoom) {
    let cy = elem.cy();
    if (zoom)
        cy.zoom(zoom);
    let pos = elem.renderedPosition();
    let center = { x: cy.width() / 2, y: cy.height() / 2 };
    cy.panBy({ x: -(pos.x - center.x), y: -(pos.y - center.y) });
}

getGrapholscapeContainer();
const bgpContainer = getBGPContainer();
const leftColumnContainer = getLeftColumnContainer();
function getGrapholscapeContainer() {
    let container = document.createElement('div');
    container.setAttribute('id', 'grapholscape');
    container.style.position = 'relative';
    container.style.height = '100%';
    return container;
}
function getBGPContainer() {
    let container = document.createElement('div');
    container.setAttribute('id', 'sparqling-query-graph');
    container.style.position = 'relative';
    container.style.height = '100%';
    container.style.width = '100%';
    return container;
}
function getLeftColumnContainer() {
    let container = document.createElement('div');
    container.setAttribute('id', 'sparqling-left-column');
    container.style.position = 'absolute';
    container.style.left = '10px';
    container.style.bottom = '0';
    container.style.display = 'flex';
    container.style.flexDirection = 'column-reverse';
    container.style.justifyContent = 'space-between';
    container.style.gap = '30px';
    container.style.height = '100%';
    container.style.boxSizing = 'border-box';
    container.style.marginTop = '70px';
    container.style.pointerEvents = 'none';
    container.style.width = '20%';
    return container;
}

function getGraphElementByID(id) {
    var _a;
    const graph = (_a = getQueryBody()) === null || _a === void 0 ? void 0 : _a.graph;
    return findGraphElement(graph, (elem) => elem.id === id);
}
function getGraphElementByIRI(iri) {
    var _a;
    const graph = (_a = getQueryBody()) === null || _a === void 0 ? void 0 : _a.graph;
    return findGraphElement(graph, (elem) => graphElementHasIri(elem, iri));
}
/**
 * Find an element in the query-graph satisfying the test condition
 * @param graph the element to test
 * @param test boolean test function
 * @returns the first element satisfying the condition
 */
function findGraphElement(graph, test) {
    if (!graph)
        return;
    if (test(graph))
        return graph;
    if (graph.children) {
        for (let child of graph.children) {
            let res = findGraphElement(child, test);
            if (res)
                return res;
        }
    }
    return;
}
/**
 * Get the iri of an entity contained in a GraphElement
 * @param elem the GraphElement to extract IRI from
 * @param i the entity index in the array, default first one
 * @returns
 */
function getIri(elem, i = 0) {
    var _a;
    if (elem === null || elem === void 0 ? void 0 : elem.entities)
        return (_a = elem === null || elem === void 0 ? void 0 : elem.entities[i]) === null || _a === void 0 ? void 0 : _a.iri;
}
function getEntityType(elem) {
    if (elem === null || elem === void 0 ? void 0 : elem.entities)
        return elem.entities[0].type;
}
function graphElementHasIri(elem, iri) {
    var _a;
    return ((_a = elem === null || elem === void 0 ? void 0 : elem.entities) === null || _a === void 0 ? void 0 : _a.some((entity) => {
        return entity.iri === iri || entity.prefixedIri === iri;
    })) || false;
}
function canStartJoin(elem) {
    var _a;
    if (!elem)
        return false;
    return ((_a = elem.entities) === null || _a === void 0 ? void 0 : _a.length) === 1 && isClass(elem);
}
function isJoinAllowed(targetElem, startElem) {
    if (!targetElem || !startElem)
        return false;
    const areBothClasses = isClass(startElem) && isClass(targetElem);
    const startElemIri = getIri(startElem);
    const doesTargetHasSameIri = startElemIri ? graphElementHasIri(targetElem, startElemIri) : false;
    return areBothClasses && doesTargetHasSameIri;
}
function isClass(graphElement) {
    return getEntityType(graphElement) === EntityTypeEnum.Class;
}
function isObjectProperty(graphElement) {
    return getEntityType(graphElement) === EntityTypeEnum.ObjectProperty || isInverseObjectProperty(graphElement);
}
function isInverseObjectProperty(graphElement) {
    return getEntityType(graphElement) === EntityTypeEnum.InverseObjectProperty;
}
/**
 * Return a set of GraphElements which are present in newGraph and not in oldGraph
 */
function getdiffNew(oldGraph, newGraph) {
    if (!oldGraph)
        return [newGraph];
    let result = [];
    let res = findGraphElement(oldGraph, e => areGraphElementsEqual(e, newGraph));
    if (!res)
        result.push(newGraph);
    if (newGraph === null || newGraph === void 0 ? void 0 : newGraph.children) {
        for (let graphElement of newGraph.children) {
            let res2 = getdiffNew(oldGraph, graphElement);
            if (res2)
                result.push(...res2);
        }
    }
    return result;
}
function areGraphElementsEqual(ge1, ge2) {
    if (!ge1.id || !ge2.id)
        return false;
    const hasSameId = ge1.id === ge2.id;
    const hasSameFilters = getFiltersOnVariable(ge1.id) === getFiltersOnVariable(ge2.id);
    const hasSameEntities = JSON.stringify(ge1.entities) === JSON.stringify(ge2.entities);
    return hasSameId && hasSameFilters && hasSameEntities;
}
function getParentFromChildId(id) {
    var _a;
    const splittedId = id.split('-');
    const parentId = splittedId[0];
    const childIri = splittedId[1];
    const graph = (_a = getQueryBody()) === null || _a === void 0 ? void 0 : _a.graph;
    return findGraphElement(graph, ge => graphElementHasIri(ge, childIri) && ge.id === parentId);
}

const distinctToggle = new ui.GscapeToggle();
distinctToggle.label = 'Duplicates';
distinctToggle.labelPosition = ui.GscapeToggle.ToggleLabelPosition.LEFT;
distinctToggle.classList.add('actionable');
distinctToggle.disabled = true;
distinctToggle.checked = true;
distinctToggle.onclick = (evt) => {
    evt.preventDefault();
    if (!distinctToggle.disabled) {
        distinctToggle.checked = !distinctToggle.checked;
        handleDistinctChange();
    }
};

const offsetInput = document.createElement('input');
offsetInput.placeholder = 'Offset';
offsetInput.type = 'number';
offsetInput.id = 'offset-input';
offsetInput.min = '1';
offsetInput.disabled = true;
offsetInput.onchange = handleOffsetChange;
offsetInput.addEventListener('focusout', handleOffsetChange);
offsetInput.onsubmit = handleOffsetChange;

let addHeadCallback;
let deleteCallback;
let addFilterCallback;
let seeFiltersCallback;
let makeOptionalCallback;
let removeOptionalCallback;
let _ele;
function getCommandsForElement(elem) {
    _ele = elem;
    const commands = [];
    // COMANDI OPTIONALS SU OBJECT PROPERTY
    if (elem.data().type === EntityTypeEnum.ObjectProperty || elem.data().type === EntityTypeEnum.InverseObjectProperty) {
        if (elem.data().optional) {
            commands.push(removeOptional);
        }
        else {
            commands.push(makeOptional);
        }
    }
    else {
        if (!elem.isChild()) {
            if (!getHeadElementByID('?' + elem.id()) && !isCountStarActive()) {
                commands.push(addHead);
            }
            if (elem.data().hasFilters) {
                commands.push(seeFilters);
            }
            commands.push(addFilter);
            if (!elem.incomers().empty() && elem.data().type !== EntityTypeEnum.Class) {
                if (elem.data().optional) {
                    commands.push(removeOptional);
                }
                else {
                    commands.push(makeOptional);
                }
            }
        }
        commands.push(del);
    }
    return commands;
}
const addHead = {
    content: commandAddHeadText(),
    icon: tableColumnPlus,
    select: () => addHeadCallback(_ele.id())
};
const del = {
    content: commandDeleteText(),
    icon: rubbishBin,
    select: () => {
        _ele.isChild() ? deleteCallback(_ele.id(), _ele.data().iri) : deleteCallback(_ele.id());
    }
};
const addFilter = {
    content: commandAddFilterText(),
    icon: addFilter$1,
    select: () => addFilterCallback(_ele.id())
};
const makeOptional = {
    content: commandMakeOptionalText(),
    icon: questionMarkDashed,
    select: () => makeOptionalCallback(_ele.id())
};
const removeOptional = {
    content: commandRemoveOptionalText(),
    icon: dashedCross,
    select: () => removeOptionalCallback(_ele.id())
};
const seeFilters = {
    content: 'See Filters',
    icon: editList,
    select: () => seeFiltersCallback(_ele.id())
};
function onAddHead$1(callback) {
    addHeadCallback = callback;
}
function onDelete$2(callback) {
    deleteCallback = callback;
}
function onAddFilter$2(callback) {
    addFilterCallback = callback;
}
function onSeeFilters$1(callback) {
    seeFiltersCallback = callback;
}
function onMakeOptional$1(callback) {
    makeOptionalCallback = callback;
}
function onRemoveOptional$1(callback) {
    removeOptionalCallback = callback;
}

cytoscape.use(klay);
cytoscape.use(compoundDragAndDrop);
cytoscape.use(popper$1);
const cy = cytoscape({
    style: [],
    wheelSensitivity: 0.4,
    maxZoom: 2,
});
cy.mount(bgpContainer);
/**
 * --- HACKY ---
 * Allow events not involving buttons to work on cytoscape when it's in a shadow dom.
 * They don't work due to shadow dom event's retargeting
 * Cytoscape listen to events on window object. When the event reach window due to bubbling,
 * cytoscape handler for mouse movement handles it but event target appear to be the
 * custom component and not the canvas due to retargeting, therefore listeners are not triggered.
 * workaround found here: https://github.com/cytoscape/cytoscape.js/issues/2081
 */
cy.on('render', () => {
    try {
        cy.renderer().hoverData.capture = true;
    }
    catch (_a) { }
});
cy.on('mouseover', '[iri]', () => {
    const container = cy.container();
    if (container)
        container.style.cursor = 'pointer';
});
cy.on('mouseout', () => {
    const container = cy.container();
    if (container)
        container.style.cursor = 'unset';
});
cy.on('cxttap', `node, edge[type = "${EntityTypeEnum.ObjectProperty}"], edge[type = "${EntityTypeEnum.InverseObjectProperty}"]`, e => {
    attachCxtMenuTo(e.target.popperRef(), getCommandsForElement(e.target));
});
let displayedNameType;
let language;
function setStateDisplayedNameType(newDisplayNameType) {
    displayedNameType = newDisplayNameType || displayedNameType;
}
function getDisplayedNameType() { return displayedNameType; }
function setLanguage(newLanguage) {
    language = newLanguage || language;
}
function getLanguage() { return language; }

/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
class QueryGraphWidget extends ui.BaseMixin(ui.DropPanelMixin(s)) {
    constructor(bgpContainer) {
        super();
        this._isBGPEmpty = true;
        this.onQueryClear = () => { };
        this.onSparqlButtonClick = () => { };
        this.title = 'Query Graph';
        this.togglePanel = () => {
            super.togglePanel();
            this.requestUpdate();
            if (this.isPanelClosed()) {
                this.style.height = 'fit-content';
            }
            else {
                this.style.height = '30%';
            }
        };
        this.bgpContainer = bgpContainer;
    }
    render() {
        return $ `
      ${this.isPanelClosed()
            ? $ `
          <div class="top-bar traslated-down">
            <gscape-button 
              id="toggle-panel-button"
              @click=${this.togglePanel}
              label=${this.title}
            > 
              <span slot="icon">${rdfLogo}</span>
              <span slot="trailing-icon">${ui.icons.plus}</span>
            </gscape-button>
          </div>
        `
            : $ `
          <div class="gscape-panel" id="drop-panel">
            <div class="top-bar">
              <div id="widget-header" class="bold-text">
                ${rdfLogo}
                <span>${this.title}</span>
              </div>

              <div id="buttons-tray">

                ${limitInput$1}
                ${offsetInput}
                ${distinctToggle}
                ${countStarToggle$1}

                ${getTrayButtonTemplate('Sparql', code, undefined, 'sparql-code-btn', this.onSparqlButtonClick)}
                ${getTrayButtonTemplate('Clear Query', refresh, undefined, 'clear-query-btn', this.onQueryClear)}
              </div>

              <gscape-button 
                id="toggle-panel-button"
                size="s" 
                type="subtle"
                @click=${this.togglePanel}
              > 
                <span slot="icon">${ui.icons.minus}</span>
              </gscape-button>
            </div>


            ${this.isBGPEmpty
                ? $ `
                <div class="blank-slate sparqling-blank-slate">
                  ${dbClick}
                  <div class="header">${emptyGraphMsg()}</div>
                  <div class="tip description" title="${emptyGraphTipMsg()}">${tipWhatIsQueryGraph()}</div>
                </div>
              `
                : this.bgpContainer}
          </div>

        `}
    `;
    }
    firstUpdated() {
        //   super.firstUpdated()
        //   this.header.left_icon = rdfLogo
        //   this.header.invertIcons()
        //   super.makeDraggableHeadTitle()
        this.hide();
    }
    createRenderRoot() {
        const root = super.createRenderRoot();
        root.addEventListener('mouseover', e => {
            /**
             * --- HACKY ---
             * Allow events not involving buttons to work on cytoscape when it's in a shadow dom.
             * They don't work due to shadow dom event's retargeting
             * Cytoscape listen to events on window object. When the event reach window due to bubbling,
             * cytoscape handler for mouse movement handles it but event target appear to be the
             * custom component and not the canvas due to retargeting, therefore listeners are not triggered.
             * workaround found here: https://github.com/cytoscape/cytoscape.js/issues/2081
             */
            try {
                cy.renderer().hoverData.capture = true;
            }
            catch (_a) { }
        });
        return root;
    }
    blur() { }
    set isBGPEmpty(value) {
        this._isBGPEmpty = value;
    }
    get isBGPEmpty() {
        return this._isBGPEmpty;
    }
    get clearQueryButton() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#clear-query-btn');
    }
}
QueryGraphWidget.properties = {
    _isBGPEmpty: { attribute: false, type: Boolean }
};
QueryGraphWidget.styles = [
    ui.baseStyle,
    sparqlingWidgetStyle,
    r$2 `
      :host {
        width: calc(50%);
        height: 30%;
        position: absolute;
        left: 50%;
        top: 100%;
        transform: translate(-50%, calc(-100% - 10px));
      }
      
      .tip {
        border-bottom: dotted 2px;
        cursor: help;
      }

      .tip: hover {
        color:inherit;
      }

      .input-elem {
        color: inherit;
        padding: 5px;
        border: none;
        border-bottom: solid 1px var(--gscape-color-border-default);
        max-width: 50px;
      }
    `
];
customElements.define('query-graph', QueryGraphWidget);

/**
 * Get an elem by its id
 * @param elemID the node/edge ID
 * @returns a cytoscape representation of the element or undefined if it does not exist
 */
function getElementById(elemID) {
    const elem = cy.$id(elemID);
    return elem.empty() ? undefined : elem;
}
function getElements() {
    return cy.elements();
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start$1 = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start$1, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start$1, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement$1(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement$1(placement) {
  return placement.split('-')[0];
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`

    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }

    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }

  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement$1(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement$1(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  var commonStyles = {
    placement: getBasePlacement$1(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement$1(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement$1(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start$1:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement$1(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement$1(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement$1(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement$1(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement$1(placement);

    var isStartVariation = getVariation(placement) === start$1;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement$1(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement$1(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start$1 ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start$1 ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce$1(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement$1(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce$1(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

/**!
* tippy.js v6.3.7
* (c) 2017-2021 atomiks
* MIT License
*/
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
  passive: true,
  capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
  return document.body;
};
function getValueAtIndexOrReturn(value, index, defaultValue) {
  if (Array.isArray(value)) {
    var v = value[index];
    return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
  }

  return value;
}
function isType(value, type) {
  var str = {}.toString.call(value);
  return str.indexOf('[object') === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
  return typeof value === 'function' ? value.apply(void 0, args) : value;
}
function debounce(fn, ms) {
  // Avoid wrapping in `setTimeout` if ms is 0 anyway
  if (ms === 0) {
    return fn;
  }

  var timeout;
  return function (arg) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn(arg);
    }, ms);
  };
}
function splitBySpaces(value) {
  return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
  return [].concat(value);
}
function pushIfUnique(arr, value) {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
}
function unique(arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) === index;
  });
}
function getBasePlacement(placement) {
  return placement.split('-')[0];
}
function arrayFrom(value) {
  return [].slice.call(value);
}
function removeUndefinedProps(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

function div() {
  return document.createElement('div');
}
function isElement(value) {
  return ['Element', 'Fragment'].some(function (type) {
    return isType(value, type);
  });
}
function isNodeList(value) {
  return isType(value, 'NodeList');
}
function isMouseEvent(value) {
  return isType(value, 'MouseEvent');
}
function isReferenceElement(value) {
  return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
  if (isElement(value)) {
    return [value];
  }

  if (isNodeList(value)) {
    return arrayFrom(value);
  }

  if (Array.isArray(value)) {
    return value;
  }

  return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
  els.forEach(function (el) {
    if (el) {
      el.style.transitionDuration = value + "ms";
    }
  });
}
function setVisibilityState(els, state) {
  els.forEach(function (el) {
    if (el) {
      el.setAttribute('data-state', state);
    }
  });
}
function getOwnerDocument(elementOrElements) {
  var _element$ownerDocumen;

  var _normalizeToArray = normalizeToArray(elementOrElements),
      element = _normalizeToArray[0]; // Elements created via a <template> have an ownerDocument with no reference to the body


  return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
  var clientX = event.clientX,
      clientY = event.clientY;
  return popperTreeData.every(function (_ref) {
    var popperRect = _ref.popperRect,
        popperState = _ref.popperState,
        props = _ref.props;
    var interactiveBorder = props.interactiveBorder;
    var basePlacement = getBasePlacement(popperState.placement);
    var offsetData = popperState.modifiersData.offset;

    if (!offsetData) {
      return true;
    }

    var topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
    var bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
    var leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
    var rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;
    var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
    var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
    var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
function updateTransitionEndListener(box, action, listener) {
  var method = action + "EventListener"; // some browsers apparently support `transition` (unprefixed) but only fire
  // `webkitTransitionEnd`...

  ['transitionend', 'webkitTransitionEnd'].forEach(function (event) {
    box[method](event, listener);
  });
}
/**
 * Compared to xxx.contains, this function works for dom structures with shadow
 * dom
 */

function actualContains(parent, child) {
  var target = child;

  while (target) {
    var _target$getRootNode;

    if (parent.contains(target)) {
      return true;
    }

    target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
  }

  return false;
}

var currentInput = {
  isTouch: false
};
var lastMouseMoveTime = 0;
/**
 * When a `touchstart` event is fired, it's assumed the user is using touch
 * input. We'll bind a `mousemove` event listener to listen for mouse input in
 * the future. This way, the `isTouch` property is fully dynamic and will handle
 * hybrid devices that use a mix of touch + mouse input.
 */

function onDocumentTouchStart() {
  if (currentInput.isTouch) {
    return;
  }

  currentInput.isTouch = true;

  if (window.performance) {
    document.addEventListener('mousemove', onDocumentMouseMove);
  }
}
/**
 * When two `mousemove` event are fired consecutively within 20ms, it's assumed
 * the user is using mouse input again. `mousemove` can fire on touch devices as
 * well, but very rarely that quickly.
 */

function onDocumentMouseMove() {
  var now = performance.now();

  if (now - lastMouseMoveTime < 20) {
    currentInput.isTouch = false;
    document.removeEventListener('mousemove', onDocumentMouseMove);
  }

  lastMouseMoveTime = now;
}
/**
 * When an element is in focus and has a tippy, leaving the tab/window and
 * returning causes it to show again. For mouse users this is unexpected, but
 * for keyboard use it makes sense.
 * TODO: find a better technique to solve this problem
 */

function onWindowBlur() {
  var activeElement = document.activeElement;

  if (isReferenceElement(activeElement)) {
    var instance = activeElement._tippy;

    if (activeElement.blur && !instance.state.isVisible) {
      activeElement.blur();
    }
  }
}
function bindGlobalEventListeners() {
  document.addEventListener('touchstart', onDocumentTouchStart, TOUCH_OPTIONS);
  window.addEventListener('blur', onWindowBlur);
}

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
var isIE11 = isBrowser ? // @ts-ignore
!!window.msCrypto : false;

var pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false
};
var renderProps = {
  allowHTML: false,
  animation: 'fade',
  arrow: true,
  content: '',
  inertia: false,
  maxWidth: 350,
  role: 'tooltip',
  theme: '',
  zIndex: 9999
};
var defaultProps = Object.assign({
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: 'auto',
    expanded: 'auto'
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: '',
  offset: [0, 10],
  onAfterUpdate: function onAfterUpdate() {},
  onBeforeUpdate: function onBeforeUpdate() {},
  onCreate: function onCreate() {},
  onDestroy: function onDestroy() {},
  onHidden: function onHidden() {},
  onHide: function onHide() {},
  onMount: function onMount() {},
  onShow: function onShow() {},
  onShown: function onShown() {},
  onTrigger: function onTrigger() {},
  onUntrigger: function onUntrigger() {},
  onClickOutside: function onClickOutside() {},
  placement: 'top',
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: false,
  touch: true,
  trigger: 'mouseenter focus',
  triggerTarget: null
}, pluginProps, renderProps);
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps(partialProps) {

  var keys = Object.keys(partialProps);
  keys.forEach(function (key) {
    defaultProps[key] = partialProps[key];
  });
};
function getExtendedPassedProps(passedProps) {
  var plugins = passedProps.plugins || [];
  var pluginProps = plugins.reduce(function (acc, plugin) {
    var name = plugin.name,
        defaultValue = plugin.defaultValue;

    if (name) {
      var _name;

      acc[name] = passedProps[name] !== undefined ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
    }

    return acc;
  }, {});
  return Object.assign({}, passedProps, pluginProps);
}
function getDataAttributeProps(reference, plugins) {
  var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
    plugins: plugins
  }))) : defaultKeys;
  var props = propKeys.reduce(function (acc, key) {
    var valueAsString = (reference.getAttribute("data-tippy-" + key) || '').trim();

    if (!valueAsString) {
      return acc;
    }

    if (key === 'content') {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }

    return acc;
  }, {});
  return props;
}
function evaluateProps(reference, props) {
  var out = Object.assign({}, props, {
    content: invokeWithArgsOrReturn(props.content, [reference])
  }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
  out.aria = Object.assign({}, defaultProps.aria, out.aria);
  out.aria = {
    expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
    content: out.aria.content === 'auto' ? props.interactive ? null : 'describedby' : out.aria.content
  };
  return out;
}

var innerHTML = function innerHTML() {
  return 'innerHTML';
};

function dangerouslySetInnerHTML(element, html) {
  element[innerHTML()] = html;
}

function createArrowElement(value) {
  var arrow = div();

  if (value === true) {
    arrow.className = ARROW_CLASS;
  } else {
    arrow.className = SVG_ARROW_CLASS;

    if (isElement(value)) {
      arrow.appendChild(value);
    } else {
      dangerouslySetInnerHTML(arrow, value);
    }
  }

  return arrow;
}

function setContent(content, props) {
  if (isElement(props.content)) {
    dangerouslySetInnerHTML(content, '');
    content.appendChild(props.content);
  } else if (typeof props.content !== 'function') {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
function getChildren(popper) {
  var box = popper.firstElementChild;
  var boxChildren = arrayFrom(box.children);
  return {
    box: box,
    content: boxChildren.find(function (node) {
      return node.classList.contains(CONTENT_CLASS);
    }),
    arrow: boxChildren.find(function (node) {
      return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
    }),
    backdrop: boxChildren.find(function (node) {
      return node.classList.contains(BACKDROP_CLASS);
    })
  };
}
function render$2(instance) {
  var popper = div();
  var box = div();
  box.className = BOX_CLASS;
  box.setAttribute('data-state', 'hidden');
  box.setAttribute('tabindex', '-1');
  var content = div();
  content.className = CONTENT_CLASS;
  content.setAttribute('data-state', 'hidden');
  setContent(content, instance.props);
  popper.appendChild(box);
  box.appendChild(content);
  onUpdate(instance.props, instance.props);

  function onUpdate(prevProps, nextProps) {
    var _getChildren = getChildren(popper),
        box = _getChildren.box,
        content = _getChildren.content,
        arrow = _getChildren.arrow;

    if (nextProps.theme) {
      box.setAttribute('data-theme', nextProps.theme);
    } else {
      box.removeAttribute('data-theme');
    }

    if (typeof nextProps.animation === 'string') {
      box.setAttribute('data-animation', nextProps.animation);
    } else {
      box.removeAttribute('data-animation');
    }

    if (nextProps.inertia) {
      box.setAttribute('data-inertia', '');
    } else {
      box.removeAttribute('data-inertia');
    }

    box.style.maxWidth = typeof nextProps.maxWidth === 'number' ? nextProps.maxWidth + "px" : nextProps.maxWidth;

    if (nextProps.role) {
      box.setAttribute('role', nextProps.role);
    } else {
      box.removeAttribute('role');
    }

    if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
      setContent(content, instance.props);
    }

    if (nextProps.arrow) {
      if (!arrow) {
        box.appendChild(createArrowElement(nextProps.arrow));
      } else if (prevProps.arrow !== nextProps.arrow) {
        box.removeChild(arrow);
        box.appendChild(createArrowElement(nextProps.arrow));
      }
    } else if (arrow) {
      box.removeChild(arrow);
    }
  }

  return {
    popper: popper,
    onUpdate: onUpdate
  };
} // Runtime check to identify if the render function is the default one; this
// way we can apply default CSS transitions logic and it can be tree-shaken away

render$2.$$tippy = true;

var idCounter = 1;
var mouseMoveListeners = []; // Used by `hideAll()`

var mountedInstances = [];
function createTippy(reference, passedProps) {
  var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps)))); // ===========================================================================
  // 🔒 Private members
  // ===========================================================================

  var showTimeout;
  var hideTimeout;
  var scheduleHideAnimationFrame;
  var isVisibleFromClick = false;
  var didHideDueToDocumentMouseDown = false;
  var didTouchMove = false;
  var ignoreOnFirstUpdate = false;
  var lastTriggerEvent;
  var currentTransitionEndListener;
  var onFirstUpdate;
  var listeners = [];
  var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
  var currentTarget; // ===========================================================================
  // 🔑 Public members
  // ===========================================================================

  var id = idCounter++;
  var popperInstance = null;
  var plugins = unique(props.plugins);
  var state = {
    // Is the instance currently enabled?
    isEnabled: true,
    // Is the tippy currently showing and not transitioning out?
    isVisible: false,
    // Has the instance been destroyed?
    isDestroyed: false,
    // Is the tippy currently mounted to the DOM?
    isMounted: false,
    // Has the tippy finished transitioning in?
    isShown: false
  };
  var instance = {
    // properties
    id: id,
    reference: reference,
    popper: div(),
    popperInstance: popperInstance,
    props: props,
    state: state,
    plugins: plugins,
    // methods
    clearDelayTimeouts: clearDelayTimeouts,
    setProps: setProps,
    setContent: setContent,
    show: show,
    hide: hide,
    hideWithInteractivity: hideWithInteractivity,
    enable: enable,
    disable: disable,
    unmount: unmount,
    destroy: destroy
  }; // TODO: Investigate why this early return causes a TDZ error in the tests —
  // it doesn't seem to happen in the browser

  /* istanbul ignore if */

  if (!props.render) {

    return instance;
  } // ===========================================================================
  // Initial mutations
  // ===========================================================================


  var _props$render = props.render(instance),
      popper = _props$render.popper,
      onUpdate = _props$render.onUpdate;

  popper.setAttribute('data-tippy-root', '');
  popper.id = "tippy-" + instance.id;
  instance.popper = popper;
  reference._tippy = instance;
  popper._tippy = instance;
  var pluginsHooks = plugins.map(function (plugin) {
    return plugin.fn(instance);
  });
  var hasAriaExpanded = reference.hasAttribute('aria-expanded');
  addListeners();
  handleAriaExpandedAttribute();
  handleStyles();
  invokeHook('onCreate', [instance]);

  if (props.showOnCreate) {
    scheduleShow();
  } // Prevent a tippy with a delay from hiding if the cursor left then returned
  // before it started hiding


  popper.addEventListener('mouseenter', function () {
    if (instance.props.interactive && instance.state.isVisible) {
      instance.clearDelayTimeouts();
    }
  });
  popper.addEventListener('mouseleave', function () {
    if (instance.props.interactive && instance.props.trigger.indexOf('mouseenter') >= 0) {
      getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    }
  });
  return instance; // ===========================================================================
  // 🔒 Private methods
  // ===========================================================================

  function getNormalizedTouchSettings() {
    var touch = instance.props.touch;
    return Array.isArray(touch) ? touch : [touch, 0];
  }

  function getIsCustomTouchBehavior() {
    return getNormalizedTouchSettings()[0] === 'hold';
  }

  function getIsDefaultRenderFn() {
    var _instance$props$rende;

    // @ts-ignore
    return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
  }

  function getCurrentTarget() {
    return currentTarget || reference;
  }

  function getDocument() {
    var parent = getCurrentTarget().parentNode;
    return parent ? getOwnerDocument(parent) : document;
  }

  function getDefaultTemplateChildren() {
    return getChildren(popper);
  }

  function getDelay(isShow) {
    // For touch or keyboard input, force `0` delay for UX reasons
    // Also if the instance is mounted but not visible (transitioning out),
    // ignore delay
    if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === 'focus') {
      return 0;
    }

    return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
  }

  function handleStyles(fromHide) {
    if (fromHide === void 0) {
      fromHide = false;
    }

    popper.style.pointerEvents = instance.props.interactive && !fromHide ? '' : 'none';
    popper.style.zIndex = "" + instance.props.zIndex;
  }

  function invokeHook(hook, args, shouldInvokePropsHook) {
    if (shouldInvokePropsHook === void 0) {
      shouldInvokePropsHook = true;
    }

    pluginsHooks.forEach(function (pluginHooks) {
      if (pluginHooks[hook]) {
        pluginHooks[hook].apply(pluginHooks, args);
      }
    });

    if (shouldInvokePropsHook) {
      var _instance$props;

      (_instance$props = instance.props)[hook].apply(_instance$props, args);
    }
  }

  function handleAriaContentAttribute() {
    var aria = instance.props.aria;

    if (!aria.content) {
      return;
    }

    var attr = "aria-" + aria.content;
    var id = popper.id;
    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      var currentValue = node.getAttribute(attr);

      if (instance.state.isVisible) {
        node.setAttribute(attr, currentValue ? currentValue + " " + id : id);
      } else {
        var nextValue = currentValue && currentValue.replace(id, '').trim();

        if (nextValue) {
          node.setAttribute(attr, nextValue);
        } else {
          node.removeAttribute(attr);
        }
      }
    });
  }

  function handleAriaExpandedAttribute() {
    if (hasAriaExpanded || !instance.props.aria.expanded) {
      return;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      if (instance.props.interactive) {
        node.setAttribute('aria-expanded', instance.state.isVisible && node === getCurrentTarget() ? 'true' : 'false');
      } else {
        node.removeAttribute('aria-expanded');
      }
    });
  }

  function cleanupInteractiveMouseListeners() {
    getDocument().removeEventListener('mousemove', debouncedOnMouseMove);
    mouseMoveListeners = mouseMoveListeners.filter(function (listener) {
      return listener !== debouncedOnMouseMove;
    });
  }

  function onDocumentPress(event) {
    // Moved finger to scroll instead of an intentional tap outside
    if (currentInput.isTouch) {
      if (didTouchMove || event.type === 'mousedown') {
        return;
      }
    }

    var actualTarget = event.composedPath && event.composedPath()[0] || event.target; // Clicked on interactive popper

    if (instance.props.interactive && actualContains(popper, actualTarget)) {
      return;
    } // Clicked on the event listeners target


    if (normalizeToArray(instance.props.triggerTarget || reference).some(function (el) {
      return actualContains(el, actualTarget);
    })) {
      if (currentInput.isTouch) {
        return;
      }

      if (instance.state.isVisible && instance.props.trigger.indexOf('click') >= 0) {
        return;
      }
    } else {
      invokeHook('onClickOutside', [instance, event]);
    }

    if (instance.props.hideOnClick === true) {
      instance.clearDelayTimeouts();
      instance.hide(); // `mousedown` event is fired right before `focus` if pressing the
      // currentTarget. This lets a tippy with `focus` trigger know that it
      // should not show

      didHideDueToDocumentMouseDown = true;
      setTimeout(function () {
        didHideDueToDocumentMouseDown = false;
      }); // The listener gets added in `scheduleShow()`, but this may be hiding it
      // before it shows, and hide()'s early bail-out behavior can prevent it
      // from being cleaned up

      if (!instance.state.isMounted) {
        removeDocumentPress();
      }
    }
  }

  function onTouchMove() {
    didTouchMove = true;
  }

  function onTouchStart() {
    didTouchMove = false;
  }

  function addDocumentPress() {
    var doc = getDocument();
    doc.addEventListener('mousedown', onDocumentPress, true);
    doc.addEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.addEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.addEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function removeDocumentPress() {
    var doc = getDocument();
    doc.removeEventListener('mousedown', onDocumentPress, true);
    doc.removeEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.removeEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.removeEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function () {
      if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) {
        callback();
      }
    });
  }

  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }

  function onTransitionEnd(duration, callback) {
    var box = getDefaultTemplateChildren().box;

    function listener(event) {
      if (event.target === box) {
        updateTransitionEndListener(box, 'remove', listener);
        callback();
      }
    } // Make callback synchronous if duration is 0
    // `transitionend` won't fire otherwise


    if (duration === 0) {
      return callback();
    }

    updateTransitionEndListener(box, 'remove', currentTransitionEndListener);
    updateTransitionEndListener(box, 'add', listener);
    currentTransitionEndListener = listener;
  }

  function on(eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      node.addEventListener(eventType, handler, options);
      listeners.push({
        node: node,
        eventType: eventType,
        handler: handler,
        options: options
      });
    });
  }

  function addListeners() {
    if (getIsCustomTouchBehavior()) {
      on('touchstart', onTrigger, {
        passive: true
      });
      on('touchend', onMouseLeave, {
        passive: true
      });
    }

    splitBySpaces(instance.props.trigger).forEach(function (eventType) {
      if (eventType === 'manual') {
        return;
      }

      on(eventType, onTrigger);

      switch (eventType) {
        case 'mouseenter':
          on('mouseleave', onMouseLeave);
          break;

        case 'focus':
          on(isIE11 ? 'focusout' : 'blur', onBlurOrFocusOut);
          break;

        case 'focusin':
          on('focusout', onBlurOrFocusOut);
          break;
      }
    });
  }

  function removeListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function onTrigger(event) {
    var _lastTriggerEvent;

    var shouldScheduleClickHide = false;

    if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
      return;
    }

    var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === 'focus';
    lastTriggerEvent = event;
    currentTarget = event.currentTarget;
    handleAriaExpandedAttribute();

    if (!instance.state.isVisible && isMouseEvent(event)) {
      // If scrolling, `mouseenter` events can be fired if the cursor lands
      // over a new target, but `mousemove` events don't get fired. This
      // causes interactive tooltips to get stuck open until the cursor is
      // moved
      mouseMoveListeners.forEach(function (listener) {
        return listener(event);
      });
    } // Toggle show/hide when clicking click-triggered tooltips


    if (event.type === 'click' && (instance.props.trigger.indexOf('mouseenter') < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
      shouldScheduleClickHide = true;
    } else {
      scheduleShow(event);
    }

    if (event.type === 'click') {
      isVisibleFromClick = !shouldScheduleClickHide;
    }

    if (shouldScheduleClickHide && !wasFocused) {
      scheduleHide(event);
    }
  }

  function onMouseMove(event) {
    var target = event.target;
    var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);

    if (event.type === 'mousemove' && isCursorOverReferenceOrPopper) {
      return;
    }

    var popperTreeData = getNestedPopperTree().concat(popper).map(function (popper) {
      var _instance$popperInsta;

      var instance = popper._tippy;
      var state = (_instance$popperInsta = instance.popperInstance) == null ? void 0 : _instance$popperInsta.state;

      if (state) {
        return {
          popperRect: popper.getBoundingClientRect(),
          popperState: state,
          props: props
        };
      }

      return null;
    }).filter(Boolean);

    if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
      cleanupInteractiveMouseListeners();
      scheduleHide(event);
    }
  }

  function onMouseLeave(event) {
    var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf('click') >= 0 && isVisibleFromClick;

    if (shouldBail) {
      return;
    }

    if (instance.props.interactive) {
      instance.hideWithInteractivity(event);
      return;
    }

    scheduleHide(event);
  }

  function onBlurOrFocusOut(event) {
    if (instance.props.trigger.indexOf('focusin') < 0 && event.target !== getCurrentTarget()) {
      return;
    } // If focus was moved to within the popper


    if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) {
      return;
    }

    scheduleHide(event);
  }

  function isEventListenerStopped(event) {
    return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf('touch') >= 0 : false;
  }

  function createPopperInstance() {
    destroyPopperInstance();
    var _instance$props2 = instance.props,
        popperOptions = _instance$props2.popperOptions,
        placement = _instance$props2.placement,
        offset = _instance$props2.offset,
        getReferenceClientRect = _instance$props2.getReferenceClientRect,
        moveTransition = _instance$props2.moveTransition;
    var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
    var computedReference = getReferenceClientRect ? {
      getBoundingClientRect: getReferenceClientRect,
      contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
    } : reference;
    var tippyModifier = {
      name: '$$tippy',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (getIsDefaultRenderFn()) {
          var _getDefaultTemplateCh = getDefaultTemplateChildren(),
              box = _getDefaultTemplateCh.box;

          ['placement', 'reference-hidden', 'escaped'].forEach(function (attr) {
            if (attr === 'placement') {
              box.setAttribute('data-placement', state.placement);
            } else {
              if (state.attributes.popper["data-popper-" + attr]) {
                box.setAttribute("data-" + attr, '');
              } else {
                box.removeAttribute("data-" + attr);
              }
            }
          });
          state.attributes.popper = {};
        }
      }
    };
    var modifiers = [{
      name: 'offset',
      options: {
        offset: offset
      }
    }, {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: 'flip',
      options: {
        padding: 5
      }
    }, {
      name: 'computeStyles',
      options: {
        adaptive: !moveTransition
      }
    }, tippyModifier];

    if (getIsDefaultRenderFn() && arrow) {
      modifiers.push({
        name: 'arrow',
        options: {
          element: arrow,
          padding: 3
        }
      });
    }

    modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
    instance.popperInstance = createPopper(computedReference, popper, Object.assign({}, popperOptions, {
      placement: placement,
      onFirstUpdate: onFirstUpdate,
      modifiers: modifiers
    }));
  }

  function destroyPopperInstance() {
    if (instance.popperInstance) {
      instance.popperInstance.destroy();
      instance.popperInstance = null;
    }
  }

  function mount() {
    var appendTo = instance.props.appendTo;
    var parentNode; // By default, we'll append the popper to the triggerTargets's parentNode so
    // it's directly after the reference element so the elements inside the
    // tippy can be tabbed to
    // If there are clipping issues, the user can specify a different appendTo
    // and ensure focus management is handled correctly manually

    var node = getCurrentTarget();

    if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === 'parent') {
      parentNode = node.parentNode;
    } else {
      parentNode = invokeWithArgsOrReturn(appendTo, [node]);
    } // The popper element needs to exist on the DOM before its position can be
    // updated as Popper needs to read its dimensions


    if (!parentNode.contains(popper)) {
      parentNode.appendChild(popper);
    }

    instance.state.isMounted = true;
    createPopperInstance();
  }

  function getNestedPopperTree() {
    return arrayFrom(popper.querySelectorAll('[data-tippy-root]'));
  }

  function scheduleShow(event) {
    instance.clearDelayTimeouts();

    if (event) {
      invokeHook('onTrigger', [instance, event]);
    }

    addDocumentPress();
    var delay = getDelay(true);

    var _getNormalizedTouchSe = getNormalizedTouchSettings(),
        touchValue = _getNormalizedTouchSe[0],
        touchDelay = _getNormalizedTouchSe[1];

    if (currentInput.isTouch && touchValue === 'hold' && touchDelay) {
      delay = touchDelay;
    }

    if (delay) {
      showTimeout = setTimeout(function () {
        instance.show();
      }, delay);
    } else {
      instance.show();
    }
  }

  function scheduleHide(event) {
    instance.clearDelayTimeouts();
    invokeHook('onUntrigger', [instance, event]);

    if (!instance.state.isVisible) {
      removeDocumentPress();
      return;
    } // For interactive tippies, scheduleHide is added to a document.body handler
    // from onMouseLeave so must intercept scheduled hides from mousemove/leave
    // events when trigger contains mouseenter and click, and the tip is
    // currently shown as a result of a click.


    if (instance.props.trigger.indexOf('mouseenter') >= 0 && instance.props.trigger.indexOf('click') >= 0 && ['mouseleave', 'mousemove'].indexOf(event.type) >= 0 && isVisibleFromClick) {
      return;
    }

    var delay = getDelay(false);

    if (delay) {
      hideTimeout = setTimeout(function () {
        if (instance.state.isVisible) {
          instance.hide();
        }
      }, delay);
    } else {
      // Fixes a `transitionend` problem when it fires 1 frame too
      // late sometimes, we don't want hide() to be called.
      scheduleHideAnimationFrame = requestAnimationFrame(function () {
        instance.hide();
      });
    }
  } // ===========================================================================
  // 🔑 Public methods
  // ===========================================================================


  function enable() {
    instance.state.isEnabled = true;
  }

  function disable() {
    // Disabling the instance should also hide it
    // https://github.com/atomiks/tippy.js-react/issues/106
    instance.hide();
    instance.state.isEnabled = false;
  }

  function clearDelayTimeouts() {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    cancelAnimationFrame(scheduleHideAnimationFrame);
  }

  function setProps(partialProps) {

    if (instance.state.isDestroyed) {
      return;
    }

    invokeHook('onBeforeUpdate', [instance, partialProps]);
    removeListeners();
    var prevProps = instance.props;
    var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
      ignoreAttributes: true
    }));
    instance.props = nextProps;
    addListeners();

    if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
      cleanupInteractiveMouseListeners();
      debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
    } // Ensure stale aria-expanded attributes are removed


    if (prevProps.triggerTarget && !nextProps.triggerTarget) {
      normalizeToArray(prevProps.triggerTarget).forEach(function (node) {
        node.removeAttribute('aria-expanded');
      });
    } else if (nextProps.triggerTarget) {
      reference.removeAttribute('aria-expanded');
    }

    handleAriaExpandedAttribute();
    handleStyles();

    if (onUpdate) {
      onUpdate(prevProps, nextProps);
    }

    if (instance.popperInstance) {
      createPopperInstance(); // Fixes an issue with nested tippies if they are all getting re-rendered,
      // and the nested ones get re-rendered first.
      // https://github.com/atomiks/tippyjs-react/issues/177
      // TODO: find a cleaner / more efficient solution(!)

      getNestedPopperTree().forEach(function (nestedPopper) {
        // React (and other UI libs likely) requires a rAF wrapper as it flushes
        // its work in one
        requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
      });
    }

    invokeHook('onAfterUpdate', [instance, partialProps]);
  }

  function setContent(content) {
    instance.setProps({
      content: content
    });
  }

  function show() {


    var isAlreadyVisible = instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);

    if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
      return;
    } // Normalize `disabled` behavior across browsers.
    // Firefox allows events on disabled elements, but Chrome doesn't.
    // Using a wrapper element (i.e. <span>) is recommended.


    if (getCurrentTarget().hasAttribute('disabled')) {
      return;
    }

    invokeHook('onShow', [instance], false);

    if (instance.props.onShow(instance) === false) {
      return;
    }

    instance.state.isVisible = true;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'visible';
    }

    handleStyles();
    addDocumentPress();

    if (!instance.state.isMounted) {
      popper.style.transition = 'none';
    } // If flipping to the opposite side after hiding at least once, the
    // animation will use the wrong placement without resetting the duration


    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh2 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh2.box,
          content = _getDefaultTemplateCh2.content;

      setTransitionDuration([box, content], 0);
    }

    onFirstUpdate = function onFirstUpdate() {
      var _instance$popperInsta2;

      if (!instance.state.isVisible || ignoreOnFirstUpdate) {
        return;
      }

      ignoreOnFirstUpdate = true; // reflow

      void popper.offsetHeight;
      popper.style.transition = instance.props.moveTransition;

      if (getIsDefaultRenderFn() && instance.props.animation) {
        var _getDefaultTemplateCh3 = getDefaultTemplateChildren(),
            _box = _getDefaultTemplateCh3.box,
            _content = _getDefaultTemplateCh3.content;

        setTransitionDuration([_box, _content], duration);
        setVisibilityState([_box, _content], 'visible');
      }

      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      pushIfUnique(mountedInstances, instance); // certain modifiers (e.g. `maxSize`) require a second update after the
      // popper has been positioned for the first time

      (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
      invokeHook('onMount', [instance]);

      if (instance.props.animation && getIsDefaultRenderFn()) {
        onTransitionedIn(duration, function () {
          instance.state.isShown = true;
          invokeHook('onShown', [instance]);
        });
      }
    };

    mount();
  }

  function hide() {


    var isAlreadyHidden = !instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);

    if (isAlreadyHidden || isDestroyed || isDisabled) {
      return;
    }

    invokeHook('onHide', [instance], false);

    if (instance.props.onHide(instance) === false) {
      return;
    }

    instance.state.isVisible = false;
    instance.state.isShown = false;
    ignoreOnFirstUpdate = false;
    isVisibleFromClick = false;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'hidden';
    }

    cleanupInteractiveMouseListeners();
    removeDocumentPress();
    handleStyles(true);

    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh4 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh4.box,
          content = _getDefaultTemplateCh4.content;

      if (instance.props.animation) {
        setTransitionDuration([box, content], duration);
        setVisibilityState([box, content], 'hidden');
      }
    }

    handleAriaContentAttribute();
    handleAriaExpandedAttribute();

    if (instance.props.animation) {
      if (getIsDefaultRenderFn()) {
        onTransitionedOut(duration, instance.unmount);
      }
    } else {
      instance.unmount();
    }
  }

  function hideWithInteractivity(event) {

    getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
    debouncedOnMouseMove(event);
  }

  function unmount() {

    if (instance.state.isVisible) {
      instance.hide();
    }

    if (!instance.state.isMounted) {
      return;
    }

    destroyPopperInstance(); // If a popper is not interactive, it will be appended outside the popper
    // tree by default. This seems mainly for interactive tippies, but we should
    // find a workaround if possible

    getNestedPopperTree().forEach(function (nestedPopper) {
      nestedPopper._tippy.unmount();
    });

    if (popper.parentNode) {
      popper.parentNode.removeChild(popper);
    }

    mountedInstances = mountedInstances.filter(function (i) {
      return i !== instance;
    });
    instance.state.isMounted = false;
    invokeHook('onHidden', [instance]);
  }

  function destroy() {

    if (instance.state.isDestroyed) {
      return;
    }

    instance.clearDelayTimeouts();
    instance.unmount();
    removeListeners();
    delete reference._tippy;
    instance.state.isDestroyed = true;
    invokeHook('onDestroy', [instance]);
  }
}

function tippy(targets, optionalProps) {
  if (optionalProps === void 0) {
    optionalProps = {};
  }

  var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);

  bindGlobalEventListeners();
  var passedProps = Object.assign({}, optionalProps, {
    plugins: plugins
  });
  var elements = getArrayOfElements(targets);

  var instances = elements.reduce(function (acc, reference) {
    var instance = reference && createTippy(reference, passedProps);

    if (instance) {
      acc.push(instance);
    }

    return acc;
  }, []);
  return isElement(targets) ? instances[0] : instances;
}

tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;

// every time the popper is destroyed (i.e. a new target), removing the styles
// and causing transitions to break for singletons when the console is open, but
// most notably for non-transform styles being used, `gpuAcceleration: false`.

Object.assign({}, applyStyles$1, {
  effect: function effect(_ref) {
    var state = _ref.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    } // intentionally return no cleanup function
    // return () => { ... }

  }
});

var sticky = {
  name: 'sticky',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference,
        popper = instance.popper;

    function getReference() {
      return instance.popperInstance ? instance.popperInstance.state.elements.reference : reference;
    }

    function shouldCheck(value) {
      return instance.props.sticky === true || instance.props.sticky === value;
    }

    var prevRefRect = null;
    var prevPopRect = null;

    function updatePosition() {
      var currentRefRect = shouldCheck('reference') ? getReference().getBoundingClientRect() : null;
      var currentPopRect = shouldCheck('popper') ? popper.getBoundingClientRect() : null;

      if (currentRefRect && areRectsDifferent(prevRefRect, currentRefRect) || currentPopRect && areRectsDifferent(prevPopRect, currentPopRect)) {
        if (instance.popperInstance) {
          instance.popperInstance.update();
        }
      }

      prevRefRect = currentRefRect;
      prevPopRect = currentPopRect;

      if (instance.state.isMounted) {
        requestAnimationFrame(updatePosition);
      }
    }

    return {
      onMount: function onMount() {
        if (instance.props.sticky) {
          updatePosition();
        }
      }
    };
  }
};

function areRectsDifferent(rectA, rectB) {
  if (rectA && rectB) {
    return rectA.top !== rectB.top || rectA.right !== rectB.right || rectA.bottom !== rectB.bottom || rectA.left !== rectB.left;
  }

  return true;
}

tippy.setDefaultProps({
  render: render$2
});

const hasFilterIcon = `
  <div style="
    color: var(--gscape-color-accent);
    background: var(--gscape-color-accent-subtle);
    border: solid 1px;
    line-height: 0;
    padding: 2px 4px;
    margin: 0 8px;
    border-radius: 12px;"
  >
    ${filter.strings.join('').replace(/20px/g, '15px')}
  </div>`;
function addHasFilterIcon(node) {
    const dummyDomElement = document.createElement('div');
    const container = cy.container();
    if (container === null || container === void 0 ? void 0 : container.firstElementChild) {
        node['tippy'] = tippy(dummyDomElement, {
            content: hasFilterIcon,
            trigger: 'manuaul',
            hideOnClick: false,
            allowHTML: true,
            getReferenceClientRect: node.popperRef().getBoundingClientRect,
            sticky: "reference",
            appendTo: container.firstElementChild,
            placement: "right",
            plugins: [sticky],
            offset: [0, 0]
        });
        node['tippy'].show();
    }
}
function removeHasFilterIcon(node) {
    var _a;
    (_a = node['tippy']) === null || _a === void 0 ? void 0 : _a.destroy();
    node['tippy'] = null;
}
function shouldHaveFilterIcon(node) {
    return (node === null || node === void 0 ? void 0 : node.data().hasFilters) && !node['tippy'];
}
function addOrRemoveFilterIcon(node) {
    if (shouldHaveFilterIcon(node)) {
        addHasFilterIcon(node);
    }
    else if (!(node === null || node === void 0 ? void 0 : node.data().hasFilters)) {
        removeHasFilterIcon(node);
    }
}

const klayLayoutOpt = {
    name: 'klay',
    klay: {
        direction: 'RIGHT',
        spacing: 60,
        nodeLayering: 'INTERACTIVE',
    }
};
function radialLayoutOpt(node) {
    const p = node.position();
    const radius = Math.sqrt((Math.pow(node.width() / 2, 2) + Math.pow(node.height() / 2, 2))) + 20;
    return {
        name: 'circle',
        avoidOverlap: true,
        fit: false,
        boundingBox: {
            x1: p.x - 2,
            x2: p.x + 2,
            y1: p.y - 2,
            y2: p.y + 2
        },
        startAngle: -Math.PI / 2,
        radius: radius,
        nodeDimensionsIncludeLabels: true,
    };
}
function gridLayoutOpt(node) {
    const p = node.position();
    return {
        name: 'grid',
        condense: true,
        padding: 10,
        fit: false,
        cols: 2,
        boundingBox: {
            x1: p.x - 20,
            x2: p.x + 20,
            y1: p.y - 20,
            y2: p.y + 20
        },
    };
}

const DISPLAYED_NAME = 'displayed_name';
let elementClickCallback;
cy.on('tap', 'node, edge', e => {
    // if it's an entity (class, data property or obj property)
    if (Object.values(EntityTypeEnum).includes(e.target.data().type)) {
        // if it's a child, the ID of the selected elem is the id of the parent
        let elemID = e.target.isChild() ? e.target.data().parent : e.target.id();
        elementClickCallback(elemID, e.target.data().iri);
    }
});
/**
 * Add a node to the query graph
 */
function addNode(node) {
    var _a, _b;
    if (!node || !node.id)
        return;
    const newNodeData = getDataObj(node);
    const existingNode = getElementById(node.id);
    let newNode = undefined;
    if (((_a = node.entities) === null || _a === void 0 ? void 0 : _a.length) && node.entities.length > 1 && (existingNode === null || existingNode === void 0 ? void 0 : existingNode.children().length) !== ((_b = node.entities) === null || _b === void 0 ? void 0 : _b.length)) {
        node.entities.forEach((child, i) => {
            if (!(existingNode === null || existingNode === void 0 ? void 0 : existingNode.children().some(c => c[0].data('iri') === child.iri))) {
                newNode = cy.add({ data: getDataObj(node, i) });
                arrange();
            }
        });
    }
    if (!existingNode) {
        newNode = cy.add({ data: newNodeData });
        arrange();
    }
    else {
        existingNode.removeData();
        existingNode.data(newNodeData);
    }
    newNode = newNode || existingNode;
    if (newNode)
        addOrRemoveFilterIcon(newNode);
}
function addEdge(sourceNode, targetNode, edgeData) {
    let newEdgeData;
    //const sourceCyNode = getElementById(sourceNode.id)
    if (!targetNode.id || !targetNode.entities)
        return;
    const targetCyNode = getElementById(targetNode.id);
    if (!targetCyNode) {
        addNode(targetNode);
    }
    newEdgeData = edgeData
        // get data object since it's an entity and set source and target
        ? getDataObj(edgeData)
        // not an entity (e.g. dataProperty connectors)
        : { id: `${sourceNode.id}-${targetNode.id}`, type: targetNode.entities[0].type };
    const cyEdge = getElementById(newEdgeData.id);
    // if edge is already in graph, make sure it has the right source and target
    // a join operation might have changed one of the two
    if (cyEdge) {
        cyEdge.move({
            source: sourceNode.id,
            target: targetNode.id
        });
        return; // no need to add a new edge
    }
    newEdgeData.source = sourceNode.id;
    newEdgeData.target = targetNode.id;
    cy.add({ data: newEdgeData });
    arrange();
}
/**
 * Remove a node from query graph, it will remove also all subsequent nodes
 */
function removeNode(nodeID) {
    const node = getElementById(nodeID);
    if (!node || node.empty())
        return;
    removeHasFilterIcon(node);
    if (node.isChild()) {
        const parent = node.parent();
        // if node is child and there is only one child left, remove all child from parent
        if (parent.children().length === 2) {
            parent.children().each(child => { child.remove(); });
        }
    }
    node.remove();
}
/**
 * Select a node given its id and return the node in cytoscape representation
 */
function selectNode(nodeId) {
    getElements().removeClass('sparqling-selected');
    let cyNode = cy.$id(nodeId);
    cyNode.addClass('sparqling-selected');
    return cyNode;
}
/**
 * Arrange nodes in nice positions
 */
function arrange() {
    const dataPropertySelector = `node[type = "${EntityTypeEnum.DataProperty}"]`;
    const classSelector = `node[type = "${EntityTypeEnum.Class}"]`;
    if (getElements().length <= 1) {
        /**
         * [HACKY]
         * In case of the first element added to the queryGraph, the widget is asynchronously
         * updating adding the bgpContainer to its body, hence cytoscape's container's
         * dimensions are still (0,0) and the fit can't be performed.
         * Let's wait a little bit so the update in the widget finishes and we can fit viewport
         * to the graph.
         */
        const container = cy.container();
        if (container) {
            container.style.visibility = 'hidden'; // avoid seeing node moving across the viewport
            setTimeout(() => {
                cy.fit();
                container.style.visibility = 'visible'; // show graph only when it's correctly fitted
            }, 200);
        }
        return;
    }
    const klayLayout = cy.layout(klayLayoutOpt);
    klayLayout.on('layoutstop', () => {
        cy.$(classSelector).forEach(node => {
            const dataProperties = node.neighborhood(dataPropertySelector);
            // run grid layout on compound nodes
            if (!node.isChildless()) {
                node.children().layout(gridLayoutOpt(node)).run();
            }
            if (!dataProperties.empty()) {
                dataProperties.layout(radialLayoutOpt(node)).run();
            }
        });
        cy.fit();
    });
    klayLayout.run();
}
function renderOptionals(optionals) {
    clearOptionals();
    optionals === null || optionals === void 0 ? void 0 : optionals.forEach(opt => {
        var _a;
        (_a = opt.graphIds) === null || _a === void 0 ? void 0 : _a.forEach((elemId) => { var _a; return (_a = getElementById(elemId)) === null || _a === void 0 ? void 0 : _a.data('optional', true); });
    });
}
function clearOptionals() {
    getElements().filter('[?optional]').data('optional', false);
}
function updateDisplayedNames() {
    cy.elements(`[${DISPLAYED_NAME}]`).forEach(elem => {
        elem.data(DISPLAYED_NAME, getDisplayedName(elem.data()));
    });
}
function onElementClick$1(callback) {
    elementClickCallback = callback;
}
/**
 * Given a graphElement, build a data object for its instance in cytoscape
 * @param graphElement the graphElement you want to get data from
 * @param i the index of the entity you want are interested to
 * @returns the data object for cytoscape's instanc of the graphElement
 */
function getDataObj(graphElement, i) {
    var _a;
    if (graphElement.entities && graphElement.id) {
        let data = Object.assign({}, graphElement.entities[i || 0]);
        if (i !== undefined && i !== null) {
            data.parent = graphElement.id;
            data.id = `${graphElement.id}-${data.iri}`;
        }
        else {
            data.id = graphElement.id;
        }
        const filtersNumber = (_a = getFiltersOnVariable(graphElement.id)) === null || _a === void 0 ? void 0 : _a.length;
        data.hasFilters = filtersNumber && filtersNumber > 0 ? true : false;
        data.displayed_name = getDisplayedName(data);
        return data;
    }
}
function getDisplayedName(data) {
    let labels = data.labels;
    const displayedNameType = getDisplayedNameType();
    if (displayedNameType === EntityNameType.LABEL && labels)
        // use first language found if the actual one is not available
        return labels[getLanguage()] || labels[Object.keys(labels)[0]];
    else
        return data[displayedNameType] || data.iri;
}

const { DataProperty, Class, ObjectProperty, InverseObjectProperty } = EntityTypeEnum;
var getStylesheet = (theme) => {
    return [
        {
            selector: '*',
            style: {
                'color': theme.colours.label,
                'border-width': '1px',
            }
        },
        {
            selector: `node[type = "${Class}"]`,
            style: {
                'shape': 'round-rectangle',
                'background-color': theme.colours.class,
                'border-color': theme.colours["class-contrast"],
                'text-halign': 'center',
                'text-valign': 'center',
                'width': '60px',
            },
        },
        {
            selector: 'edge',
            style: {
                'line-style': 'solid',
                'target-arrow-shape': 'triangle',
                'target-arrow-fill': 'filled',
                'curve-style': 'bezier',
                'text-rotation': 'autorotate',
                'text-margin-y': -10,
                'width': 2,
            },
        },
        {
            selector: '[displayed_name]',
            style: {
                'text-wrap': 'wrap',
                'text-max-width': '80px',
                'text-overflow-wrap': 'anywhere',
                'label': 'data(displayed_name)',
                'font-size': '8px'
            },
        },
        {
            selector: `edge[type = "${DataProperty}"]`,
            style: {
                'curve-style': 'straight',
                'target-arrow-shape': 'none',
                'line-color': theme.colours["data-property"],
            },
        },
        {
            selector: `node[type = "${DataProperty}"]`,
            style: {
                'shape': 'ellipse',
                'height': 10,
                'width': 10,
                'background-color': theme.colours["data-property"],
                'border-color': theme.colours["data-property-contrast"],
            },
        },
        {
            selector: `edge[type = "${ObjectProperty}"], edge[type = "${InverseObjectProperty}"]`,
            style: {
                'line-color': theme.colours["object-property-contrast"],
                'target-arrow-color': theme.colours["object-property-contrast"],
                'source-arrow-color': theme.colours["object-property-contrast"],
                'text-max-width': '60px'
            }
        },
        {
            selector: `edge[type = "${InverseObjectProperty}"]`,
            style: {
                'target-arrow-shape': 'none',
                'source-arrow-shape': 'triangle',
                'source-arrow-fill': 'filled',
            }
        },
        {
            selector: '.cdnd-drop-target',
            style: {
                'background-color': theme.colours["bg-inset"],
                'border-style': 'dashed',
                'border-color': theme.colours["accent-muted"],
                'shape': 'round-rectangle',
                'label': 'Release to join these classes',
                'font-size': '12px',
            }
        },
        {
            selector: '[?optional]',
            style: {
                'opacity': 0.8
            }
        },
        {
            selector: 'node[?optional]',
            style: {
                'border-style': 'dashed',
            }
        },
        {
            selector: 'edge[?optional]',
            style: {
                "line-style": 'dashed',
            }
        },
        {
            selector: '$node > node',
            style: {
                'label': '',
            }
        },
        //-----------------------------------------------------------
        // selected selector always last
        {
            selector: '.sparqling-selected',
            style: {
                'underlay-color': theme.getColour(ColoursNames.accent),
                'underlay-padding': '2.5px',
                'underlay-opacity': 1,
            }
        },
    ];
};

function setDisplayedNameType(newDisplayedNameType, newlanguage) {
    setStateDisplayedNameType(newDisplayedNameType);
    if (newlanguage)
        setLanguage(newlanguage);
    updateDisplayedNames();
}
function setTheme(newTheme) {
    cy.style(getStylesheet(newTheme));
}

let joinStartCondition;
let joinAllowedCondition;
let joinCallback;
cy.on('cdnddrop', (e, parent, dropSibling) => {
    if (!parent.empty() && !dropSibling.empty()) {
        // avoid creating a compound node, we want to merge the two nodes
        dropSibling.move({ parent: null });
        e.target.move({ parent: null });
        parent.remove();
        joinCallback(e.target.id(), dropSibling.id());
    }
});
const compoundDragAndDropOption = {
    grabbedNode: (node) => joinStartCondition(node.id()),
    dropTarget: (dropTarget) => joinAllowedCondition(dropTarget === null || dropTarget === void 0 ? void 0 : dropTarget.id(), cy.$(':grabbed').id()),
    dropSibling: (dropTarget, grabbedNode) => joinAllowedCondition(dropTarget === null || dropTarget === void 0 ? void 0 : dropTarget.id(), cy.$(':grabbed').id())
};
cy.compoundDragAndDrop(compoundDragAndDropOption);
function setJoinStartCondition(callback) {
    joinStartCondition = callback;
}
function setJoinAllowedCondition(callback) {
    joinAllowedCondition = callback;
}
function onJoin$1(callback) {
    joinCallback = callback;
}

function onMakeOptional(callback) {
    onMakeOptional$1((elemId) => {
        const graphElement = getGraphElementByID(elemId);
        if (graphElement)
            callback(graphElement);
    });
}
function onRemoveOptional(callback) {
    onRemoveOptional$1((elemId) => {
        const graphElement = getGraphElementByID(elemId);
        if (graphElement)
            callback(graphElement);
    });
}

const widget = new QueryGraphWidget(bgpContainer);
// // inject tests for allowing joins into renderer, keep renderer logic agnostic
setJoinStartCondition((nodeID) => {
    const graphElement = getGraphElementByID(nodeID);
    return graphElement ? canStartJoin(graphElement) : false;
});
setJoinAllowedCondition((node1ID, node2ID) => {
    let ge1 = getGraphElementByID(node1ID);
    let ge2 = getGraphElementByID(node2ID);
    return ge1 && ge2 ? isJoinAllowed(ge1, ge2) : false;
});
function selectElement(nodeIDorIRI) {
    let graphElem = getGraphElementByID(nodeIDorIRI) || getGraphElementByIRI(nodeIDorIRI);
    //bgp.unselect()
    if (graphElem === null || graphElem === void 0 ? void 0 : graphElem.id) {
        selectNode(graphElem.id);
        // selectedGraphElement = graphElem
    }
    return graphElem;
}
function render$1(graphElem, parent, objectProperty) {
    var _a, _b;
    if (!graphElem)
        return;
    if (!isObjectProperty(graphElem)) {
        addNode(graphElem);
        if (parent) {
            addEdge(parent, graphElem, objectProperty);
        }
    }
    // if the actual elem was an object property, it will be added at next step as edge
    // between this elem and its children
    if (isObjectProperty(graphElem)) {
        (_a = graphElem.children) === null || _a === void 0 ? void 0 : _a.forEach((childGraphElem) => render$1(childGraphElem, parent, graphElem));
    }
    else {
        (_b = graphElem.children) === null || _b === void 0 ? void 0 : _b.forEach((childGraphElem) => render$1(childGraphElem, graphElem));
    }
}
// // remove elements not in query anymore, asynchronously
function removeNodesNotInQuery() {
    let deletedNodeIds = [];
    getElements().forEach(elem => {
        const graphElement = getGraphElementByID(elem.id());
        if (elem.data('displayed_name') && !graphElement) {
            /**
             * remove it if elem is:
             *  - not a child
             *  - a child and its iri is not in the query anymore
             */
            if (!elem.isChild() || !getGraphElementByIRI(elem.data('iri'))) {
                deletedNodeIds.push(elem.id());
                removeNode(elem.id());
            }
        }
    });
    return deletedNodeIds;
}
function centerOnElem(graphElem) {
    if (graphElem.id) {
        let cyElem = getElementById(graphElem.id);
        if (cyElem)
            centerOnElement(cyElem, cyElem.cy().maxZoom());
    }
}
// // ******************************* GRAPH INTERACTION CALLBACKS ******************************* //
function onAddHead(callback) {
    onAddHead$1(id => {
        const graphElement = getGraphElementByID(id);
        if (graphElement)
            callback(graphElement);
    });
}
function onDelete$1(callback) {
    onDelete$2((id, iri) => {
        const graphElement = getGraphElementByID(id) || getParentFromChildId(id);
        if (graphElement)
            callback(graphElement, iri);
    });
}
function onAddFilter$1(callback) {
    onAddFilter$2(id => {
        const graphElement = getGraphElementByID(id);
        if (graphElement)
            callback(graphElement);
    });
}
function onSeeFilters(callback) {
    onSeeFilters$1(id => {
        const graphElement = getGraphElementByID(id);
        if (graphElement)
            callback(graphElement);
    });
}
function onJoin(callback) {
    onJoin$1((node1ID, node2ID) => {
        let graphElem1 = getGraphElementByID(node1ID);
        let graphElem2 = getGraphElementByID(node2ID);
        if (graphElem1 && graphElem2)
            callback(graphElem1, graphElem2);
    });
}
function onElementClick(callback) {
    onElementClick$1((id, iri) => {
        const graphElement = getGraphElementByID(id);
        if (graphElement)
            callback(graphElement, iri);
    });
}
function isIriInQueryGraph$1(iri) {
    return getGraphElementByIRI(iri) ? true : false;
}

let sortChangedCallback;
let dragging;
const dropIndicator = document.createElement('hr');
dropIndicator.style.width = '90%';
dropIndicator.style.opacity = '0.5';
function onDragStart(event) {
    var _a;
    dragging = getDraggedComponent(event.target);
    dragging.classList.add('dragged');
    (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', '');
}
function onDragOver(event) {
    event.preventDefault();
    let target = getDraggedComponent(event.target);
    const bounding = target.getBoundingClientRect();
    const offset = bounding.y + (bounding.height / 2);
    if (event.clientY - offset > 0) {
        target.parentNode.insertBefore(dropIndicator, target.nextSibling);
    }
    else {
        target.parentNode.insertBefore(dropIndicator, target);
    }
}
function onDragEnd(event) {
    event.preventDefault();
    document.ondrop = null;
    const elemsWrapper = dropIndicator.parentNode;
    if (elemsWrapper) {
        elemsWrapper.replaceChild(dragging, dropIndicator);
        setTimeout(() => dragging.classList.remove('dragged'), 100);
        const draggedElemNewIndex = getDraggedElemNewIndex();
        if (draggedElemNewIndex || draggedElemNewIndex === 0)
            sortChangedCallback(dragging._id, draggedElemNewIndex);
    }
    else {
        dropIndicator.remove();
    }
}
function allowDrop(event) {
    event.preventDefault();
}
function onElementSortChange(callback) {
    sortChangedCallback = callback;
}
function getDraggedComponent(originalTarget) {
    while (originalTarget.nodeName !== 'HEAD-ELEMENT' && originalTarget.nodeName !== 'body') {
        originalTarget = originalTarget.parentNode;
    }
    return originalTarget.nodeName === 'HEAD-ELEMENT' ? originalTarget : null;
}
function getDraggedElemNewIndex() {
    const elemsWrapper = dragging.parentNode;
    if (elemsWrapper) {
        let count = 0;
        for (const child of elemsWrapper.children) {
            if (child === dragging) {
                return count;
            }
            count += 1;
        }
    }
    return null;
}

const ALIAS_INPUT_ID = 'alias';
class HeadElementComponent extends ui.BaseMixin(ui.DropPanelMixin(s)) {
    constructor(headElement) {
        super();
        this.showCxtMenu = () => { };
        this.onDelete = () => { };
        this.onRename = () => { };
        this.onLocalize = () => { };
        this.onOrderBy = () => { };
        this.addFilterCallback = (headElementId) => { };
        this.editFilterCallback = (filterId) => { };
        this.deleteFilterCallback = (filterId) => { };
        this.addFunctionCallback = (headElementId) => { };
        this.addAggregationCallback = (headElementId) => { };
        this.headElement = headElement;
        // this.deleteButton = new UI.GscapeButton(rubbishBin, 'Delete Field')
        // this.deleteButton.onClick = () => { }
        // this.deleteButton.classList.add('danger')
        // this.toggleBodyButton = new UI.GscapeButton(UI.icons.triangle_down, 'Show More', UI.icons.triangle_up)
        // this.toggleBodyButton.onClick = () => (this as any).toggleBody()
        // this.toggleBodyButton.style.boxShadow = 'none'
        // this.localizeButton = new UI.GscapeButton(crosshair, 'Find in Query Graph')
        // this.localizeButton.onClick = () => this.localizeCallback(this._id)
        // this.addFilterButton = new UI.GscapeButton(addFilter, 'Add Filter')
        // this.addFilterButton.onClick = () => this.addFilterCallback(this._id)
        // this.addFunctionButton = new UI.GscapeButton(functionIcon, 'Add Function')
        // this.addFunctionButton.onClick = () => this.addFunctionCallback(this._id)
        // this.orderByButton = new UI.GscapeButton(null, 'Order By')
        // this.orderByButton.onClick = () => this.orderByCallback(this._id)
        // this.addAggregationButton = new UI.GscapeButton(sigma, 'Add Aggregation Function')
        // this.addAggregationButton.onClick = () => this.addAggregationCallback(this._id)
        this.ondragstart = (evt) => onDragStart(evt);
        this.ondragover = (evt) => onDragOver(evt);
        this.ondragend = (evt) => onDragEnd(evt);
        this.ondrop = (evt) => evt.preventDefault();
    }
    render() {
        var _a, _b;
        // if (this.ordering > 0) {
        //   this.orderByButton.icon = sortAscendingIcon
        //   this.orderByButton.highlighted = true
        // } else if (this.ordering < 0) {
        //   this.orderByButton.icon = sortDescendingIcon
        //   this.orderByButton.highlighted = true
        // } else {
        //   this.orderByButton.icon = sortIcon
        //   this.orderByButton.highlighted = false
        // }
        return $ `
      <div>
        <div id="field-head">
          <div id="drag-handler" draggable="true">
            ${dragHandler}
          </div>
          <div id="alias-input">
            <input
              id="${ALIAS_INPUT_ID}"
              @focusout="${this.handleInputChange}"
              placeholder="${this.alias || this.graphElementId}"
              value="${this.alias || this.graphElementId}"
              title="Rename Field"
            />
          </div>
          <div id="actions">
            ${getTrayButtonTemplate('Show in graphs', crosshair, undefined, 'localize-action', () => this.onLocalize(this._id))}
            ${getTrayButtonTemplate('Order results ascending/descending', this.orderIcon, undefined, 'sort-action', () => this.onOrderBy(this._id))}
            ${getTrayButtonTemplate('More actions', kebab, undefined, 'cxt-menu-action', () => this.showCxtMenu())}
          </div>
          ${this.hasAnythingInBody || this.ordering !== 0
            ? $ `
              <div id="state-tray">
                ${this.function ? functionIcon : null}
                ${this.ordering && this.ordering !== 0 ? this.orderIcon : null}
                ${((_a = this.filters) === null || _a === void 0 ? void 0 : _a.length) > 0 ? filter : null}
                ${this.groupBy ? sigma : null}
              </div>
            `
            : null}
          ${this.hasAnythingInBody
            ? $ `
              <div id="toggle-panel">
                ${getTrayButtonTemplate('Expand', expandMore, expandLess, 'expand-action', this.togglePanel)}
              </div>
            `
            : null}
        </div>
        <div id="drop-panel" class="hide">
          ${this.groupBy
            ? $ `
              <div class="section">
                <div class="section-header bold-text">Aggregation</div>
                <div class="filters-function-list">
                  ${getElemWithOperatorList([this.groupBy])}
                </div>
                <span class="title">Having</span>
                <div class="filters-function-list">
                  ${getElemWithOperatorList(this.having)}
                </div>
              </div>
            `
            : null}

          ${this.function
            ? $ `
              <div class="section">
                <div class="section-header bold-text">Function</div>
                <div class="filters-function-list">
                  ${getElemWithOperatorList([this.function])}
                </div>
              </div>
            `
            : null}
          
          ${((_b = this.filters) === null || _b === void 0 ? void 0 : _b.length) > 0
            ? $ `
              <div class="section">
                <div class="section-header bold-text">Filters</div>
                <div class="filters-function-list">
                  ${getElemWithOperatorList(this.filters, this.editFilterCallback, this.deleteFilterCallback)}
                </div>
              </div>
            `
            : null}
        </div>
      </div>
    `;
    }
    set headElement(newElement) {
        if (this._id === newElement.id)
            return;
        if (newElement.id)
            this._id = newElement.id;
        if (newElement.alias)
            this.alias = newElement.alias;
        if (newElement.graphElementId)
            this.graphElementId = newElement.graphElementId;
        this.entityType = newElement['entityType'];
        this.dataType = newElement['dataType'] || 'Type';
        if (newElement.function)
            this.function = newElement.function;
        if (newElement.ordering)
            this.ordering = newElement.ordering;
        if (newElement.groupBy)
            this.groupBy = newElement.groupBy;
        if (newElement.having)
            this.having = newElement.having;
        let types = {
            'class': 'class',
            'objectProperty': 'object-property',
            'dataProperty': 'data-property'
        };
        this.style.borderColor = `var(--gscape-color-${types[this.entityType]}-contrast)`;
        if (newElement.graphElementId) {
            const filtersOnVariable = getFiltersOnVariable(newElement.graphElementId);
            if (filtersOnVariable)
                this.filters = filtersOnVariable;
        }
    }
    getSelect(sectionName, name, defaultOpt, options) {
        const isDefaultAlreadySet = Object.values(options).includes(defaultOpt);
        return $ `
      <select name="${name}" sectionName="${sectionName}">
        ${isDefaultAlreadySet ? null : $ `<option selected>${defaultOpt}</option>`}
        ${Object.keys(options).map(key => {
            if (options[key] === defaultOpt)
                return $ `<option value="${key}" selected>${options[key]}</option>`;
            else
                return $ `<option value="${key}">${options[key]}</option>`;
        })}
          </select>
    `;
    }
    handleInputChange(evt) {
        let target = evt.currentTarget;
        if (this.alias !== target.value && target.value.length > 0 && target.value !== this.graphElementId) {
            this.onRename(this._id, target.value);
        }
        else {
            target.value = this.alias || this.graphElementId;
        }
    }
    onFunctionSet(callback) { }
    onAddFilter(callback) {
        this.addFilterCallback = callback;
    }
    onEditFilter(callback) {
        this.editFilterCallback = callback;
    }
    onDeleteFilter(callback) {
        this.deleteFilterCallback = callback;
    }
    onAddFunction(callback) {
        this.addFunctionCallback = callback;
    }
    onAddAggregation(callback) {
        this.addAggregationCallback = callback;
    }
    get dragHandler() {
        return this.shadowRoot.querySelector('#drag-handler');
    }
    get hasAnythingInBody() {
        var _a;
        return ((_a = this.filters) === null || _a === void 0 ? void 0 : _a.length) > 0 || this.function || this.groupBy;
    }
    get orderIcon() {
        if (this.ordering > 0) {
            return sortAscendingIcon;
        }
        else if (this.ordering < 0) {
            return sortDescendingIcon;
        }
        else {
            return sortIcon;
        }
    }
    get moreActionsButton() {
        var _a;
        return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#cxt-menu-action');
    }
    get cxtMenuCommands() {
        const result = [];
        result.push({
            content: 'Add Filter',
            icon: addFilter$1,
            select: () => this.addFilterCallback(this._id)
        });
        if (!this.function) {
            result.push({
                content: 'Add Function',
                icon: functionIcon,
                select: () => this.addFunctionCallback(this._id)
            });
        }
        if (!this.groupBy) {
            result.push({
                content: 'Add aggregation function',
                icon: sigma,
                select: () => this.addAggregationCallback(this._id)
            });
        }
        result.push({
            content: 'Delete field',
            icon: rubbishBin,
            select: () => this.onDelete(this._id)
        });
        return result;
    }
}
HeadElementComponent.properties = {
    alias: { attribute: false },
    graphElementId: { attribute: false },
    function: { attribute: false },
    _entityType: { type: String },
};
HeadElementComponent.styles = [
    ui.baseStyle,
    getElemWithOperatorStyle(),
    r$2 `
      :host {
        display:block;
        height: fit-content;
        margin:5px 0;
        position: relative;
        opacity:1;
        border: none;
        transition: all 0.5s;
        border-left: solid 2px;
      }

      :host(.dragged) {
        opacity: 0.2;
        border: solid 2px var(--gscape-color-accent);
      }

      #alias-input {
        flex-grow: 2;
      }

      #field-head{
        display: flex;
        align-items: center;
        gap: 2px;
        padding-left: 20px;
      }

      #drag-handler {
        cursor: grab;
        display: none;
        line-height: 0;
        position: absolute;
        left: 0;
      }

      :host(:hover) #drag-handler {
        display: inline-block;
      }

      #field-head:hover > #actions {
        display: flex;
      }

      #field-head:hover > #state-tray {
        display: none;
      }

      #field-head-input-action-wrapper:hover > #state-tray {
        display: none;
      }
      #field-head-input-action-wrapper > input:focus {
        background-color: blue;
      }

      #actions {
        align-items: center;
        display: none;
      }

      #actions > * {
        line-height: 0;
      }

      .danger:hover {
        color: var(--gscape-color-error);
      }

      .filters-function-list {
        display:flex;
        flex-direction: column;
        gap: 20px;
      }

      #state-tray {
        color: var(--gscape-color-accent);
        line-height: 0;
      }

      #state-tray > svg {
        height: 15px;
        width: 15px;
      }

      summary {
        list-style: none
      }

      #drop-panel {
        padding: 8px;
        padding-right: 0;
      }

      .section {
        margin: 8px 0;
      }
    `,
];
customElements.define('head-element', HeadElementComponent);

class QueryHeadWidget extends ui.BaseMixin(ui.DropPanelMixin(s)) {
    constructor() {
        super();
        this.title = 'Query Results';
        this.headElements = [];
        this.togglePanel = () => {
            super.togglePanel();
            this.requestUpdate();
        };
    }
    render() {
        return $ `
      ${this.isPanelClosed()
            ? $ `
          <div class="top-bar traslated-down">
            <gscape-button 
              id="toggle-panel-button"
              @click=${this.togglePanel}
              label=${this.title}
            > 
              <span slot="icon">${tableEye}</span>
              <span slot="trailing-icon">${ui.icons.plus}</span>
            </gscape-button>
          </div>
        `
            : $ `
          <div class="gscape-panel" id="drop-panel" style="width: 100%; overflow-y:clip">
            <div class="top-bar">
              <div id="widget-header" class="bold-text">
                ${tableEye}
                <span>${this.title}</span>
              </div>

              <gscape-button 
                id="toggle-panel-button"
                size="s" 
                type="subtle"
                @click=${this.togglePanel}
              > 
                <span slot="icon">${ui.icons.minus}</span>
              </gscape-button>
            </div>

          ${isCountStarActive()
                ? $ `
              <div class="blank-slate sparqling-blank-slate">
                ${counter}
                <div class="header">${countStarMsg()}</div>
              </div>
            `
                : this.headElements.length === 0
                    ? $ `
                <div class="blank-slate sparqling-blank-slate">
                  ${asterisk}
                  <div class="header">${emptyHeadMsg()}</div>
                  <div class="tip description" title="${emptyHeadTipMsg()}">${tipWhy()}</div>
                </div>
              `
                    : $ `
                <div id="elems-wrapper" @dragover=${allowDrop} @drop=${allowDrop}>
                  ${this.headElements.map(headElement => new HeadElementComponent(headElement))}
                </div>
              `}
          </div>
        `}
    `;
    }
    updated() {
        var _a;
        // register callbacks for all head elements
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('head-element').forEach((element) => {
            const headElementComponent = element;
            headElementComponent.onDelete = this.deleteElementCallback;
            headElementComponent.onRename = this.renameElementCallback;
            headElementComponent.onLocalize = this.localizeElementCallback;
            headElementComponent.onAddFilter(this.addFilterCallback);
            headElementComponent.onEditFilter(this.editFilterCallback);
            headElementComponent.onDeleteFilter(this.deleteFilterCallback);
            headElementComponent.onAddFunction(this.addFunctionCallback);
            headElementComponent.onOrderBy = this.orderByChangeCallback;
            headElementComponent.onAddAggregation(this.addAggregationCallback);
            headElementComponent.showCxtMenu = () => {
                if (headElementComponent.moreActionsButton) {
                    attachCxtMenuTo(headElementComponent.moreActionsButton, headElementComponent.cxtMenuCommands);
                }
            };
        });
    }
    /**
     * Register callback to execute on delete of a HeadElement
     * @param callback callback receiving the ID of the HeadElement to delete
     */
    onDelete(callback) {
        this.deleteElementCallback = callback;
    }
    /**
     * Register callback to execute on rename of a HeadElement (Set alias)
     * @param callback callback receiving the ID of the headElement to rename
     */
    onRename(callback) {
        this.renameElementCallback = callback;
    }
    /**
     * Register callback to execute on localization of a HeadElement
     * @param callback callback receiving the ID of the HeadElement to localize
     */
    onLocalize(callback) {
        this.localizeElementCallback = callback;
    }
    onAddFilter(callback) {
        this.addFilterCallback = callback;
    }
    onEditFilter(callback) {
        this.editFilterCallback = callback;
    }
    onDeleteFilter(callback) {
        this.deleteFilterCallback = callback;
    }
    onAddFunction(callback) {
        this.addFunctionCallback = callback;
    }
    onOrderByChange(callback) {
        this.orderByChangeCallback = callback;
    }
    onAddAggregation(callback) {
        this.addAggregationCallback = callback;
    }
    blur() {
        var _a;
        // do not call super.blur() cause it will collapse query-head body.
        // This because each click on cytoscape background calls document.activeElement.blur(), 
        // so if any input field has focus, query-head will be the activeElement and will be
        // blurred at each tap. this way we only blur the input elements.
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('head-element').forEach(headElementComponent => {
            var _a;
            (_a = headElementComponent.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('input').forEach(inputElement => inputElement.blur());
        });
    }
    firstUpdated() {
        this.hide();
    }
}
QueryHeadWidget.properties = {
    headElements: { type: Object, attribute: false }
};
QueryHeadWidget.styles = [
    ui.baseStyle,
    sparqlingWidgetStyle,
    r$2 `
      :host {
        position:initial;
        min-height: 30%;
        margin-bottom: 10px;
        background: transparent;
        box-shadow: none;
        pointer-events:initial;
      }

      #elems-wrapper {
        display: flex;
        height:inherit;
        flex-direction: column;
        overflow: hidden scroll;
        scrollbar-width: inherit;
        padding: 4px 8px;
      }

      .blank-slate {
        max-width: unset;
      }

      .tip {
        font-size: 90%;
        border-bottom: dotted 2px;
        cursor: help;
      }

      .tip: hover {
        color:inherit;
      }

      .top-bar.traslated-down {
        bottom: 10px;
      }
    `
];
customElements.define('query-head', QueryHeadWidget);

const qhWidget = new QueryHeadWidget();
function onDelete(callback) {
    qhWidget.onDelete(headElementId => {
        const headElement = getHeadElementByID(headElementId);
        if (headElement)
            callback(headElement);
    });
}
function onRename(callback) {
    qhWidget.onRename((headElementId, alias) => {
        callback(headElementId, alias);
    });
}
function onLocalize(callback) {
    qhWidget.onLocalize(headElementId => {
        const headElement = getHeadElementByID(headElementId);
        if (headElement)
            callback(headElement);
    });
}
function render(newHead) {
    if (!newHead)
        return;
    qhWidget.headElements = newHead;
}
function onAddFilter(callback) {
    qhWidget.onAddFilter((headElementId) => {
        callback(headElementId);
    });
}
function onEditFilter(callback) {
    qhWidget.onEditFilter(filterId => callback(filterId));
}
function onDeleteFilter(callback) {
    qhWidget.onDeleteFilter(filterId => callback(filterId));
}
function onAddFunction(callback) {
    qhWidget.onAddFunction(headElementId => callback(headElementId));
}
function onOrderByChange(callback) {
    qhWidget.onOrderByChange(headElementId => callback(headElementId));
}
function onAddAggregation(callback) {
    qhWidget.onAddAggregation(headElementId => callback(headElementId));
}

function getHeadElementWithDatatype(headElement) {
    const headElementCopy = JSON.parse(JSON.stringify(headElement));
    if (headElementCopy.graphElementId) {
        let relatedGraphElem = getGraphElementByID(headElementCopy.graphElementId);
        if (relatedGraphElem) {
            const relatedGraphElemIri = getIri(relatedGraphElem);
            if (relatedGraphElemIri) {
                const grapholEntity = getGscape().ontology.getEntity(relatedGraphElemIri);
                headElementCopy['entityType'] = getEntityType(relatedGraphElem);
                headElementCopy['dataType'] = headElementCopy['entityType'] === EntityTypeEnum.DataProperty
                    ? grapholEntity.datatype
                    : null;
                return headElementCopy;
            }
        }
    }
    return headElementCopy;
}

function onNewBody(newBody) {
    var _a;
    // empty query
    if (!newBody.graph) {
        setActiveElement(undefined);
        getOriginGrapholNodes().clear();
        resetHighlights();
        getGscape().unselect();
        distinctToggle.checked = true;
        countStarToggle$1.checked = false;
        limitInput$1.value = '';
        offsetInput.value = '';
    }
    startRunButtons.canQueryRun = newBody.graph && !isStandalone() && core.onQueryRun !== undefined;
    let body = setQueryBody(newBody);
    widget.isBGPEmpty = body.graph === null || body.graph === undefined;
    render$1(body.graph);
    const deletedNodeIds = removeNodesNotInQuery();
    deletedNodeIds.forEach(id => getOriginGrapholNodes().delete(id));
    renderOptionals(body.optionals);
    render((_a = body.head) === null || _a === void 0 ? void 0 : _a.map((headElem) => getHeadElementWithDatatype(headElem)));
    filterListDialog.filterList = getFiltersOnVariable(filterListDialog.variable);
    sparqlDialog.text = (body === null || body === void 0 ? void 0 : body.sparql) ? body.sparql : emptyQueryMsg();
    distinctToggle.disabled =
        countStarToggle$1.disabled =
            limitInput$1.disabled =
                offsetInput.disabled =
                    (newBody === null || newBody === void 0 ? void 0 : newBody.graph) ? false : true;
    if (!distinctToggle.disabled)
        distinctToggle.classList.add('actionable');
    if (!countStarToggle$1.disabled)
        countStarToggle$1.classList.add('actionable');
}

function handleDistinctChange() {
    if (!isCountStarActive()) {
        setMainDistinct(!distinctToggle.checked);
    }
    else {
        const qExtraApi = new QueryGraphExtraApi(undefined, getBasePath());
        handlePromise(qExtraApi.countStarQueryGraph(!distinctToggle.checked, getQueryBody(), getRequestOptions())).then(newBody => onNewBody(newBody));
    }
}
function setMainDistinct(value) {
    const qExtraApi = new QueryGraphExtraApi(undefined, getBasePath());
    handlePromise(qExtraApi.distinctQueryGraph(value, getQueryBody(), getRequestOptions())).then(newBody => {
        onNewBody(newBody);
    });
}
function handleCountStarChange() {
    const queryBody = getQueryBody();
    const qExtraApi = new QueryGraphExtraApi(undefined, getBasePath());
    const distinct = !distinctToggle.checked;
    if (isCountStarActive()) {
        // remove headElement associated to count star
        const qHeadApi = new QueryGraphHeadApi(undefined, getBasePath());
        const countStarHeadElement = queryBody.head[0];
        if (countStarHeadElement === null || countStarHeadElement === void 0 ? void 0 : countStarHeadElement.id) {
            handlePromise(qHeadApi.deleteHeadTerm(countStarHeadElement.id, queryBody, getRequestOptions())).then(newBody => {
                onNewBody(newBody);
                setMainDistinct(distinct);
            });
        }
    }
    else {
        // add count star
        handlePromise(qExtraApi.countStarQueryGraph(distinct, queryBody, getRequestOptions())).then(newBody => {
            onNewBody(newBody);
            setMainDistinct(false);
        });
    }
}
function handleOffsetChange(evt) {
    const queryBody = getQueryBody();
    if (!(queryBody === null || queryBody === void 0 ? void 0 : queryBody.graph))
        return;
    const input = evt.currentTarget;
    if (input) {
        let value = input.valueAsNumber;
        const qExtraApi = new QueryGraphExtraApi(undefined, getBasePath());
        if (validateInputElement(input) && value !== queryBody.offset) {
            // if NaN but valid, then th field is empty, pass -1 to remove the offset
            if (isNaN(value)) {
                value = -1;
                if (value === queryBody.offset || !queryBody.offset) {
                    //if offset is not set, no need to remove it, return
                    return;
                }
            }
            handlePromise(qExtraApi.offsetQueryGraph(value, queryBody, getRequestOptions())).then(newBody => {
                onNewBody(newBody);
            });
        }
        else {
            input.value = queryBody.offset && queryBody.offset > 0
                ? queryBody.offset.toString()
                : '';
        }
    }
}
function handleLimitChange(evt) {
    const queryBody = getQueryBody();
    if (!(queryBody === null || queryBody === void 0 ? void 0 : queryBody.graph))
        return;
    const input = evt.currentTarget;
    if (input) {
        let value = input.valueAsNumber;
        const qExtraApi = new QueryGraphExtraApi(undefined, getBasePath());
        if (validateInputElement(input) && value !== queryBody.limit) {
            // if NaN but valid, then th field is empty, pass -1 to remove the limit
            if (isNaN(value)) {
                value = -1;
                if (value === queryBody.limit || !queryBody.limit) {
                    //if limit is not set, no need to remove it, return
                    return;
                }
            }
            handlePromise(qExtraApi.limitQueryGraph(value, queryBody, getRequestOptions())).then(newBody => {
                onNewBody(newBody);
            });
        }
        else {
            input.value = queryBody.limit && queryBody.limit > 0 ? queryBody.limit.toString() : '';
        }
    }
}

const limitInput = document.createElement('input');
limitInput.placeholder = 'Num. of results';
limitInput.type = 'number';
limitInput.id = 'limit-input';
limitInput.min = '1';
limitInput.disabled = true;
limitInput.onchange = handleLimitChange;
limitInput.addEventListener('focusout', handleLimitChange);
limitInput.onsubmit = handleLimitChange;
var limitInput$1 = limitInput;

const countStarToggle = new ui.GscapeToggle();
countStarToggle.label = 'Count Results';
countStarToggle.labelPosition = ui.GscapeToggle.ToggleLabelPosition.LEFT;
countStarToggle.classList.add('actionable');
countStarToggle.disabled = true;
countStarToggle.onclick = (evt) => {
    evt.preventDefault();
    if (!countStarToggle.disabled) {
        countStarToggle.checked = !countStarToggle.checked;
        handleCountStarChange();
    }
};
var countStarToggle$1 = countStarToggle;

class ContextMenuWidget extends ui.BaseMixin(s) {
    constructor() {
        super(...arguments);
        this.commands = [];
        this.onCommandRun = () => { };
    }
    render() {
        return $ `
    <div class="gscape-panel">
      ${this.commands.map((command, id) => {
            return $ `
          <div class="command-entry actionable" command-id="${id}" @click=${this.handleCommandClick}>
            <span class="command-icon">${command.icon}</span>
            <span class="command-text">${command.content}</span>
          <div>
        `;
        })}
    </div>
    `;
    }
    handleCommandClick(e) {
        this.commands[e.currentTarget.getAttribute('command-id')].select();
        this.onCommandRun();
    }
}
ContextMenuWidget.properties = {
    commands: { attribute: false }
};
ContextMenuWidget.styles = [
    ui.baseStyle,
    r$2 `
      :host {
        position: initial;
        display: flex;
        flex-direction: column;
        padding: 5px 0;
      }

      .command-entry {
        white-space: nowrap;
        cursor: pointer;
        padding: 5px 10px;
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .command-icon {
        width: 19px;
        height: 19px;
      }

      .command-text {
        position: relative;
        top: 2px;
      }

      .gscape-panel {
        overflow: unset;
      }
    `
];
customElements.define('query-graph-cxt-menu', ContextMenuWidget);

const cxtMenuWidget = new ContextMenuWidget();
const cxtMenu = tippy(document.createElement('div'));
function getCxtMenuProps() {
    return {
        trigger: 'manual',
        allowHTML: true,
        interactive: true,
        placement: "bottom",
        appendTo: document.querySelector('.gscape-ui') || undefined,
        // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
        content: cxtMenuWidget,
        hideOnClick: true,
        offset: [0, 0],
    };
}
function attachCxtMenuTo(element, commands) {
    cxtMenu.setProps(getCxtMenuProps());
    cxtMenu.setProps({ getReferenceClientRect: () => element.getBoundingClientRect() });
    cxtMenuWidget.commands = commands;
    cxtMenu.show();
}
cxtMenuWidget.onCommandRun = () => cxtMenu.hide();

const sparqlDialog = new SparqlDialog();
const relatedClassDialog = new RelatedClassSelection();
const highlightsList = new HighlightsList();
const filterDialog = new FilterDialog();
const filterListDialog = new FilterListDialog();
const functionDialog = new FunctionDialog();
const aggregationDialog = new AggregationDialog();
const startRunButtons = new SparqlingStartRunButtons();
const errorsDialog = new ErrorsDialog();

let lastObjProperty;
function handleEntitySelection(entityIriString, entityType, entityOccurrence) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const gscape = getGscape();
        const entityIri = new Iri(entityIriString, gscape.ontology.namespaces);
        const activeElement = getActiveElement();
        if (activeElement && graphElementHasIri(activeElement.graphElement, entityIriString) && !lastObjProperty) {
            if (!isIriSelected(entityIri)) {
                resetHighlights();
                highlightSuggestions(entityIriString);
            }
            return;
        }
        switch (entityType) {
            case GrapholTypesEnum.OBJECT_PROPERTY: {
                // let result = await handleObjectPropertySelection(cyEntity)
                // if (result && result.connectedClass) {
                //   gscape.centerOnNode(result.connectedClass.id(), 1.8)
                // }
                break;
            }
            case GrapholTypesEnum.CLASS: {
                (_a = handleConceptSelection(entityIriString)) === null || _a === void 0 ? void 0 : _a.then(newBody => {
                    var _a;
                    if (!newBody)
                        return;
                    // Get nodes not present in the old graph
                    const newGraphElements = getdiffNew((_a = getQueryBody()) === null || _a === void 0 ? void 0 : _a.graph, newBody.graph);
                    const newSelectedGraphElement = setOriginNode(entityOccurrence, newGraphElements, entityIriString);
                    resetHighlights();
                    highlightSuggestions(entityIriString);
                    onNewBody(newBody);
                    // after onNewBody because we need to select the element after rendering phase
                    if (newSelectedGraphElement && newSelectedGraphElement.id) {
                        // The node to select is the one having the clickedIri among the new nodes
                        selectElement(newSelectedGraphElement.id);
                        setActiveElement({
                            graphElement: newSelectedGraphElement,
                            iri: entityIri,
                        });
                    }
                });
                break;
            }
            case GrapholTypesEnum.DATA_PROPERTY: {
                (_b = handleDataPropertySelection(entityIriString)) === null || _b === void 0 ? void 0 : _b.then(newBody => {
                    var _a;
                    if (!newBody)
                        return;
                    const newGraphElements = getdiffNew((_a = getQueryBody()) === null || _a === void 0 ? void 0 : _a.graph, newBody.graph);
                    setOriginNode(entityOccurrence, newGraphElements, entityIriString);
                    onNewBody(newBody);
                });
                break;
            }
        }
        gscape.unselect();
    });
}
onRelatedClassSelection(handleObjectPropertySelection);
function handleObjectPropertySelection(branch, relatedClassEntityOccurrence) {
    var _a, _b;
    const gscape = getGscape();
    lastObjProperty = branch;
    gscape.centerOnElement(relatedClassEntityOccurrence.elementId, relatedClassEntityOccurrence.diagramId);
    const relatedClassCyElement = (_b = (_a = gscape.ontology
        .getDiagram(relatedClassEntityOccurrence.diagramId)) === null || _a === void 0 ? void 0 : _a.representations.get(gscape.renderState)) === null || _b === void 0 ? void 0 : _b.cy.$id(relatedClassEntityOccurrence.elementId);
    if (relatedClassCyElement)
        handleEntitySelection(relatedClassCyElement.data().iri, relatedClassCyElement.data().type, relatedClassEntityOccurrence);
}
function handleConceptSelection(cyEntity) {
    return __awaiter(this, void 0, void 0, function* () {
        const qgBGPApi = new QueryGraphBGPApi(undefined, getBasePath());
        const clickedIRI = typeof cyEntity === 'string' ? cyEntity : cyEntity.data().iri;
        let newQueryGraph = new Promise((resolve) => { resolve(null); });
        let actualBody = getQueryBody();
        /**
         * if it's not the first click,
         * the class is not highlighted,
         * it's not connected to a objectProperty
         * and it's not already in the queryGraph, then skip this click
         */
        if ((actualBody === null || actualBody === void 0 ? void 0 : actualBody.graph) && !isIriHighlighted(clickedIRI) && !lastObjProperty && !isIriInQueryGraph(clickedIRI)) {
            //cyEntity.unselect()
            console.log('selection ignored for class ' + clickedIRI);
            return newQueryGraph; // empty promise
        }
        let activeElement = getActiveElement();
        if (lastObjProperty && lastObjProperty.objectPropertyIRI && (activeElement === null || activeElement === void 0 ? void 0 : activeElement.graphElement.id)) {
            // this comes after a selection of a object property
            newQueryGraph = handlePromise(qgBGPApi.putQueryGraphObjectProperty(activeElement.graphElement.id, "", lastObjProperty.objectPropertyIRI, clickedIRI, lastObjProperty.direct || false, actualBody, getRequestOptions()));
        }
        else if ((actualBody === null || actualBody === void 0 ? void 0 : actualBody.graph) && isIriHighlighted(clickedIRI) && (activeElement === null || activeElement === void 0 ? void 0 : activeElement.graphElement.id)) {
            newQueryGraph = handlePromise(qgBGPApi.putQueryGraphClass(activeElement.graphElement.id, '', clickedIRI, actualBody, getRequestOptions()));
        }
        else if (!(actualBody === null || actualBody === void 0 ? void 0 : actualBody.graph)) {
            // initial selection
            newQueryGraph = handlePromise(qgBGPApi.getQueryGraph(clickedIRI, getRequestOptions()));
        }
        lastObjProperty = null;
        return newQueryGraph;
    });
}
function handleDataPropertySelection(cyEntity) {
    return __awaiter(this, void 0, void 0, function* () {
        const clickedIRI = typeof cyEntity === 'string' ? cyEntity : cyEntity.data().iri;
        let newQueryGraph = new Promise((resolve) => { resolve(null); });
        if (!isIriHighlighted(clickedIRI)) {
            // cyEntity.unselect()
            return newQueryGraph; // empty promise
        }
        const actualBody = getQueryBody();
        const activeElement = getActiveElement();
        if (!(activeElement === null || activeElement === void 0 ? void 0 : activeElement.graphElement.id)) {
            return newQueryGraph; // empty promise
        }
        if (isClass(activeElement.graphElement)) {
            const qgBGPApi = new QueryGraphBGPApi(undefined, getBasePath());
            newQueryGraph = handlePromise(qgBGPApi.putQueryGraphDataProperty(activeElement.graphElement.id, '', clickedIRI, actualBody, getRequestOptions()));
        }
        lastObjProperty = null;
        return newQueryGraph;
    });
}
/**
 * Find the GraphElement corresponding to the clicked entity and set entity as its origin Graphol node
 * @param entityOccurrence The clicked entity occurrence
 * @param graphElements Array of newly added graphElements
 * @returns The GraphElement corresponding to the clicked entity
 */
function setOriginNode(entityOccurrence, graphElements, clickedIri) {
    let graphElement = graphElements === null || graphElements === void 0 ? void 0 : graphElements.find(ge => graphElementHasIri(ge, clickedIri));
    if (graphElement) {
        getOriginGrapholNodes().set(graphElement.id + clickedIri, entityOccurrence);
    }
    return graphElement;
}
function isIriHighlighted(iri) { return isHighlighted(iri); }
function isIriInQueryGraph(iri) { return isIriInQueryGraph$1(iri); }

var sparqlingStyle = (theme) => [
    {
        selector: 'node[shape = "ellipse"], .bubble',
        style: { 'underlay-shape': 'ellipse' }
    },
    {
        selector: '.sparqling-selected',
        style: {
            'underlay-color': theme.getColour(ColoursNames.accent),
            'underlay-padding': '4px',
            'underlay-opacity': 1,
        }
    },
    {
        selector: '.highlighted',
        style: {
            'underlay-color': theme.colours["sparqling-highlight"] || theme.getColour(ColoursNames.success_muted),
            'underlay-padding': '8px',
            'underlay-opacity': 1,
            'border-opacity': 1,
        }
    },
    {
        selector: '.faded',
        style: {
            'opacity': 0.25,
        }
    }
];

function showUI() {
    widget.show();
    qhWidget.show();
    highlightsList.show();
}
function hideUI() {
    widget.hide();
    qhWidget.hide();
    highlightsList.hide();
    sparqlDialog.hide();
    relatedClassDialog.hide();
    cxtMenu.hide();
    filterDialog.hide();
    filterListDialog.hide();
    errorsDialog.hide();
}

function start () {
    if (isStandalone()) {
        const standaloneApi = new StandaloneApi();
        const ontologyFile = getOntologyFile();
        // If current ontology is already loaded, do not perform upload again
        ontologyFile.text().then(ontologyString => {
            handlePromise(standaloneApi.standaloneOntologyGrapholGet()).then(grapholFile => {
                if (ontologyString.trim() === grapholFile.trim()) {
                    startSparqling();
                }
                else {
                    handlePromise(standaloneApi.standaloneOntologyUploadPost(getOntologyFile())).then(_ => startSparqling());
                }
            });
        });
    }
    else {
        startSparqling();
    }
    function startSparqling() {
        var _a, _b;
        init();
        getGscape().widgets.get(ui.WidgetEnum.OWL_VISUALIZER).disable();
        showUI();
        setSparqlingRunning(true);
        startRunButtons.canQueryRun = ((_a = getQueryBody()) === null || _a === void 0 ? void 0 : _a.graph) && !isStandalone() && core.onQueryRun !== undefined;
        startRunButtons.requestUpdate();
        const selectedGraphElement = (_b = getActiveElement()) === null || _b === void 0 ? void 0 : _b.graphElement;
        if (selectedGraphElement) {
            const selectedGraphElementIri = getIri(selectedGraphElement);
            if (selectedGraphElementIri)
                highlightSuggestions(selectedGraphElementIri);
        }
        core.onStart();
    }
}
function init() {
    if (isSparqlingInitialised())
        return;
    const gscape = getGscape();
    addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme));
    if (gscape.renderer.cy)
        setHandlers(gscape.renderer.cy);
    gscape.on(LifecycleEvent.LanguageChange, (newLanguage) => setLanguage(newLanguage));
    gscape.on(LifecycleEvent.EntityNameTypeChange, (newNameType) => {
        setDisplayedNameType(newNameType, gscape.language);
    });
    gscape.on(LifecycleEvent.ThemeChange, (newTheme) => {
        setTheme(newTheme);
        addStylesheet(gscape.renderer.cy, sparqlingStyle(newTheme));
    });
    gscape.on(LifecycleEvent.DiagramChange, () => onChangeDiagramOrRenderer(gscape));
    gscape.on(LifecycleEvent.RendererChange, () => onChangeDiagramOrRenderer(gscape));
    setInitialised(true);
}
function onChangeDiagramOrRenderer(gscape) {
    if (gscape.renderer.cy) {
        setHandlers(gscape.renderer.cy);
        addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme));
    }
    refreshHighlights();
}
function setHandlers(cy) {
    // [diplayed_name] select only nodes with a defined displayed name, 
    // avoid fake nodes (for inverse/nonInverse functional obj properties)
    const objPropertiesSelector = `[iri][type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`;
    cy.on('mouseover', objPropertiesSelector, e => {
        if (isSparqlingRunning())
            showRelatedClassesWidget(e.target.data('iri'), e.renderedPosition);
    });
    cy.on('mouseout', objPropertiesSelector, e => {
        if (isSparqlingRunning())
            hideRelatedClassesWidget();
    });
    cy.on('dblclick', `[iri]`, e => {
        if (isSparqlingRunning())
            handleEntitySelection(e.target.data().iri, e.target.data().type, { elementId: e.target.id(), diagramId: getGscape().diagramId });
    });
}

function stop () {
    if (isSparqlingRunning()) {
        hideUI();
        clearSelected();
        resetHighlights();
        getGscape().widgets.get(ui.WidgetEnum.ENTITY_DETAILS).hide();
        setSparqlingRunning(false);
        startRunButtons.canQueryRun = false;
        startRunButtons.requestUpdate();
        core.onStop();
    }
}

var core = {
    getQueryBody: getQueryBody,
    startStopButton: startRunButtons.startSparqlingButton,
    runQueryButton: startRunButtons.runQueryButton,
    onQueryRun: undefined,
    onStop: () => { },
    onStart: () => { },
    start: start,
    stop: stop,
};

function clearQuery () {
    var _a, _b;
    const queryBody = getQueryBody();
    if ((_a = queryBody === null || queryBody === void 0 ? void 0 : queryBody.graph) === null || _a === void 0 ? void 0 : _a.id) {
        const qgApi = QueryGraphBGPApiFactory(undefined, getBasePath());
        handlePromise(qgApi.deleteGraphElementId((_b = queryBody === null || queryBody === void 0 ? void 0 : queryBody.graph) === null || _b === void 0 ? void 0 : _b.id, queryBody, getRequestOptions())).then(newBody => {
            onNewBody(newBody);
        });
    }
}

function showFormDialog (element, formDialog) {
    let graphElement;
    let variableName;
    if (isHeadElement(element) && element.graphElementId) {
        graphElement = getGraphElementByID(element.graphElementId);
        variableName = element.alias;
    }
    else if (isGraphElement(element)) {
        graphElement = element;
    }
    if (!graphElement)
        return;
    const graphElementIri = getIri(graphElement);
    if (!graphElementIri)
        return;
    if (isClass(graphElement)) {
        formDialog.parametersType = VarOrConstantTypeEnum.Iri;
    }
    else {
        formDialog.parametersType = VarOrConstantTypeEnum.Constant;
    }
    formDialog.modality = Modality.DEFINE;
    if (formDialog instanceof FilterDialog) {
        formDialog._id = undefined; // filterDialog's id is filter id, a filter has an ID only after adding it
    }
    else {
        formDialog._id = element.id;
    }
    formDialog.operator = undefined;
    formDialog.parameters = [{
            type: VarOrConstantTypeEnum.Var,
            constantType: getGscape().ontology.getEntity(graphElementIri).datatype,
            value: graphElement.id
        }];
    formDialog.variableName = variableName || graphElement.id;
    formDialog.show();
}
function isHeadElement(element) {
    if (element.graphElementId)
        return true;
    else
        return false;
}
function isGraphElement(element) {
    if (element.entities)
        return true;
    else
        return false;
}

onAddHead((graphElement) => __awaiter(void 0, void 0, void 0, function* () {
    if (graphElement === null || graphElement === void 0 ? void 0 : graphElement.id) {
        const qgApi = QueryGraphHeadApiFactory(undefined, getBasePath());
        const body = getQueryBody();
        handlePromise(qgApi.addHeadTerm(graphElement.id, body, getRequestOptions())).then(newBody => {
            onNewBody(newBody);
        });
    }
}));
onDelete$1((graphElement, iri) => {
    var _a;
    if (!graphElement.id) {
        return;
    }
    const qgApi = QueryGraphBGPApiFactory(undefined, getBasePath());
    const body = getQueryBody();
    const selectedGraphElement = (_a = getActiveElement()) === null || _a === void 0 ? void 0 : _a.graphElement;
    const gscape = getGscape();
    if (!iri) {
        handlePromise(qgApi.deleteGraphElementId(graphElement.id, body, getRequestOptions())).then(newBody => {
            if (newBody.graph && !findGraphElement(newBody.graph, ge => ge.id === (selectedGraphElement === null || selectedGraphElement === void 0 ? void 0 : selectedGraphElement.id))) {
                // if we deleted selectedGraphElem, then select its parent
                let newSelectedGE = findGraphElement(body.graph, ge => {
                    var _a;
                    return ((_a = ge.children) === null || _a === void 0 ? void 0 : _a.some(c => {
                        var _a;
                        if ((_a = c.children) === null || _a === void 0 ? void 0 : _a.find(c2 => c2.id === graphElement.id))
                            return true;
                    })) || false;
                });
                let newSelectedGEIri;
                if (newSelectedGE) {
                    newSelectedGEIri = getIri(newSelectedGE);
                    if (newSelectedGEIri) {
                        setActiveElement({
                            graphElement: newSelectedGE,
                            iri: new Iri(newSelectedGEIri, gscape.ontology.namespaces)
                        });
                    }
                }
                resetHighlights();
                gscape.unselect();
                if (newSelectedGEIri) {
                    gscape.centerOnEntity(newSelectedGEIri);
                    highlightSuggestions(newSelectedGEIri);
                }
                if (newSelectedGE === null || newSelectedGE === void 0 ? void 0 : newSelectedGE.id) {
                    selectElement(newSelectedGE.id); // force selecting a new class
                }
            }
            finalizeDelete(newBody);
        });
    }
    else { // deleted a children
        handlePromise(qgApi.deleteGraphElementIdClass(graphElement.id, iri, body, getRequestOptions())).then(newBody => {
            finalizeDelete(newBody);
        });
    }
    function finalizeDelete(newBody) {
        if (graphElement.id) {
            getOriginGrapholNodes().delete(graphElement.id);
            onNewBody(newBody);
        }
    }
});
onJoin((ge1, ge2) => __awaiter(void 0, void 0, void 0, function* () {
    if (ge1.id && ge2.id) {
        const qgApi = QueryGraphBGPApiFactory(undefined, getBasePath());
        const body = getQueryBody();
        handlePromise(qgApi.putQueryGraphJoin(ge1.id, ge2.id, body, getRequestOptions())).then(newBody => {
            const ge1Iri = getIri(ge1);
            if (ge1Iri) {
                setActiveElement({
                    graphElement: ge1,
                    iri: new Iri(ge1Iri, getGscape().ontology.namespaces)
                });
                onNewBody(newBody);
            }
        });
    }
}));
onElementClick((graphElement, iri) => {
    var _a;
    const gscape = getGscape();
    // move ontology graph to show origin graphol node or any other iri occurrence
    const originGrapholNodeOccurrence = getOriginGrapholNodes().get(graphElement.id + iri);
    if (originGrapholNodeOccurrence) {
        gscape.centerOnElement(originGrapholNodeOccurrence.elementId, originGrapholNodeOccurrence.diagramId);
    }
    else {
        gscape.centerOnEntity(iri);
    }
    if (isClass(graphElement)) {
        // if the new graphElement is different from the current selected one the select it
        if (((_a = getActiveElement()) === null || _a === void 0 ? void 0 : _a.graphElement) !== graphElement) {
            setActiveElement({
                graphElement: graphElement,
                iri: new Iri(iri, gscape.ontology.namespaces)
            });
            // Highlight suggestions for the actual clicked iri (might be a child node)
            highlightSuggestions(iri);
        }
    }
    const entityDetailsWidget = gscape.widgets.get(ui.WidgetEnum.ENTITY_DETAILS);
    if (entityDetailsWidget)
        entityDetailsWidget.grapholEntity = gscape.ontology.getEntity(iri);
    // keep focus on selected class
    const activeElement = getActiveElement();
    if (activeElement === null || activeElement === void 0 ? void 0 : activeElement.graphElement.id)
        selectElement(activeElement.graphElement.id);
});
onMakeOptional(graphElement => {
    if (graphElement.id) {
        const qgOptionalApi = QueryGraphOptionalApiFactory(undefined, getBasePath());
        const body = getQueryBody();
        handlePromise(qgOptionalApi.newOptionalGraphElementId(graphElement.id, body, getRequestOptions())).then(newBody => {
            onNewBody(newBody);
        });
    }
});
onRemoveOptional(graphElement => {
    if (graphElement.id) {
        const qgOptionalApi = QueryGraphOptionalApiFactory(undefined, getBasePath());
        const body = getQueryBody();
        handlePromise(qgOptionalApi.removeOptionalGraphElementId(graphElement.id, body, getRequestOptions())).then(newBody => {
            onNewBody(newBody);
        });
    }
});
onAddFilter$1(graphElement => {
    showFormDialog(graphElement, filterDialog);
});
onSeeFilters(graphElement => {
    if (graphElement.id && qhWidget.shadowRoot) {
        for (const headElementComponent of qhWidget.shadowRoot.querySelectorAll('head-element')) {
            const headElemC = headElementComponent;
            if (headElemC.graphElementId === graphElement.id) {
                headElemC.focus();
                headElemC.openPanel();
                headElemC.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        // if not in query head, show dialog
        const filtersOnVariable = getFiltersOnVariable(graphElement.id);
        if (filtersOnVariable)
            filterListDialog.filterList = filtersOnVariable;
        filterListDialog.variable = graphElement.id;
        filterListDialog.show();
    }
});
widget.onSparqlButtonClick = () => sparqlDialog.isVisible ? sparqlDialog.hide() : sparqlDialog.show();
widget.onQueryClear = () => { clearQuery(); };

filterListDialog.onEdit((filterId) => showFilterDialogEditingMode(filterId));
filterListDialog.onDelete((filterId) => { deleteFilter(filterId); });
filterDialog.onSubmit((id, op, params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterApi = new QueryGraphFilterApi(undefined, getBasePath());
    const newFilter = {
        expression: {
            operator: op,
            parameters: params
        }
    };
    // Perform edits on a dummy query body in order to preserve the actual working one
    // The new data will be saved on service correct response
    const tempQueryBody = getTempQueryBody();
    if (id === undefined || id === null) {
        // add filter
        if (!tempQueryBody.filters) {
            tempQueryBody.filters = [];
        }
        id = tempQueryBody.filters.push(newFilter) - 1;
        handlePromise(filterApi.newFilter(id, tempQueryBody, getRequestOptions())).then(newBody => {
            filterDialog._id = id;
            filterDialog.modality = Modality.EDIT;
            finalizeFilterSubmit(newBody);
        });
    }
    else {
        id = id;
        // update filter
        if (tempQueryBody.filters) {
            tempQueryBody.filters[id] = newFilter;
            handlePromise(filterApi.editFilter(id, tempQueryBody, getRequestOptions())).then(newBody => {
                finalizeFilterSubmit(newBody);
            });
        }
    }
    function finalizeFilterSubmit(newBody) {
        onNewBody(newBody);
        filterDialog.setAsCorrect();
    }
}));
filterDialog.onDelete((filterId) => deleteFilter(filterId));
function deleteFilter(filterId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (filterId === null || filterId === undefined)
            return;
        const filterApi = new QueryGraphFilterApi(undefined, getBasePath());
        handlePromise(filterApi.removeFilter(filterId, getQueryBody(), getRequestOptions())).then(newBody => {
            var _a;
            onNewBody(newBody);
            filterDialog._id = undefined;
            filterDialog.operator = undefined;
            (_a = filterDialog.parameters) === null || _a === void 0 ? void 0 : _a.splice(1);
            filterDialog.modality = Modality.DEFINE;
            filterDialog.setAsCorrect('Deleted correctly');
        });
    });
}
function showFilterDialogEditingMode(filterId) {
    var _a, _b, _c;
    const filter = getFilterById(filterId);
    if (filter) {
        filterDialog.modality = Modality.EDIT;
        filterDialog._id = filterId;
        filterDialog.operator = (_a = filter.expression) === null || _a === void 0 ? void 0 : _a.operator;
        filterDialog.parameters = (_b = filter.expression) === null || _b === void 0 ? void 0 : _b.parameters;
        filterDialog.parametersType = ((_c = filter.expression) === null || _c === void 0 ? void 0 : _c.parameters) ? filter.expression.parameters[1].type : undefined;
        filterDialog.show();
        filterListDialog.hide();
    }
}

onDelete((headElement) => __awaiter(void 0, void 0, void 0, function* () {
    const qgApi = QueryGraphHeadApiFactory(undefined, getBasePath());
    const body = getQueryBody();
    if (headElement.id) {
        handlePromise(qgApi.deleteHeadTerm(headElement.id, body, getRequestOptions())).then(newBody => {
            onNewBody(newBody);
        });
    }
}));
onRename((headElementId, alias) => __awaiter(void 0, void 0, void 0, function* () {
    const qgApi = QueryGraphHeadApiFactory(undefined, getBasePath());
    const tempQueryBody = getTempQueryBody();
    const headElement = getHeadElementByID(headElementId, tempQueryBody);
    if (headElement === null || headElement === void 0 ? void 0 : headElement.id) {
        headElement.alias = alias;
        handlePromise(qgApi.renameHeadTerm(headElement.id, tempQueryBody, getRequestOptions())).then(newBody => {
            onNewBody(newBody);
        });
    }
}));
onLocalize(headElement => {
    if (headElement.graphElementId) {
        let graphElement = getGraphElementByID(headElement.graphElementId);
        if (graphElement) {
            const geIri = getIri(graphElement);
            if (geIri) {
                centerOnElem(graphElement);
                getGscape().centerOnEntity(geIri);
            }
        }
    }
});
onAddFilter(headElementId => {
    const headElement = getHeadElementByID(headElementId);
    if (headElement)
        showFormDialog(headElement, filterDialog);
});
onEditFilter((filterId) => {
    showFilterDialogEditingMode(filterId);
});
onDeleteFilter((filterId) => {
    deleteFilter(filterId);
});
onAddFunction(headElementId => {
    const headElement = getHeadElementByID(headElementId);
    if (headElement)
        showFormDialog(headElement, functionDialog);
});
onElementSortChange((headElementId, newIndex) => {
    const headElement = getHeadElementByID(headElementId);
    if (!headElement)
        return;
    const qhApi = QueryGraphHeadApiFactory(undefined, getBasePath());
    const tempQueryBody = getTempQueryBody();
    const tempHead = tempQueryBody.head;
    const replacedHeadElement = tempHead[newIndex]; // get the element to be "replaced", its index will change
    const tempHeadIds = tempHead.map(he => he.id); // use array of id to find index of elements
    tempHead.splice(tempHeadIds.indexOf(headElementId), 1); // remove headElement from its position
    tempHead.splice(tempHeadIds.indexOf(replacedHeadElement.id), 0, headElement); // put headElement in place of the element to replace
    handlePromise(qhApi.reorderHeadTerms(tempQueryBody, getRequestOptions())).then(newBody => onNewBody(newBody));
});
onOrderByChange(headElementId => {
    const tempQueryBody = getTempQueryBody();
    const headElement = tempQueryBody.head.find(he => he.id === headElementId);
    if (headElement) {
        headElement.ordering = (headElement.ordering || 0) + 1;
        if (headElement.ordering >= 2) {
            headElement.ordering = -1;
        }
    }
    // if (headElement.ordering === 0) {
    //   headElement.ordering = null
    // }
    const qhApi = QueryGraphHeadApiFactory(undefined, getBasePath());
    handlePromise(qhApi.orderByHeadTerm(headElementId, tempQueryBody, getRequestOptions())).then(newBody => {
        onNewBody(newBody);
    });
});
onAddAggregation(headElementId => {
    const headElement = getHeadElementByID(headElementId);
    if (headElement) {
        showFormDialog(headElement, aggregationDialog);
        aggregationDialog.aggregateOperator = undefined;
        aggregationDialog.definingHaving = false;
        aggregationDialog.distinct = false;
        if (aggregationDialog.distinctCheckboxElem)
            aggregationDialog.distinctCheckboxElem.checked = false;
    }
});

startRunButtons.onSparqlingStart(() => {
    try {
        start();
    }
    catch (error) {
        console.log('caught');
        console.log(error);
        return;
    }
    core.onStart();
});
startRunButtons.onSparqlingStop(() => {
    stop();
    core.onStop();
});
startRunButtons.onQueryRun(() => {
    var _a;
    if (core.onQueryRun)
        core.onQueryRun((_a = getQueryBody()) === null || _a === void 0 ? void 0 : _a.sparql);
});

aggregationDialog.onSubmit((headElementId, aggregateOperator, distinct, havingOperator, havingParameters) => {
    const qgHeadApi = new QueryGraphHeadApi(undefined, getBasePath());
    const tempQueryBody = getTempQueryBody();
    const headElement = getHeadElementByID(headElementId, tempQueryBody);
    if (headElement) {
        headElement.groupBy = {
            distinct: distinct,
            aggregateFunction: aggregateOperator
        };
        if (havingOperator && havingParameters) {
            headElement.having = [{
                    expression: {
                        operator: havingOperator,
                        parameters: havingParameters,
                    }
                }];
        }
        handlePromise(qgHeadApi.aggregationHeadTerm(headElementId, tempQueryBody, getRequestOptions())).then(newBody => {
            onNewBody(newBody);
            aggregationDialog.setAsCorrect();
        });
    }
});

functionDialog.onSubmit((id, op, params) => __awaiter(void 0, void 0, void 0, function* () {
    const qhApi = new QueryGraphHeadApi(undefined, getBasePath());
    const newFunction = {
        name: op,
        parameters: params,
    };
    // Perform edits on a dummy query body in order to preserve the actual working one
    // The new data will be saved on service correct response
    const tempQueryBody = getTempQueryBody();
    if (id) {
        // add function
        const tempHeadElement = tempQueryBody.head.find(elem => elem.id === id);
        if (tempHeadElement) {
            tempHeadElement.function = newFunction;
            handlePromise(qhApi.functionHeadTerm(id, tempQueryBody, getRequestOptions())).then(newBody => {
                onNewBody(newBody);
                functionDialog.setAsCorrect();
            });
        }
    }
}));

highlightsList.onSuggestionLocalization((entityIri) => getGscape().centerOnEntity(entityIri));
highlightsList.onSuggestionAddToQuery((entityIri, entityType, relatedClass) => {
    var _a, _b;
    console.log(entityIri);
    switch (entityType) {
        case EntityTypeEnum.Class:
        case EntityTypeEnum.DataProperty:
            const grapholEntityType = entityType === EntityTypeEnum.Class ? GrapholTypesEnum.CLASS : GrapholTypesEnum.DATA_PROPERTY;
            const entityOccurrence = getEntityOccurrence(entityIri);
            if (entityOccurrence)
                handleEntitySelection(getGscape().ontology.prefixedToFullIri(entityIri) || entityIri, grapholEntityType, entityOccurrence);
            break;
        case EntityTypeEnum.ObjectProperty:
            if (relatedClass) {
                const objectPropertyBranch = (_b = (_a = getActualHighlights()) === null || _a === void 0 ? void 0 : _a.objectProperties) === null || _b === void 0 ? void 0 : _b.find((b) => {
                    if (b.objectPropertyIRI)
                        return b.objectPropertyIRI === entityIri || getPrefixedIri(b.objectPropertyIRI) === entityIri;
                });
                const relatedClassOccurrence = getEntityOccurrence(relatedClass);
                if (objectPropertyBranch && relatedClassOccurrence) {
                    handleObjectPropertySelection(objectPropertyBranch, relatedClassOccurrence);
                }
            }
    }
});

/**
 * Initialise sparqling on a grapholscape instance
 * @param gscape the grapholscape instance (ontology graph)
 * @param file the ontology .graphol, in string or Blob representation
 * @returns a core object, see ./core.ts
 */
function sparqlingStandalone(gscape, file) {
    return getCore(gscape, file);
}
function sparqling(gscape, file, requestOptions) {
    const sparqlingCore = getCore(gscape, file);
    if (sparqlingCore) {
        const currentRequestOptions = getRequestOptions();
        // if there's a new ontology, discard the current query and set current instance as not initialised
        if (requestOptions.version !== currentRequestOptions.params.version || requestOptions.basePath !== getBasePath()) {
            clearQuery();
            sparqlingCore.stop();
            setInitialised(false); // need to initialise everything again
        }
        setRequestOptions(requestOptions);
    }
    return sparqlingCore;
}
function getCore(gscape, file) {
    var _a;
    if (file && gscape) {
        let ontologyFile = new File([file], `${gscape.ontology.name}-from-string.graphol`);
        // model.setStandalone(basePath !== undefined || basePath !== null)
        setOntologyFile(ontologyFile);
        // if (basePath) {
        //   model.setBasePath(basePath)
        // }
        //sparqlingContainer.appendChild(gscapeContainer)
        //const gscape = await fullGrapholscape(file, gscapeContainer, { owl_translator: false })
        const actualGrapholscape = getGscape();
        if (actualGrapholscape !== gscape)
            setInitialised(false);
        setGrapholscapeInstance(gscape);
        leftColumnContainer.appendChild(qhWidget);
        leftColumnContainer.appendChild(highlightsList);
        // Add query graph and query head widgets to grapholscape instance
        const uiContainer = gscape.container.querySelector('.gscape-ui');
        if (uiContainer) {
            uiContainer.insertBefore(widget, uiContainer.firstChild);
            uiContainer.insertBefore(leftColumnContainer, uiContainer.firstChild);
            uiContainer.appendChild(relatedClassDialog);
            uiContainer.appendChild(sparqlDialog);
            uiContainer.appendChild(filterDialog);
            uiContainer.appendChild(filterListDialog);
            uiContainer.appendChild(functionDialog);
            uiContainer.appendChild(errorsDialog);
            uiContainer.appendChild(aggregationDialog);
            (_a = uiContainer === null || uiContainer === void 0 ? void 0 : uiContainer.querySelector('.gscape-ui-buttons-tray')) === null || _a === void 0 ? void 0 : _a.appendChild(startRunButtons);
        }
        setDisplayedNameType(gscape.entityNameType, gscape.language);
        setTheme(gscape.theme);
        return core;
    }
    else {
        return null;
    }
}

export { sparqling, sparqlingStandalone };
