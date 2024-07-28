# Hasksi.js

Welcome to Hasksi.js, the ultimate modular request library built with TypeScript. Hasksi.js is designed to be simple yet powerful, providing extensive support for VPNs, proxies, session management, and more. Whether you are a beginner or an experienced developer, Hasksi.js offers a seamless experience for handling HTTP requests with ease and flexibility.

## Features

- **Modular Design**: Easily extend and customize functionality.
- **VPN and Proxy Support**: Effortlessly route requests through VPNs and proxies.
- **Session Management**: Maintain and manage sessions, cookies, and headers.
- **CSRF Protection**: Automatically handle CSRF tokens for secure requests.
- **Flexible Configuration**: Full control over request headers, cookies, and other options.

## Installation

To get started with Hasksi.js, you need to have Node.js installed. Then, you can install Hasksi.js via npm:

```bash
npm install hasksi
```

## Getting Started

Here's a quick guide to get you started with Hasksi.js.

### Basic Usage

First, import the necessary modules and create an instance of the `Hasksi` class.

```typescript
import { Hasksi, HasksiSession } from "hasksi";

// Create a new session
const session = new HasksiSession();

// Initialize Hasksi with the session
const hasksi = new Hasksi(session);

// Make a GET request
hasksi.get('https://api.example.com/data')
  .then(response => {
    console.log(response.body);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Using Proxies

To route your requests through a proxy, simply configure the proxy settings.

```typescript
import { HasksiProxy, HasksiSession } from "hasksi";

// Create a new proxy instance
const proxy = new HasksiProxy('proxy.example.com', 8080, 'username', 'password', 'sessionId');

// Create a new session with the proxy
const session = new HasksiSession();
session.proxy = proxy;

// Initialize Hasksi with the session
const hasksi = new Hasksi(session);

// Make a GET request through the proxy
hasksi.get('https://api.example.com/data')
  .then(response => {
    console.log(response.body);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Session Management

Hasksi.js allows you to manage sessions, including cookies and headers.

```typescript
import { HasksiSession, HasksiHeaders, HasksiCookies } from "hasksi";

// Create a new session
const session = new HasksiSession();

// Set custom headers
session.Headers.set('Authorization', 'Bearer YOUR_TOKEN');

// Set cookies
session.Cookies.set('session_id', 'YOUR_SESSION_ID');

// Initialize Hasksi with the session
const hasksi = new Hasksi(session);

// Make a GET request with custom headers and cookies
hasksi.get('https://api.example.com/data')
  .then(response => {
    console.log(response.body);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Handling CSRF Tokens

Hasksi.js can automatically handle CSRF tokens for you.

```typescript
import { Hasksi, HasksiSession } from "hasksi";

// Create a new session
const session = new HasksiSession();

// Initialize Hasksi with the session
const hasksi = new Hasksi(session);

// Make a POST request with CSRF token handling
hasksi.post('https://api.example.com/submit', {
  headers: {
    'X-Csrf-Token': session.CsrfToken
  },
  data: {
    key: 'value'
  }
})
  .then(response => {
    console.log(response.body);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## Contributing

We welcome contributions from the community! If you have suggestions, bug reports, or feature requests, please open an issue on GitHub. For major changes, please open a pull request to discuss what you would like to change.

## License

Hasksi.js is released under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

Thank you for choosing Hasksi.js. We hope this library helps make your development process smoother and more efficient. Happy coding!