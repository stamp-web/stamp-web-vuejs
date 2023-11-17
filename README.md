# stamp-web-vuejs

This is the new generation Stamp Web editor written in Vue 3.  

## Why Vue?
While the existing [Stamp Web](https://github.com/stamp-web/stamp-web-aurelia) written in Aurelia 1.x has served as an outstanding application for over 10 years, I wanted to learn Vue and convert the application to this modern JavaScript framework stack.  I love aurelia and continue to use it in any projects.  But Vue was attractive and a perfect opportunity to learn an entirely new framework as well as TypeScript, Vite, Vitest and a whole slew of other technologies.

## What is this Application?

The Stamp Web application is used to manage stamp collections and is in use by myself and a few other collectors worldwide.  It is not a commercial product and does not have any valid commercial propsects, but it does serve as a wonder platform for myself and other contributing developers to learn new technologies while advancing and organizing our collections. On my production server, I currently manage over 40,000 stamps with this number growing constantly.  When you bring up the application you should see a welcome pages simliar to the following:

![Stamp Web home view](https://raw.githubusercontent.com/stamp-web/stamp-web-vuejs/main/media/StampWebHome.png)

From this page you can navigate to other pages that allow you to manage the data.  For example, the Stamp Collections management page looks like the following:

![Stamp Web collections view](https://raw.githubusercontent.com/stamp-web/stamp-web-vuejs/main/media/StampWebCollections.png)

***

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


### Connecting with stamp-webservices

Create a ``.env.development`` file and define the following parameters

```text
VITE_PROXY_USER=<username>
VITE_PROXY_PASSWORD=<password>>
VITE_PROXY_URL="<proxy url path eg. https://localhost:9001>"
VITE_SSL_KEY="<location of key file>"
VITE_SSL_CERT="<location of cert file>"
```

This can be used for both development and test modes.  If running the build for production,
you can start an http-server from the 'dist' folder with a proxy pointing to the host


```shell
npx http-server -p 9000 -b -g --proxy https://localhost:9001 --proxy-options.secure false
```