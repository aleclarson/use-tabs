#!/usr/bin/env node
const sade = require('sade')
const { green } = require('kleur')

sade('use-tabs', true)
  .version(require('./package.json').version)
  .option('-n, --check', 'Skip file writing')
  .action(async opts => {
    const fs = require('fs')
    const path = require('path')
    const useTabs = require('.')

    let count = 0
    const cwd = process.cwd()
    await useTabs(cwd, opts._, (file, code) => {
      if (!opts.n) fs.writeFileSync(file, code)
      console.log(green('✓ ' + path.relative(cwd, file)))
      count++
    })

    const message = !count
      ? `Nothing changed`
      : opts.n
      ? `Detected ${count} files that need changes`
      : `Changed ${count} files`

    console.log(`✨  ${message}.`)
  })
  .parse(process.argv)
