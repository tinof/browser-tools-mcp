# Browser Tools MCP Improvement Plan

This document outlines the plan for improving the Browser Tools MCP server to provide more comprehensive debugging capabilities for an autonomous AI agent.

## 1. Original Plan

Based on the initial analysis of the `BROWSER_TOOLS_TEST_RESULTS.md` file, the following improvements were proposed to enhance the MCP server's capabilities:

### 1.1. Enhanced Network Logging (Critical)

-   **Goal**: Capture detailed information about network requests and responses to help diagnose data-related issues.
-   **Proposed Functionality**:
    -   Log all `fetch` or XHR requests, including URL, method, headers, status code, and request/response payloads.
    -   Filter logs by resource type (e.g., XHR/Fetch, JS, CSS, Images).
    -   Clearly flag all 4xx and 5xx responses.

### 1.2. Source Map Support (High Impact)

-   **Goal**: Translate minified stack traces back to the original source code to make debugging easier.
-   **Proposed Functionality**:
    -   Automatically apply source maps to stack traces to show the original file, line, and function name.

### 1.3. React/Next.js Context (Advanced)

-   **Goal**: Provide deeper insights into the React/Next.js component architecture.
-   **Proposed Functionality**:
    -   Link errors to the specific React component that threw them.
    -   Provide detailed information about React hydration errors.
    -   Capture a snapshot of component state and props when an error occurs.

## 2. Work Done

The following tasks have been completed as part of the **Enhanced Network Logging** improvement:

1.  **Created `browser-tools-server/network-logger.ts`**: This file contains the `NetworkLogger` class, which is responsible for capturing and storing network requests, responses, and failures.
2.  **Integrated `NetworkLogger` into `puppeteer-service.ts`**: The `NetworkLogger` is now instantiated and used in the `connectToHeadlessBrowser` function to start and clear network logs for each new page.
3.  **Exposed `getNetworkLogs` function**: A `getNetworkLogs` function has been added to `puppeteer-service.ts` to retrieve the captured network logs.

## 3. Next Steps

The following tasks need to be completed to finish the planned improvements:

1.  **Fix Biome Errors**: The `browser-tools-server/puppeteer-service.ts` file has several Biome linter errors that need to be addressed.
2.  **Integrate Network Logs into MCP Server**:
    -   Read the `browser-tools-mcp/mcp-server.ts` file.
    -   Import the `getNetworkLogs` function from `browser-tools-server/puppeteer-service.ts`.
    -   Add a new `getNetworkLogs` tool to the MCP server that returns the result of the `getNetworkLogs` function.
3.  **Implement Source Map Support**: Begin implementation of the source map support feature as outlined in the original plan.
4.  **Implement React/Next.js Context**: Begin implementation of the React/Next.js context feature as outlined in the original plan.
