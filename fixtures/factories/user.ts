import type { Faker } from '@faker-js/faker';
import { lettersOnly, uniqueMarker } from './unique';

export type User = {
  /** OrangeHRM: at least 5 characters, unique. */
  username: string;
  /** OrangeHRM: at least 7 characters, with at least one letter and one number. */
  password: string;
  role: 'Admin' | 'ESS';
  status: 'Enabled' | 'Disabled';
};

/** OrangeHRM's max username length. */
const USERNAME_MAX_LENGTH = 40;

/**
 * Builds a unique system user: an enabled ESS user unless `overrides` says otherwise.
 * The username looks like `pw-k3x9q2-maria`; the password has 12 characters and always
 * includes a lowercase letter, an uppercase letter and a digit.
 */
export function buildUser(faker: Faker, overrides: Partial<User> = {}): User {
  const username = `${uniqueMarker(faker)}-${lettersOnly(faker.person.firstName()).toLowerCase()}`;
  const password =
    faker.string.alpha({ length: 1, casing: 'lower' }) +
    faker.string.alpha({ length: 1, casing: 'upper' }) +
    faker.string.numeric(1) +
    faker.string.alphanumeric(9);
  return {
    username: username.slice(0, USERNAME_MAX_LENGTH),
    password,
    role: 'ESS',
    status: 'Enabled',
    ...overrides,
  };
}
