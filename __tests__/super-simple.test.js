// This is a very simple function we want to test
function addTwoNumbers(a, b) {
  return a + b;
}

function multiplyTwoNumbers(a, b) {
  return a * b;
}

function isEven(number) {
  return number % 2 === 0;
}

// Now let's test these functions!
describe('Super Simple Math Tests', () => {
  
  // Test 1: Testing addition
  test('should add two numbers correctly', () => {
    // Arrange: Prepare your test data
    const firstNumber = 5;
    const secondNumber = 3;
    
    // Act: Call the function you want to test
    const result = addTwoNumbers(firstNumber, secondNumber);
    
    // Assert: Check if the result is what you expect
    expect(result).toBe(8);
  });

  // Test 2: Testing multiplication
  test('should multiply two numbers correctly', () => {
    // Arrange
    const firstNumber = 4;
    const secondNumber = 6;
    
    // Act
    const result = multiplyTwoNumbers(firstNumber, secondNumber);
    
    // Assert
    expect(result).toBe(24);
  });

  // Test 3: Testing if a number is even
  test('should return true for even numbers', () => {
    // Arrange
    const evenNumber = 10;
    
    // Act
    const result = isEven(evenNumber);
    
    // Assert
    expect(result).toBe(true);
  });

  test('should return false for odd numbers', () => {
    // Arrange
    const oddNumber = 7;
    
    // Act
    const result = isEven(oddNumber);
    
    // Assert
    expect(result).toBe(false);
  });

  // Test 4: Testing edge cases
  test('should handle zero correctly', () => {
    // Arrange
    const zero = 0;
    
    // Act
    const result = isEven(zero);
    
    // Assert
    expect(result).toBe(true); // 0 is even!
  });
});
