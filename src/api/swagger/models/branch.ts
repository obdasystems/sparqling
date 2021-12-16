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
/**
 * 
 * @export
 * @interface Branch
 */
export interface Branch {
    /**
     * 
     * @type {string}
     * @memberof Branch
     */
    objectPropertyIRI?: any;
    /**
     * It is true when domain and range are the same class.
     * @type {boolean}
     * @memberof Branch
     */
    cyclic?: any;
    /**
     * 
     * @type {boolean}
     * @memberof Branch
     */
    direct?: any;
    /**
     * 
     * @type {Array&lt;string&gt;}
     * @memberof Branch
     */
    relatedClasses?: any;
}