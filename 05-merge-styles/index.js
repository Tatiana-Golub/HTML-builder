const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'styles');
const destFolder = path.join(__dirname, 'project-dist');
const writeStream = fs.createWriteStream(path.join(destFolder, 'bundle.css'));

fs.readdir(sourceFolder, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);

  const EXTENSION = '.css';
  const targetFiles = files.filter((file) => {
    return path.extname(file.name) === EXTENSION && file.isFile();
  });

  targetFiles.forEach((file) => {
    fs.createReadStream(path.join(sourceFolder, `${file.name}`), 'utf-8').pipe(
      writeStream,
    );
  });
  console.log('Compiling is ended!');
});
