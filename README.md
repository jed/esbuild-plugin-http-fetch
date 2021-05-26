# esbuild-plugin-http-fetch

An esbuild plugin that resolves http(s) modules, for use with browsers and Deno.

## Example
```js
// test/index.js
import {build, stop} from 'https://deno.land/x/esbuild@v0.12.1/mod.js'
import httpFetch from 'https://deno.land/x/esbuild_plugin_http_fetch@v1.0.2'

let {outputFiles} = await build({
  bundle: true,
  entryPoints: ['test/hello.jsx'],
  jsxFactory: 'h',
  plugins: [httpFetch],
  write: false
})

eval(outputFiles[0].text)
// expected: <h1>Hello, world!</h1>
// actual: <h1>Hello, world!</h1>

stop()
```

```js
// test/hello.jsx
import {h} from 'https://unpkg.com/preact@10.5.13/dist/preact.module.js'
import render from 'https://unpkg.com/preact-render-to-string@5.1.19/dist/index.module.js?module'

let app = <h1>Hello, world!</h1>
let html = render(app)

console.log('expected: %s', '<h1>Hello, world!</h1>')
console.log('actual: %s', html)
```
