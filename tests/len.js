const { hash, verify } = require('..');

const passwd = 'foobar';

module.exports = () => {
	for (let i = 8; i <= 80; i += 8) {
		let h = hash(passwd, i);
		let l = h.length;
		if (l !== i) {
			console.log({ h });
			throw new Error(
				`tests/len.js: hash of length ${i} returned length ${l}`
			);
		}
		if (!verify(passwd, h)) {
			console.log({ h });
			throw new Error(
				`tests/len.js: hash of length ${i} failed to verify`
			);
		}
	}
};
