const fs = require('fs');
const path = require('path');

const testFolder = path.join(__dirname, 'secret-folder');
fs.readdir(testFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(testFolder, file.name);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        const { name, ext } = path.parse(filePath);
        console.log(
          `${name} - ${ext.slice(1)} - ${(stats.size / 1024).toFixed(2)} kb`,
        );
      });
    }
  });
});
