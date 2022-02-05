/* tslint:disable */
/* eslint-disable */
/**
 * Swagger Sparqling WS
 * This server will expose an API to Sparqling front end to create new SPARQL queries with a combinations of point and click on the [GRAPHOLscape](https://github.com/obdasystems/grapholscape) graph.  Sparqling will be released as a standalone appication but also the server will embedded in [MWS](https://github.com/obdasystems/mws) and Sparqling will be integrated in [Monolith](https://www.monolith.obdasystems.com/).
 *
 * OpenAPI spec version: 1.0.0
 * Contact: info@obdasystems.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
/**
 * StandaloneApi - axios parameter creator
 * @export
 */
export const StandaloneApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Return the graphol file as a string to be parsed by Grapholscape.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        standaloneOntologyGrapholGet: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/standalone/ontology/graphol`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Uploads a .graphol or .owl file. This will be used only by standalone Sparqling.
         * @param {string} [file] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        standaloneOntologyUploadPost: async (file?: File, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/standalone/ontology/upload`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new FormData();


            if (file !== undefined) { 
                localVarFormParams.append('file', file as any, file.name);
            }

            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * StandaloneApi - functional programming interface
 * @export
 */
export const StandaloneApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Return the graphol file as a string to be parsed by Grapholscape.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async standaloneOntologyGrapholGet(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await StandaloneApiAxiosParamCreator(configuration).standaloneOntologyGrapholGet(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Uploads a .graphol or .owl file. This will be used only by standalone Sparqling.
         * @param {string} [file] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async standaloneOntologyUploadPost(file?: File, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await StandaloneApiAxiosParamCreator(configuration).standaloneOntologyUploadPost(file, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * StandaloneApi - factory interface
 * @export
 */
export const StandaloneApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Return the graphol file as a string to be parsed by Grapholscape.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        standaloneOntologyGrapholGet(options?: any): AxiosPromise<string> {
            return StandaloneApiFp(configuration).standaloneOntologyGrapholGet(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Uploads a .graphol or .owl file. This will be used only by standalone Sparqling.
         * @param {string} [file] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        standaloneOntologyUploadPost(file?: File, options?: any): AxiosPromise<void> {
            return StandaloneApiFp(configuration).standaloneOntologyUploadPost(file, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * StandaloneApi - object-oriented interface
 * @export
 * @class StandaloneApi
 * @extends {BaseAPI}
 */
export class StandaloneApi extends BaseAPI {
    /**
     * 
     * @summary Return the graphol file as a string to be parsed by Grapholscape.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StandaloneApi
     */
    public standaloneOntologyGrapholGet(options?: any) {
        return StandaloneApiFp(this.configuration).standaloneOntologyGrapholGet(options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @summary Uploads a .graphol or .owl file. This will be used only by standalone Sparqling.
     * @param {string} [file] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StandaloneApi
     */
    public standaloneOntologyUploadPost(file?: File, options?: any) {
        return StandaloneApiFp(this.configuration).standaloneOntologyUploadPost(file, options).then((request) => request(this.axios, this.basePath));
    }
}
