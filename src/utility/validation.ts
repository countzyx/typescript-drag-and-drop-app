namespace App {
  // Validatable is an inteface to describe validation requirements for input values.
  export type Validatable = {
    value?: string | number;
    name: string;
    isRequired?: boolean;
    minSize?: number;
    maxSize?: number;
  };

  export interface ValidityStatus {
    isValid: boolean;
    message: string;
  }

  export function validate(validatableInput: Validatable): ValidityStatus {
    const status: ValidityStatus = { isValid: true, message: '' };
    const { value, name, isRequired, minSize, maxSize } = validatableInput;
    const trimmedValue = value ? value.toString().trim() : '';
    const hasValue = trimmedValue.length !== 0 || typeof value === 'number';
    if (isRequired) {
      status.isValid &&= hasValue;
      if (!hasValue) {
        status.message += name + ' is required. Please provide a value.\n';
      }
    }

    if (hasValue) {
      switch (typeof value) {
        case 'number': {
          if (minSize != null) {
            const isLessThanMin = value < minSize;
            status.isValid &&= !isLessThanMin;
            if (isLessThanMin) {
              status.message += name + ' must be greater than ' + minSize + '.\n';
            }
          }

          if (maxSize != null) {
            const isGreaterThanMax = value > maxSize;
            status.isValid &&= !isGreaterThanMax;
            if (isGreaterThanMax) {
              status.message += name + ' must be less than ' + maxSize + '.\n';
            }
          }

          break;
        }
        case 'string': {
          if (minSize != null) {
            const isLessThanMin = trimmedValue.length < minSize;
            status.isValid &&= !isLessThanMin;
            if (isLessThanMin) {
              status.message += name + ' must have a length greater than ' + minSize + '.\n';
            }
          }

          if (maxSize != null) {
            const isGreaterThanMax = trimmedValue.length > maxSize;
            status.isValid &&= !isGreaterThanMax;
            if (isGreaterThanMax) {
              status.message += name + ' must have a length less than ' + maxSize + '.\n';
            }
          }
          break;
        }
        default: {
          break;
        }
      }
    }

    return status;
  }
}
