#!/usr/bin/env node

import { hash } from './passwd';

process.stdin.on('data', (passwd) => process.stdout.write(hash(passwd)));
