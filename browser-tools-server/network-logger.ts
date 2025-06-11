import type { Page, HTTPRequest, HTTPResponse } from 'puppeteer-core';

export interface NetworkLog {
  url: string;
  method: string;
  status: number | null;
  statusText: string | null;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  requestBody: string | null;
  responseBody: string | null;
  timestamp: number;
  duration: number;
  resourceType: string;
  isError: boolean;
}

export class NetworkLogger {
  private logs: NetworkLog[] = [];
  private page: Page | null = null;
  private requestMap = new Map<string, { request: HTTPRequest; startTime: number }>();

  public start(page: Page): void {
    this.page = page;
    this.page.on('request', this.handleRequest);
    this.page.on('response', this.handleResponse);
    this.page.on('requestfailed', this.handleRequestFailed);
  }

  public stop(): void {
    if (this.page) {
      this.page.off('request', this.handleRequest);
      this.page.off('response', this.handleResponse);
      this.page.off('requestfailed', this.handleRequestFailed);
      this.page = null;
    }
  }

  public getLogs(): NetworkLog[] {
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
    this.requestMap.clear();
  }

  private handleRequest = (request: HTTPRequest): void => {
    // @ts-ignore
    this.requestMap.set(request._requestId, { request, startTime: Date.now() });
  };

  private handleResponse = async (response: HTTPResponse): Promise<void> => {
    // @ts-ignore
    const requestInfo = this.requestMap.get(response.request()._requestId);
    if (!requestInfo) {
      return;
    }

    const { request, startTime } = requestInfo;
    const duration = Date.now() - startTime;

    let responseBody: string | null = null;
    try {
      responseBody = await response.text();
    } catch (error) {
      // Ignore errors for responses with no body
    }

    this.logs.push({
      url: response.url(),
      method: request.method(),
      status: response.status(),
      statusText: response.statusText(),
      requestHeaders: request.headers(),
      responseHeaders: response.headers(),
      requestBody: request.postData() || null,
      responseBody,
      timestamp: startTime,
      duration,
      resourceType: request.resourceType(),
      isError: response.status() >= 400,
    });

    // @ts-ignore
    this.requestMap.delete(request._requestId);
  };

  private handleRequestFailed = (request: HTTPRequest): void => {
    // @ts-ignore
    const requestInfo = this.requestMap.get(request._requestId);
    if (!requestInfo) {
      return;
    }

    const { startTime } = requestInfo;
    const duration = Date.now() - startTime;

    this.logs.push({
      url: request.url(),
      method: request.method(),
      status: null,
      statusText: request.failure()?.errorText || 'Request Failed',
      requestHeaders: request.headers(),
      responseHeaders: {},
      requestBody: request.postData() || null,
      responseBody: null,
      timestamp: startTime,
      duration,
      resourceType: request.resourceType(),
      isError: true,
    });

    // @ts-ignore
    this.requestMap.delete(request._requestId);
  };
}
