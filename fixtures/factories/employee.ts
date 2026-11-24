import type { Faker } from '@faker-js/faker';
import { lettersOnly, uniqueMarker } from './unique';

export type Employee = {
  firstName: string;
  middleName?: string;
  lastName: string;
  /** OrangeHRM limit: 10 characters. */
  employeeId: string;
};

/** OrangeHRM's max length for first, middle and last name. */
const NAME_MAX_LENGTH = 30;

/**
 * Builds a unique employee. The first name and employee ID share one marker
 * (`pw-k3x9q2-Maria`, `pw-k3x9q2`), so the records are easy to match and clean up.
 * No middle name unless given in `overrides`.
 */
export function buildEmployee(faker: Faker, overrides: Partial<Employee> = {}): Employee {
  const marker = uniqueMarker(faker);
  return {
    firstName: `${marker}-${lettersOnly(faker.person.firstName())}`.slice(0, NAME_MAX_LENGTH),
    lastName: lettersOnly(faker.person.lastName()).slice(0, NAME_MAX_LENGTH),
    employeeId: marker,
    ...overrides,
  };
}
