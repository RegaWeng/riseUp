module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.(js|jsx|ts|tsx)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
