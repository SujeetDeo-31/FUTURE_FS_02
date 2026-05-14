const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to hash: ', (password) => {
  if (!password) {
    console.error('Password cannot be empty');
    rl.close();
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  console.log('-----');
  console.log('Hashed Password:', hash);
  console.log('Copy this hash into your .env.local file as ADMIN_PASSWORD');
  console.log('-----');
  rl.close();
});
