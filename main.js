#!/usr/bin/env node
"use strict";

let fs = require('fs');
let ecogen = require('ecogen');
let argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .example('$0 <input_file> [output_file]', 'input_file must be valid TildeJS code; if output_file is omitted, output goes to stdin.')
  .demand(1, 2)
  .help('h')
  .alias('h', 'help')
  .argv;



const inputFile = argv._[0];
const outputFile = argv._[1];
const outputCode = ecogen.run(fs.readFileSync(inputFile, {encoding: "utf-8"}));

if (outputFile) {
  fs.writeFileSync(outputFile, outputCode);
} else {
  fs.writeSync(1, outputCode);
  fs.fsync(1, () => { process.exit(0); });
}
