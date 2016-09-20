#!/usr/bin/env node
"use strict";

const chalk = require('chalk');
const fs = require('fs');
const ecogen = require('ecogen');
const argv = require('yargs')
  .usage('Usage: ecogen <command> [options]')
  .example('ecogen <input_file> [output_file]', 'input_file must be valid TildeJS code; if output_file is omitted, output goes to stdin.')
  .demand(1, 2)
  .help('h')
  .version()
  .alias('h', 'help')
  .alias('v', 'version')
  .argv;



const inputFile = argv._[0];
const outputFile = argv._[1];
const outputCode = ecogen.run(fs.readFileSync(inputFile, {encoding: "utf-8"}));

if (outputFile) {
  fs.writeFileSync(outputFile, outputCode);
  console.log(chalk.cyan.bold(`Wrote output file "${outputFile}"`));
} else {
  fs.writeSync(1, outputCode);
  fs.fsync(1, () => {});
}
