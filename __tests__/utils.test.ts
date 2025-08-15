// This is a simple utility function we'll test
export const addNumbers = (a: number, b: number): number => {
  return a + b;
};

export const formatJobTitle = (title: string): string => {
  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
};

// Test suite for utility functions
describe('Utility Functions', () => {
  // Test group for addNumbers function
  describe('addNumbers', () => {
    // Individual test case
    test('should add two positive numbers correctly', () => {
      // Arrange: Set up your test data
      const num1 = 5;
      const num2 = 3;
      
      // Act: Call the function you're testing
      const result = addNumbers(num1, num2);
      
      // Assert: Check if the result is what you expect
      expect(result).toBe(8);
    });

    test('should handle negative numbers', () => {
      // Arrange
      const num1 = -5;
      const num2 = 3;
      
      // Act
      const result = addNumbers(num1, num2);
      
      // Assert
      expect(result).toBe(-2);
    });

    test('should handle zero', () => {
      // Arrange
      const num1 = 0;
      const num2 = 10;
      
      // Act
      const result = addNumbers(num1, num2);
      
      // Assert
      expect(result).toBe(10);
    });
  });

  // Test group for formatJobTitle function
  describe('formatJobTitle', () => {
    test('should capitalize first letter and lowercase rest', () => {
      // Arrange
      const title = 'CASHIER';
      
      // Act
      const result = formatJobTitle(title);
      
      // Assert
      expect(result).toBe('Cashier');
    });

    test('should handle single character', () => {
      // Arrange
      const title = 'a';
      
      // Act
      const result = formatJobTitle(title);
      
      // Assert
      expect(result).toBe('A');
    });

    test('should handle empty string', () => {
      // Arrange
      const title = '';
      
      // Act
      const result = formatJobTitle(title);
      
      // Assert
      expect(result).toBe('');
    });
  });
});
