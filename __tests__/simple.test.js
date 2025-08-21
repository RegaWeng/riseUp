// Simple test to verify Jest is working
describe('Basic Math', () => {
  test('should add two numbers correctly', () => {
    // Arrange
    const a = 2;
    const b = 3;
    
    // Act
    const result = a + b;
    
    // Assert
    expect(result).toBe(5);
  });

  test('should multiply two numbers correctly', () => {
    // Arrange
    const a = 4;
    const b = 5;
    
    // Act
    const result = a * b;
    
    // Assert
    expect(result).toBe(20);
  });

  test('should handle string concatenation', () => {
    // Arrange
    const firstName = 'John';
    const lastName = 'Doe';
    
    // Act
    const fullName = firstName + ' ' + lastName;
    
    // Assert
    expect(fullName).toBe('John Doe');
  });
});

