const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const rl = readline.createInterface({ input, output });
const writeStream = fs.createWriteStream(
  path.join(__dirname, 'destination.txt'),
);
const exit = () => {
  output.write('Goodbye!' + '\n');
  process.exit();
};

output.write('Hello! Type in your text' + '\n');
rl.on('line', (answer) => {
  if (answer === 'exit') {
    exit();
    return;
  }
  writeStream.write(answer + '\n');
}).on('SIGINT', exit);
