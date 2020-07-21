const fs = require('fs-extra');

[
    'package.json',
    'package-lock.json',
    'README.md'
].forEach(p => {
    fs.copyFileSync(`./${p}`, `./dist/${p}`);
});
