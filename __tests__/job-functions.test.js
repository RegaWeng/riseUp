// Functions that might be useful in your job app
function formatJobTitle(title) {
  // Make the first letter uppercase and rest lowercase
  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
}

function calculateSalaryPerHour(weeklySalary, hoursPerWeek) {
  return weeklySalary / hoursPerWeek;
}

function isJobMatchingSkills(jobSkills, userSkills) {
  // Check if user has at least one skill that matches the job
  return jobSkills.some(skill => userSkills.includes(skill));
}

function filterJobsByLocation(jobs, location) {
  return jobs.filter(job => 
    job.location.toLowerCase().includes(location.toLowerCase())
  );
}

// Test these job-related functions
describe('Job App Functions', () => {
  
  describe('formatJobTitle', () => {
    test('should format job title correctly', () => {
      // Arrange
      const title = 'CASHIER';
      
      // Act
      const result = formatJobTitle(title);
      
      // Assert
      expect(result).toBe('Cashier');
    });

    test('should handle lowercase title', () => {
      // Arrange
      const title = 'delivery driver';
      
      // Act
      const result = formatJobTitle(title);
      
      // Assert
      expect(result).toBe('Delivery driver');
    });

    test('should handle single letter', () => {
      // Arrange
      const title = 'a';
      
      // Act
      const result = formatJobTitle(title);
      
      // Assert
      expect(result).toBe('A');
    });
  });

  describe('calculateSalaryPerHour', () => {
    test('should calculate hourly rate correctly', () => {
      // Arrange
      const weeklySalary = 600;
      const hoursPerWeek = 40;
      
      // Act
      const result = calculateSalaryPerHour(weeklySalary, hoursPerWeek);
      
      // Assert
      expect(result).toBe(15);
    });

    test('should handle part-time work', () => {
      // Arrange
      const weeklySalary = 300;
      const hoursPerWeek = 20;
      
      // Act
      const result = calculateSalaryPerHour(weeklySalary, hoursPerWeek);
      
      // Assert
      expect(result).toBe(15);
    });
  });

  describe('isJobMatchingSkills', () => {
    test('should return true when skills match', () => {
      // Arrange
      const jobSkills = ['customer service', 'cash handling', 'communication'];
      const userSkills = ['customer service', 'teamwork', 'problem solving'];
      
      // Act
      const result = isJobMatchingSkills(jobSkills, userSkills);
      
      // Assert
      expect(result).toBe(true);
    });

    test('should return false when no skills match', () => {
      // Arrange
      const jobSkills = ['driving', 'navigation'];
      const userSkills = ['cooking', 'cleaning'];
      
      // Act
      const result = isJobMatchingSkills(jobSkills, userSkills);
      
      // Assert
      expect(result).toBe(false);
    });
  });

  describe('filterJobsByLocation', () => {
    test('should filter jobs by location', () => {
      // Arrange
      const jobs = [
        { id: '1', title: 'Cashier', location: 'Downtown' },
        { id: '2', title: 'Driver', location: 'Uptown' },
        { id: '3', title: 'Cleaner', location: 'Downtown' }
      ];
      const location = 'downtown';
      
      // Act
      const result = filterJobsByLocation(jobs, location);
      
      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Cashier');
      expect(result[1].title).toBe('Cleaner');
    });

    test('should return empty array when no jobs match location', () => {
      // Arrange
      const jobs = [
        { id: '1', title: 'Cashier', location: 'Downtown' },
        { id: '2', title: 'Driver', location: 'Uptown' }
      ];
      const location = 'suburbs';
      
      // Act
      const result = filterJobsByLocation(jobs, location);
      
      // Assert
      expect(result).toHaveLength(0);
    });
  });
});

