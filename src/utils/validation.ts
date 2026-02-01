export class ValidationUtils {
  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates username format (alphanumeric and underscore only)
   * @param username Username to validate
   * @returns true if valid, false otherwise
   */
  public static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  }

  public static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validates that a string is not empty or only whitespace
   * @param value String to validate
   * @returns true if valid, false otherwise
   */
  public static isNotEmpty(value: string): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }

  public static hasMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  /**
   * Validates maximum length
   * @param value String to validate
   * @param maxLength Maximum allowed length
   * @returns true if valid, false otherwise
   */
  public static hasMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  public static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }
}
