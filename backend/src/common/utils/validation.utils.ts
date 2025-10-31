export class ValidationUtils {
  /**
   * Validates if a string is a valid email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  /**
   * Validates if a string meets password requirements
   */
  static isValidPassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one digit
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

    return passwordRegex.test(password);
  }

  /**
   * Validates if a number is within a specific range
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Validates if a string is not empty and meets length requirements
   */
  static isValidString(value: string, minLength = 1, maxLength = 255): boolean {
    return (
      typeof value === 'string' &&
      value.trim().length >= minLength &&
      value.trim().length <= maxLength
    );
  }

  /**
   * Sanitizes a string by trimming and removing extra spaces
   */
  static sanitizeString(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  /**
   * Validates if a value exists in an enum
   */
  static isValidEnum<T>(value: any, enumObject: T): boolean {
    return Object.values(enumObject as any).includes(value);
  }

  /**
   * Validates if an ID is valid (positive integer or valid string)
   */
  static isValidId(id: string | number): boolean {
    if (typeof id === 'number') {
      return Number.isInteger(id) && id > 0;
    }

    if (typeof id === 'string') {
      return id.trim().length > 0;
    }

    return false;
  }
}

export class TransformUtils {
  /**
   * Converts a string to title case
   */
  static toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Converts a number to currency format
   */
  static toCurrency(
    amount: number,
    currency = 'USD',
    locale = 'en-US',
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Truncates text to specified length with ellipsis
   */
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Converts timestamp to ISO string safely
   */
  static timestampToISO(
    timestamp: FirebaseFirestore.Timestamp | Date | undefined,
  ): string | null {
    if (!timestamp) return null;

    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }

    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
      return (timestamp as any).toDate().toISOString();
    }

    return null;
  }

  /**
   * Safely parses a numeric string to integer
   */
  static safeParseInt(value: string | undefined, defaultValue = 0): number {
    if (!value) return defaultValue;

    const parsed = parseInt(value, 10);

    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Safely parses a numeric string to float
   */
  static safeParseFloat(value: string | undefined, defaultValue = 0): number {
    if (!value) return defaultValue;

    const parsed = parseFloat(value);

    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Removes undefined values from object
   */
  static removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: any = {};

    Object.keys(obj).forEach((key) => {
      if (obj[key] !== undefined) {
        result[key] = obj[key];
      }
    });

    return result;
  }

  /**
   * Deep clones an object
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;

    if (obj instanceof Date) return new Date(obj.getTime()) as any;

    if (obj instanceof Array) {
      return obj.map((item) => TransformUtils.deepClone(item)) as any;
    }

    if (typeof obj === 'object') {
      const clonedObj = {} as any;

      Object.keys(obj).forEach((key) => {
        clonedObj[key] = TransformUtils.deepClone((obj as any)[key]);
      });

      return clonedObj;
    }

    return obj;
  }
}
