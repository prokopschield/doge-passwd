import {
	blake2sInit,
	blake2sUpdate,
	blake2sCompress,
	blake2sFinal,
} from 'blakets';
import { decode, encode } from './coder';

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
	salt?: Uint8Array
): string {
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
