const run = require('child_process').execSync;

const files = [
                "examples/injectcontext.t.js -c examples/test.json",
                "examples/parent.t.js",
                "examples/quine.t.js",
                "examples/minimal.t.js",
                "examples/success.t.js"
              ];

for (file of files) {
  run(`node main.js ${file}`, {stdio: 'inherit'});
}
