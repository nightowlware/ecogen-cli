#!/usr/bin/env node
"use strict";

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

const inputFile = argv._[0];
const outputFile = argv._[1];


function createDefaultContext() {
  function ecogenRun(filename, inputContext) {
    return ecogen.run(fs.readFileSync(filename, {encoding: "utf-8"}), Object.assign(createDefaultContext(), inputContext));
  }

  return {
    require,
    ecogenRun,
  };
}

let evalContext = createDefaultContext();
if (argv.c) {
  const contextFile = argv.c;
  if (contextFile.endsWith('.json')) {
    evalContext = Object.assign(evalContext, JSON.parse(fs.readFileSync(contextFile)));
    // console.log("evalContext: ", evalContext);
  }
}

const outputCode = ecogen.run(fs.readFileSync(inputFile, {encoding: "utf-8"}), evalContext);

if (outputFile) {
  fs.writeFileSync(outputFile, outputCode);
  console.log(chalk.cyan.bold(`Wrote output file "${outputFile}"`));
} else {
  fs.writeSync(1, outputCode);
  fs.fsync(1, () => {});
}
