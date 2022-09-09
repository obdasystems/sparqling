import axios from "axios";
import { MastroEndpoint } from "../../model";
import { handlePromise } from "../handle-promises";

export type QueryResult = {
  headTerms: string[],
  results: {
    type: string,
    shortIri: string,
    value: string
  }[][]
}

export enum QueryPollerStatus {
  TIMEOUT_EXPIRED = 0,
  DONE = 1,
  RUNNING = 2,
}

export default class QueryPoller {
  private endpoint: MastroEndpoint
  private executionID: string
  private limit: number
  private interval: NodeJS.Timer
  private lastRequestFulfilled: boolean = true
  private timeout: NodeJS.Timeout
  private _result: QueryResult
  private _newResultsCallback = (result: QueryResult) => { }
  private _timeoutExpiredCallback = () => { }

  static readonly TIMEOUT_LENGTH = 5000
  static readonly INTERVAL_LENGTH = 1000

  constructor(endpoint: MastroEndpoint, executionID: string, limit: number) {
    this.endpoint = endpoint
    this.executionID = executionID
    this.limit = limit
  }

  private poll() {
    handlePromise(axios.request<any>(this.queryResultRequestOptions)).then((result: QueryResult) => {
      this._result = result
      this.lastRequestFulfilled = true
      if (result.results.length >= this.limit) {
        this.stop()
      }
      this._newResultsCallback(result)
    })
  }

  start() {
    this.interval = setInterval(() => {
      if (this.lastRequestFulfilled) {
        this.lastRequestFulfilled = false
        this.poll()
      }
    }, QueryPoller.INTERVAL_LENGTH)

    this.timeout = setTimeout(() => this.stop(true), QueryPoller.TIMEOUT_LENGTH)
  }

  stop(timeoutExpired = false) {
    if (timeoutExpired) {
      console.warn(`[Sparqling] Timeout expired for query with id = [${this.executionID}]`)
      this._timeoutExpiredCallback()
    }
    clearInterval(this.interval)
    clearTimeout(this.timeout)
  }

  onNewResults(callback: (result: QueryResult) => void) {
    this._newResultsCallback = callback
  }

  onTimeoutExpiration(callback: () => void) {
    this._timeoutExpiredCallback = callback
  }

  get result() { return this._result }

  private get queryResultRequestOptions() {
    const queryResultsRequestOptions = {
      url: localStorage.getItem('mastroUrl') + '/endpoint/' + this.endpoint.name + '/query/' + this.executionID + '/results',
      method: 'get',
      params: { pagesize: 10, pagenumber: 1 },
      headers: JSON.parse(localStorage.getItem('headers') || ''),
    }

    return queryResultsRequestOptions
  }

  get status() {
    if (this.timeout as unknown as number === 0) {
      return QueryPollerStatus.TIMEOUT_EXPIRED
    } else {
      if (this.result.results.length >= this.limit)
        return QueryPollerStatus.DONE
      else
        return QueryPollerStatus.RUNNING
    }
  }
}