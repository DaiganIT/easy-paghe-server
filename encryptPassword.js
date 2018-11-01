import bcrypt from 'bcrypt';

async function cryptPassword() {
  const password = await bcrypt.hash('test', 10);
  console.log(password);
}

cryptPassword();
