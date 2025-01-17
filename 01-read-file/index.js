const fs = require('fs');
const path = require('path');
fs.readFile(
  path.join(
    __dirname,
    'C:UsersТатьянаDesktopHTML-builder\x01-read-file\text.txt',
  ),
  'utf8',
  (err, data) => {
    if (err) return console.error(err);
    console.log(data);
  },
);
