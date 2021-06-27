const { alphabet, encode, decode } = require('../lib/coder');

module.exports = async function test_coder() {
	const a = `${alphabet}`;
	const b = decode(a);
	const c = encode(b);
	if (a !== c) {
		console.log('Test 1 failed!');
		console.log({ a, b, c });
		throw new Error('Test 1 failed!');
	}
};
