#! /usr/bin/env node
const getFiles = require('../getFiles')
const commandLineArgs = require('command-line-args');


const cli = commandLineArgs([
  { name: 'dest', alias: 'd', type: String, defaultOption: true },
])

const options = cli.parse()
//console.log(JSON.stringify(options))
getFiles(options)
