const run = require('child_process').execSync;

const files = [
                "examples/injectcontext.t.js -c examples/test.json",
                "examples/parent.t.js",
                "examples/quine.t.js",
                "examples/minimal.t.js",
                "examples/success.t.js",
                "examples/block.txt",
              ];

for (file of files) {
  console.log('--------------------------------');
  run(`node main.js ${file}`, {stdio: 'inherit'});
}
