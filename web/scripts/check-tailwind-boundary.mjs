import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const webRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const sourceRoot = join(webRoot, 'src')

function findCssFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory()
      ? findCssFiles(path)
      : entry.name.endsWith('.css')
        ? [path]
        : []
  })
}

const cssFiles = findCssFiles(sourceRoot)
const expectedStylesheet = join(sourceRoot, 'index.css')

if (
  cssFiles.length !== 1 ||
  resolve(cssFiles[0]) !== resolve(expectedStylesheet)
) {
  const found = cssFiles.map((file) => relative(webRoot, file)).join(', ')
  throw new Error(
    `Component CSS is not allowed. Expected only src/index.css; found: ${found}`,
  )
}

const stylesheet = readFileSync(expectedStylesheet, 'utf8')
const componentSelector = /^\s*\.[A-Za-z_-][\w-]*(?:[\s:.,[\]>#]|$)/m

if (componentSelector.test(stylesheet)) {
  throw new Error(
    'src/index.css must remain foundation-only; move component selectors to Tailwind utilities.',
  )
}
