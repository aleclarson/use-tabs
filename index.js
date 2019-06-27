const os = require('os')
const fs = require('fs')
const path = require('path')
const detect = require('detect-indent')
const { crawl } = require('recrawl')

// Some paths are always skipped.
const ALWAYS_SKIP = ['node_modules', '.git']

/**
 * Find all files in the given root directory which match the given globs.
 * For each file, replace all space indentation with tabs and pass each result
 * to the given callback.
 */
async function useTabs(root, globs, each) {
  const skip = globs.filter(glob => glob[0] == '!')
  const files = await crawl(root, {
    only: globs.filter(glob => !skip.includes(glob)),
    skip: ALWAYS_SKIP.concat(skip.map(glob => glob.slice(1))),
  })
  files.forEach(name => {
    const file = path.join(root, name)
    const code = fs.readFileSync(file, 'utf8')
    const { indent } = detect(code)
    if (indent && indent !== '\t') {
      each(file, convert(code, indent))
    }
  })
  return files
}

module.exports = useTabs

function convert(code, indent) {
  const indentRegex = /^([\u0020\t]*)/
  return code
    .split(/\r?\n/g)
    .map((line, i) => {
      const { length } = line.match(indentRegex)[0]
      return length
        ? '\t'.repeat(Math.round(length / indent.length)) +
            line.replace(/^\s+/, '')
        : line
    })
    .join(os.EOL)
}
