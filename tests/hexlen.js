const { hash_hex, verify_hex } = require('..');

const passwd = 'foobar';

module.exports = () => {
	for (let i = 8; i < 128; i += 2) {
		let h = hash_hex(passwd, i);
		let l = h.length;
		if (l !== i) {
			throw new Error(`hexlen failed for length of ${i} (${l})`);
		}
		if (!verify_hex(passwd, h)) {
			throw new Error(`hexlen verification failed: [${i}] ${h}`);
		}
	}
};
