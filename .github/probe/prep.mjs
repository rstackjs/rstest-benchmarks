// CI variant of prep.mjs: materialize the harness workspaces under $GITHUB_WORKSPACE/results/ws.
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
const root = process.env.GITHUB_WORKSPACE
const { generate, cases, frameworks } = await import(pathToFileURL(join(root, 'frameworks/fixtures.mjs')))
const { configure } = await import(pathToFileURL(join(root, 'frameworks/configs.mjs')))
const ws = join(root, 'results/ws')
generate(ws, frameworks)
for (const f of frameworks) for (const item of cases) configure(join(ws, 'workspaces', f, item.id), f, item)
console.log('ok')
