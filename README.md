# doge-passwd

Generate strong password hashes easily.

```typescript
import { hash, verify } from 'doge-passwd';

let password = `some_user_input`;
let hash_length = 64;

// Create hash, looks like this: yBZnekfk3zlGhJE78~0vkGtvpfC6EOnFIWAs9YasaOqRuOHMECZgWQe~7J8N4TWV
let hashed = hash(password, hash_length);

// Max length is 64, there is no lower bound on length, but more bytes = more security
// Longer hashes will generate incorrectly, and trying to verify() them will yield chaos
// Hash will always only use SQL-safe URL-safe characters, /[0-9a-z~_]/i

console.log(verify(password, hashed)); // true
```
