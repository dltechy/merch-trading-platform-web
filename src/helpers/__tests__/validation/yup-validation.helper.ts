import * as _ from 'lodash';
import { AnySchema, ValidationError } from 'yup';

export function createYupValidationTests({
  beforeEach,
  afterEach,
  schema,
  requiredData = {},
  propertyTestValues,
}: {
  beforeEach?: () => void | Promise<void>;
  afterEach?: () => void | Promise<void>;
  schema: AnySchema;
  requiredData: { [key: string]: unknown };
  propertyTestValues: {
    property: string;
    successValues: unknown[];
    failValues: unknown[];
  }[];
}): void {
  propertyTestValues.forEach(({ property, successValues, failValues }) => {
    describe(property, () => {
      successValues.forEach((value) => {
        it(`should accept "${value}"`, async () => {
          if (beforeEach) {
            await beforeEach();
          }

          const data = _.cloneDeep(requiredData);
          _.set(data, property, value);

          await expect(schema.validate(data)).resolves.toEqual(
            expect.objectContaining({
              [property]: value,
            }),
          );

          if (afterEach) {
            await afterEach();
          }
        });
      });

      failValues.forEach((value) => {
        it(`should reject "${value}"`, async () => {
          if (beforeEach) {
            await beforeEach();
          }

          const data = _.cloneDeep(requiredData);
          _.set(data, property, value);

          await expect(schema.validate(data)).rejects.toBeInstanceOf(
            ValidationError,
          );

          if (afterEach) {
            await afterEach();
          }
        });
      });
    });
  });
}
