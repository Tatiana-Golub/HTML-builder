const fs = require('fs');
const path = require('path');

const targetFolder = path.join(__dirname, 'project-dist');
const targetHTML = path.join(targetFolder, 'index.html');
const componentsPath = path.join(__dirname, 'components');
const cssFolder = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(path.join(targetFolder, 'style.css'));
const assetsTargetFolder = path.join(targetFolder, 'assets');

fs.mkdir(targetFolder, { recursive: true }, (err) => {
  if (err) console.error(err);
});

fs.mkdir(assetsTargetFolder, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  } else {
    copyFiles('assets');
  }
});

const indexWriteStream = fs.createWriteStream(path.join(targetHTML));

let indexHtmlText = '';

prepareHtml();
createCSS();

process.on('exit', () => {
  indexWriteStream.write(indexHtmlText);
  console.log('Compiling is done');
});

function prepareHtml() {
  const indexReadaStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  indexReadaStream.on('data', (chunk) => (indexHtmlText += chunk));
  indexReadaStream.on('error', (error) => console.log('Error', error.message));
  indexReadaStream.on('end', () => {
    fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
      if (err) console.log(err);

      for (const file of files) {
        const fileName = file.name;
        if (file.isFile() && path.extname(fileName) == '.html') {
          const insertReadStream = fs.createReadStream(
            path.join(__dirname, 'components', fileName),
            'utf-8',
          );
          let insertData = '';
          insertReadStream.on('data', (chunk) => (insertData += chunk));
          insertReadStream.on('error', (error) =>
            console.log('Error', error.message),
          );
          insertReadStream.on('end', () => {
            let tagName = `{{${fileName.split('.').slice(0, 1).join('')}}}`;
            indexHtmlText = indexHtmlText.replace(tagName, insertData);
          });
        }
      }
    });
  });
}

function createCSS() {
  fs.readdir(cssFolder, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);

    const EXTENSION = '.css';
    const targetFiles = files.filter((file) => {
      return path.extname(file.name) === EXTENSION && file.isFile();
    });

    targetFiles.forEach((file) => {
      fs.createReadStream(path.join(cssFolder, `${file.name}`), 'utf-8').pipe(
        writeStream,
      );
    });
  });
}

function copyFiles(targetDirectory) {
  fs.readdir(path.join(__dirname, targetDirectory), (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        fs.stat(
          path.join(__dirname, `${targetDirectory}/${file}`),
          (err, stats) => {
            if (err) {
              console.error(err);
              return;
            }
            if (stats.isFile()) {
              const readStreamAssets = fs.createReadStream(
                path.join(__dirname, `${targetDirectory}/${file}`),
              );
              const writeStreamAssets = fs.createWriteStream(
                path.join(__dirname, `project-dist/${targetDirectory}/${file}`),
              );
              readStreamAssets.pipe(writeStreamAssets);
            } else {
              const pathNewFolder = `${targetDirectory}/${file}`;
              fs.mkdir(
                path.join(__dirname, `project-dist/${pathNewFolder}`),
                { recursive: true },
                (err) => {
                  if (err) {
                    return console.error(err);
                  }
                  copyFiles(pathNewFolder);
                },
              );
            }
          },
        );
      });
    }
  });
}
