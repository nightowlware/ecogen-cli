#!/usr/bin/env node
"use strict";

const process = require('process');
const chalk = require('chalk');
const fs = require('fs');
const ecogen = require('ecogen');
const argv = require('yargs')
  .usage('Usage: ecogen <command> [options]')
  .example('ecogen <input_file> [output_file]', 'input_file must be valid TildeJS code; if output_file is omitted, output goes to stdin.')
  .demand(1, 2)
  .nargs('c', 1)
  .describe('c', 'Provide eval context as a file: if a .json file is provided, then its data is injected into the eval scope. See examples/injectcontext.t.js')
  // .describe('c', 'Provide eval context, as a file: if a .json file is provided, then its data is injected as an object into the eval scope. If a .js file is provided, then it is "require()ed" into the eval scope as an object with the same name as the base file name (excluding the .js extension)')
  .help('h')
  .version()
  .alias('c', 'context')
  .alias('h', 'help')
  .alias('v', 'version')
  .argv;


function abort(msg) {
  console.error(chalk.red(msg));
  console.error(chalk.red('Aborting.'));
  process.exit(-1);
}


const srcFile = argv._[0];
const outputFile = argv._[1];
let envFile = null;

if (argv.c) {
  envFile = argv.c;
  if (!(typeof envFile === 'string' && envFile.endsWith('.json'))) {
    abort('You must supply a .json file for data injection.');
  }
}

const outputCode = ecogen.runFile(srcFile, envFile);

if (outputFile) {
  fs.writeFileSync(outputFile, outputCode);
  console.log(chalk.cyan.bold(`Wrote output file "${outputFile}"`));
} else {
  fs.writeSync(1, outputCode);
  fs.fsync(1, () => {});
}
