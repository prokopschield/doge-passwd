# doge-passwd

Generate strong password hashes easily.

```typescript
import { hash, verify } from 'doge-passwd';

let password = `some_user_input`;
let hash_length = 64;

// Create hash, looks like this: yBZnekfk3zlGhJE78~0vkGtvpfC6EOnFIWAs9YasaOqRuOHMECZgWQe~7J8N4TWV
let hashed = hash(password, hash_length);

// Max length is 80, there is no lower bound on length, but more bytes = more security
// Longer hashes will generate incorrectly, and trying to verify() them will yield chaos
// Hash will always only use SQL-safe URL-safe characters, /[0-9a-z~_]/i

console.log(verify(password, hashed)); // true
```

## methods

Regular - `hash(), verify()`

Hex - `hash_hex(), verify_hex()`

Always use the correct verify() function!

## length

For _regular_ hashes, length must a multiple of 8, <= 80.

For _hex_ hashes, length must be a multiple of 2, <= 128.

Longer length = more security!

## Frontend Authentication

You _can_ use this package for frontend authentication.

It is likely **_not_** a good idea.

However, if your database does get leaked, doge-passwd hashes will be much harder to crack than, for example, a simple SHA-256.
