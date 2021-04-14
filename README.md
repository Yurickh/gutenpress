# Gutenpress

[![build status](https://github.com/Yurickh/gutenpress/workflows/CI/badge.svg)](https://github.com/Yurickh/gutenpress/actions?query=workflow%3ACI)
![npm version](https://img.shields.io/npm/v/@gutenpress/core?label=npm+version&logo=npm)
[![MIT](https://img.shields.io/github/license/Yurickh/gutenpress)](https://github.com/Yurickh/gutenpress/blob/master/LICENSE)

[![@gutenpress/core](https://img.shields.io/bundlephobia/min/@gutenpress/core?label=%40gutenpress%2Fcore)](https://www.npmjs.com/package/@gutenpress/core)

[![@gutenpress/helpers](https://img.shields.io/bundlephobia/min/@gutenpress/helpers?label=%40gutenpress%2Fhelpers)](https://www.npmjs.com/package/@gutenpress/helpers)

[![@gutenpress/adapt-http](https://img.shields.io/bundlephobia/min/@gutenpress/adapt-http?label=%40gutenpress%2Fadapt-http)](https://www.npmjs.com/package/@gutenpress/adapt-http)

## Disclaimer

As you can see from the version flagged as `alpha`, this project is a work in progress. It might not even be working if you download right now. Regardless, feel free to clone the repo and give it a spin; feedback is always very welcome!

Also, in retrospective, I think I overdid a bit on the types. :p~

## Project structure

The [gutenpress repo](https://github.com/Yurickh/gutenpress) is a monorepo using [lerna](https://github.com/lerna/lerna) and [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

It's divided into two main sections:

### [examples](https://github.com/Yurickh/gutenpress/tree/main/packages/examples)

This is where the packages that represent standalone examples live. We want to add as varied examples as we can think of, which different setups -- with express, without express, with TS, with no TS, as part of a bigger app, as a standalone thing, as a lambda, exporting mappersmith client typings -- the limit is your imagination. None of these packages will be published for obvious reasons. They also serve as playground.

### [gutenpress](https://github.com/Yurickh/gutenpress/tree/main/packages/gutenpress)

Here is where our gutenpress packages live. Each folder here with a name `X` will be published as `@gutenpress/X`.

We want to have an adaptor structure. That is, we have a very lean core, and we build functionality on top of it to adapt it to different use cases. These adaptors serve a lot as opt-in features.

## Set up

After cloning the PR, you should be able to install everything you need by running `yarn` at the top level.

### Running linters

We use [tsdx](https://github.com/formium/tsdx) to eliminate most of the hassle of building and setting up our packages. To run the linter in all packages, run:

```bash
yarn lerna run lint --stream --parallel
```

### Running type tests

We use [tsd](https://github.com/SamVerschueren/tsd) to verify our typings are sound. To run the type test in all packages, run:

```bash
yarn lerna run test:types --stream --parallel
```

### Running unit tests

We currently have tests only for our helpers package, and [we're aware this is not ideal](https://github.com/Yurickh/gutenpress/issues/2). To run unit tests on this specific package, run:

```bash
yarn lerna run test --scope @gutenpress/helpers
```

### Running example

To run the examples, you can `cd` into it and then start with `yarn dev`, for example:

```bash
cd packages/examples/express-ts
yarn dev
curl localhost:3000/express
```

## API docs

[TBD](https://github.com/Yurickh/gutenpress/issues/7)

For now, feel free to navigate around the example to get a grasp on how it works.

## Contributing

TBD
