const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  } else {
    copyFiles();
    console.log('Files are copied!');
  }
});

const copyFiles = () => {
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) {
      return console.error(err);
    } else {
      files.forEach((file) => {
        fs.createReadStream(path.join(__dirname, `files/${file}`)).pipe(
          fs.createWriteStream(path.join(__dirname, `files-copy/${file}`)),
        );
      });
    }
  });
};

fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(path.join(__dirname, 'files-copy'), file), (err) => {
      if (err) throw err;
    });
  }
});
