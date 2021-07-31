const { hash, verify } = require('../lib/passwd');

module.exports = async function test_verify() {
	const passwd = Buffer.allocUnsafeSlow(1024);
	for (let i = 0; i < 80; ++i) {
		passwd[Math.random() * 1024] = Math.random() * 256;
	}
	const hashed = hash(passwd, 80);
	if (!verify(passwd, hashed)) {
		throw new Error('test_long failed!');
	}
};
