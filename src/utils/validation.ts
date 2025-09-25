/**
 * Validation utility functions
 * Common validation helpers used across the application
 */
export class ValidationUtils {
  /**
   * Validates email format
   * @param email Email to validate
   * @returns true if valid, false otherwise
   */
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

  /**
   * Validates UUID format
   * @param uuid UUID to validate
   * @returns true if valid, false otherwise
   */
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

  /**
   * Validates minimum length
   * @param value String to validate
   * @param minLength Minimum required length
   * @returns true if valid, false otherwise
   */
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

  /**
   * Validates that a value is within a specified range
   * @param value Number to validate
   * @param min Minimum value
   * @param max Maximum value
   * @returns true if valid, false otherwise
   */
  public static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }
}
