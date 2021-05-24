import {build, stop} from 'https://deno.land/x/esbuild@v0.12.1/mod.js'
import httpFetch from '../http-fetch.js'

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
