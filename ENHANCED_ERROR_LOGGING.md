# Enhanced Error Logging for Browser Tools MCP

## Overview

The browser-tools-mcp has been significantly enhanced to capture comprehensive error logs that match what you see in Chrome DevTools. Previously, the tool only captured basic console messages, but now it captures:

## New Error Types Captured

### 1. Content Security Policy (CSP) Violations
- `script-src` violations (inline scripts, unsafe-eval, etc.)
- `style-src` violations (inline styles)
- `img-src` violations (external images)
- Other CSP directive violations

### 2. Network Loading Failures
- 404 errors and other HTTP errors
- Resource loading failures
- CORS errors
- Network timeouts

### 3. Security Errors
- Certificate errors
- Mixed content warnings
- Security state changes

### 4. Browser Interventions
- Lazy loading notifications
- Performance interventions
- Security interventions

### 5. JavaScript Errors (Enhanced)
- Runtime exceptions with full stack traces
- Syntax errors
- Type errors
- Reference errors
- Unhandled promise rejections

### 6. Audit Issues
- Accessibility violations
- Performance issues
- Best practice violations

## New MCP Tools Available

### Enhanced Existing Tools
- `getConsoleErrors` - Now captures much more comprehensive error information
- `getConsoleLogs` - Enhanced with additional metadata

### New Tools
- `getCSPViolations` - Specifically for Content Security Policy violations
- `getAllErrors` - Comprehensive summary of all error types with counts

## Enhanced Data Structure

Each error log entry now includes:
```json
{
  "type": "console-error",
  "level": "error|warning|info",
  "message": "Error description",
  "timestamp": 1234567890,
  "source": "csp-violation|runtime-exception|network-loading-failed|etc",
  "url": "URL where error occurred",
  "lineNumber": 42,
  "details": { /* Full error details */ },
  "isCSPViolation": true, // For CSP-specific errors
  "stackTrace": { /* Stack trace if available */ }
}
```

## Testing the Enhanced Error Logging

### 1. Set Up the Environment

1. Start the browser-tools-server:
```bash
cd browser-tools-server
npm install
npm start
```

2. Start the MCP server:
```bash
cd browser-tools-mcp
npm install
npm start
```

3. Load the Chrome extension (in Developer Mode):
   - Open Chrome DevTools in the browser-tools-server directory
   - Go to Extensions -> Developer mode -> Load unpacked
   - Select the `chrome-extension` folder

### 2. Test with the Provided Test Page

Open the `test-csp-violations.html` file in Chrome with the extension enabled. This page will:

- Trigger CSP violations automatically on load
- Provide buttons to trigger specific error types
- Show errors both in the page and in Chrome DevTools

### 3. Test with Real Websites

Navigate to websites that have CSP errors (like the one you mentioned: ponyclub.gr) and use the MCP tools to capture errors.

## Usage Examples

### Get All Errors
```bash
# This will return a comprehensive summary of all error types
mcp_getAllErrors
```

### Get Specific Error Types
```bash
# Just CSP violations
mcp_getCSPViolations

# Just console errors (now much more comprehensive)
mcp_getConsoleErrors

# Network errors
mcp_getNetworkErrors
```

### Example Output for CSP Violations
```json
[
  {
    "type": "console-error",
    "level": "error",
    "message": "Refused to execute inline script because it violates the following Content Security Policy directive: \"script-src 'self'\"",
    "timestamp": 1703123456789,
    "source": "csp-violation",
    "url": "https://example.com/page",
    "lineNumber": 1,
    "isCSPViolation": true,
    "details": {
      "level": "error",
      "text": "Refused to execute inline script...",
      "source": "security"
    }
  }
]
```

## Technical Implementation

### Chrome Extension Changes
- Enhanced the DevTools Protocol event listener to capture additional error types
- Enabled additional Chrome DevTools Protocol domains: Security, Network, Log, Page, Audits
- Added specific CSP violation detection logic

### Server Changes
- Added separate storage and endpoint for CSP violations
- Enhanced error categorization and metadata
- Added comprehensive error summary endpoint

### MCP Server Changes
- Added new tools for CSP violations and comprehensive error summaries
- Enhanced existing tools with richer error data

## Browser Compatibility

This enhanced error logging works with:
- Chrome 88+ (required for Chrome DevTools Protocol features)
- Chromium-based browsers (Edge, Opera, etc.)
- Does not work with Firefox or Safari (different extension APIs)

## Troubleshooting

### No Errors Being Captured
1. Ensure Chrome DevTools is open when browsing (required for the extension to work)
2. Check that the extension is properly loaded and enabled
3. Verify the browser-tools-server is running and discoverable
4. Check browser console for extension errors

### Missing Specific Error Types
Some errors might only appear when specific Chrome DevTools Protocol domains are enabled. The enhanced version now enables all relevant domains automatically.

### Performance Considerations
The enhanced error logging captures more data, which might slightly increase memory usage. The system automatically limits log storage to prevent memory issues.

## Comparison with Chrome DevTools

The enhanced browser-tools-mcp now captures the same types of errors you see in Chrome DevTools Console, including:

✅ Content Security Policy violations  
✅ Network loading failures  
✅ JavaScript runtime errors  
✅ Security warnings  
✅ Browser interventions  
✅ Performance warnings  
✅ Accessibility issues  

This makes it much more useful for debugging real-world web applications with complex CSP configurations and various error conditions. 