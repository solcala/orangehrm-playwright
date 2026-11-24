import type { Faker } from '@faker-js/faker';

/** Marks every record a test creates, so leftovers are easy to find and clean up (search for `pw-`). */
export const TEST_DATA_PREFIX = 'pw-';

/** Length of the random suffix: 36^6 ≈ 2 billion values, enough to avoid clashes between parallel tests. */
const SUFFIX_LENGTH = 6;

/**
 * `pw-` + a short lowercase alphanumeric suffix (e.g. `pw-k3x9q2`), drawn from the test's seeded
 * `faker` so a replayed seed gives the same value.
 */
export function uniqueMarker(faker: Faker): string {
  return TEST_DATA_PREFIX + faker.string.alphanumeric({ length: SUFFIX_LENGTH, casing: 'lower' });
}

/** Keeps letters only, so generated names pass OrangeHRM's validation (e.g. drops the apostrophe in "O'Keefe"). */
export function lettersOnly(value: string): string {
  return value.replace(/[^A-Za-z]/g, '');
}
