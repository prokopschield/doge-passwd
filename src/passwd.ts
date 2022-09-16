import { decode, encode } from '@prokopschield/base64';
import {
	blake2sInit,
	blake2sUpdate,
	blake2sCompress,
	blake2sFinal,
} from 'blakets';

/**
 * Generate salt Uint8Array
 * @param length Desired length
 * @param randomness Optional randomness to start from
 * @returns Pseudo-random Uint8Array
 */
export function generate_salt(
	length: number,
	randomness?: Uint8Array
): Uint8Array {
	const ctx = blake2sInit(32, randomness);
	const ret = new Uint8Array(length);
	for (let i = 0; i < length; ++i) {
		blake2sUpdate(ctx, randomness || new Uint8Array(ctx.h.buffer));
		blake2sCompress(ctx);
		ret[i] = ctx.h[(Math.random() * 16) >> 1] >> 8;
	}
	return ret;
}

/**
 * Generate verifyable hash
 * @param passwd Data being hashed
 * @param outlen Desired output length, up to 80
 * @param salt Optional pre-determined salt to use
 * @returns verify()-able hash
 */
export function hash(
	passwd: string | Uint8Array,
	outlen: number = 64,
	salt?: Uint8Array | string
): string {
	if (typeof salt === 'string') {
		salt = decode(salt);
	}
	outlen *= 3 / 4;
	const salt_length = outlen >> 1;
	const hash_length = outlen - salt_length;
	salt ||= generate_salt(salt_length);
	if (salt.length !== salt_length) {
		salt = generate_salt(salt_length, salt);
	}
	const ctx = blake2sInit(hash_length);
	blake2sUpdate(ctx, salt);
	blake2sUpdate(ctx, Buffer.from(passwd));
	const final = blake2sFinal(ctx);
	return `${encode(final)}${encode(salt)}`;
}

/**
 * Verify passwd against hash
 * @param passwd Data being hashed
 * @param hashed The correct hash to check against
 * @returns true if passwd is correct, false otherwise
 */
export function verify(passwd: string | Uint8Array, hashed: string): boolean {
	const salt_length = hashed.length >> 1;
	return (
		hashed ===
		hash(
			passwd,
			hashed.length,
			decode(hashed.substr(hashed.length - salt_length))
		)
	);
}

/**
 * The same as hash(), but returns hexadecimal.
 *
 * Must be verified using verify_hex()
 *
 * @param passwd Password
 * @param outlen Output length (in hex chars)
 * @param salt Optional, must be a hex string
 */
export function hash_hex(
	passwd: string | Uint8Array,
	outlen: number = 64,
	salt?: string | Uint8Array
) {
	outlen >>= 1;
	const salt_length = outlen >> 1;
	const hash_length = outlen - salt_length;
	salt ||= generate_salt(salt_length);
	if (typeof salt === 'string') {
		salt = salt.match(/^[0-9a-f]+$/gi)
			? Buffer.from(salt, 'hex')
			: Buffer.from(salt);
	}
	if (salt.length !== salt_length) {
		salt = generate_salt(salt_length, salt);
	}
	const ctx = blake2sInit(hash_length);
	blake2sUpdate(ctx, salt);
	blake2sUpdate(ctx, Buffer.from(passwd));
	const final = Buffer.from(blake2sFinal(ctx));
	return `${final.toString('hex')}${Buffer.from(salt).toString('hex')}`;
}

/**
 * Verify passwd against hex hash
 * @param passwd Data being hashed
 * @param hashed The correct hash to check against
 * @returns true if passwd is correct, false otherwise
 */
export function verify_hex(
	passwd: string | Uint8Array,
	hashed: string
): boolean {
	const salt_length = (hashed.length >> 2) << 1;
	return (
		hashed ===
		hash_hex(
			passwd,
			hashed.length,
			hashed.slice(hashed.length - salt_length)
		)
	);
}

/**
 * Extract salt from a hashed string
 * @param hashed the hashed password
 * @returns the salt (in the same format as the hashed string, base64 or hex)
 */
export function extract_salt(hashed: string) {
	return hashed.slice(hashed.length >> 1);
}
