const { hash, verify } = require('../lib/passwd');

module.exports = async function test_verify() {
	const passwd = Buffer.allocUnsafeSlow(1024);
	const hashed = hash(passwd);
	if (!verify(passwd, hashed)) {
		throw new Error('test_verify failed!');
	}
};
