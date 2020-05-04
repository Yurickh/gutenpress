# Gutenpress

A Fast, typed, declarative web framework for the modern node times.

[![build status](https://github.com/Yurickh/gutenpress/workflows/CI/badge.svg)](https://github.com/Yurickh/gutenpress/actions?query=workflow%3ACI)
![npm version](https://img.shields.io/npm/v/@gutenpress/core?label=npm+version&logo=npm)
[![MIT](https://img.shields.io/github/license/Yurickh/gutenpress)](https://github.com/Yurickh/gutenpress/blob/master/LICENSE)

[![@gutenpress/core](https://img.shields.io/bundlephobia/min/@gutenpress/core?label=%40gutenpress%2Fcore)](https://www.npmjs.com/package/@gutenpress/core)
[![@gutenpress/helpers](https://img.shields.io/bundlephobia/min/@gutenpress/helpers?label=%40gutenpress%2Fhelpers)](https://www.npmjs.com/package/@gutenpress/helpers)
[![@gutenpress/adapt-http](https://img.shields.io/bundlephobia/min/@gutenpress/adapt-http?label=%40gutenpress%2Fadapt-http)](https://www.npmjs.com/package/@gutenpress/adapt-http)

```ts
import { createServer } from 'http'
import gutenpress, { get } from '@gutenpress/core'
import { toRouter } from '@gutenpress/adapt-http'

const apiDefinition = gutenpress([get('/', () => 'Hello world')])

createServer(toRouter(apiDefinition)).listen(3000)
```

## Installation

```bash
yarn add @gutenpress/core @gutenpress/adapt-http
# or
npm install @gutenpress/core @gutenpress/adapt-http
```

## Quick Start

 <!-- TODO: write a quick start about gutenpress' basic usage -->

## Philosophy

Gutenpress has some guiding principles behind its implementation, which gives background on some of its design and structural decisions.

### Gutenpress is modular

As you might have noticed, gutenpress comes in small packages.
This is due to its philosophy of keeping funcionality to small packages.

The **core** provides the basic functionality of hacking together an api definition, while the **adapt-http** package handles the heavy lifting of transforming that definition into a functional http router, that can be plugged into either node's default `http` module or even [express](https://github.com/expressjs/express) itself.

This allows more adapters to be built on top of gutenpress' api definitions. We have plans of creating an [adapt-client](https://github.com/Yurickh/gutenpress/issues/5) that would create [mappersmith](https://github.com/tulios/mappersmith) type definitions that could be consumed client-side; and also a [adapt-lambda](https://github.com/Yurickh/gutenpress/issues/20) that would let you create and deploy aws lambdas easily.

### Gutenpress is easily migratable to

Due to its compatibility with node's apis, it's easy to partially transform a set of express endpoints into gutenpress' and keep the underlying express router working. That way you can take advantage of both gutenpress' declarative API and express feature-completeness while gutenpress doesn't support it.

```ts
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send("Let's migrate this endpoint to gutenpress")
})

app.post('/', (req, res) => {
  res.send('And this one as well')
})

app.get('/deprecated', (req, res) => {
  res.send("But let's keep this one around")
})

app.listen(3000)
```

Becomes:

```ts
import express from 'express'
import gutenpress, { get, post } from '@gutenpress/core'
import { toRouter } from '@gutenpress/adapt-http'

const app = express()

const apiDefinition = gutenpress([
  get('/', () => "Let's migrate this endpoint to gutenpress"),
  post('/', () => 'And this one as well'),
])

app.use(toRouter(apiDefinition))

app.get('/deprecated', (req, res) => {
  res.send("But let's keep this one around")
})

app.listen(3000)
```

### Gutenpress is fully typed

Gutenpress' returns are all plain javascript objects, and its helpers try their best to be as approachable to typescript's autocomplete as possible:

![autocomplete example](static/philosophy-autocomplete.gif)

This of course doesn't mean you can't use gutenpress with plain JS!

### Gutenpress is declarative

One of the most important guiding principles is that http endpoints should be declarative and functional, and as easy to type and understand as plain JS functions.
