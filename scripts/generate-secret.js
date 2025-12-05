// Generate a secure random secret for NEXTAUTH_SECRET
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Generated NEXTAUTH_SECRET:\n');
console.log(secret);
console.log('\n📝 Add this to your .env.local file:');
console.log(`NEXTAUTH_SECRET=${secret}\n`);
