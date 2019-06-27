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
    const files = await useTabs(cwd, opts._, (file, code) => {
      if (!opts.n) fs.writeFileSync(file, code)
      console.log(green('✓ ' + path.relative(cwd, file)))
      count++
    })

    if (!files.length) {
      console.log(`⚠️  No files were found.`)
      return
    }

    const message = !count
      ? `Nothing changed`
      : opts.n
      ? `Found ${count} file${count > 1 ? 's' : ''} with spaces`
      : `Changed ${count} file${count > 1 ? 's' : ''}`

    console.log(`✨  ${message}.`)
  })
  .parse(process.argv)
