// Validation utilities for forms

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { isValid: false, message: 'Password must contain at least one letter and one number' };
  }
  
  return { isValid: true };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }
  
  // Check for valid name characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};

// Job title validation
export const validateJobTitle = (title: string): ValidationResult => {
  if (!title.trim()) {
    return { isValid: false, message: 'Job title is required' };
  }
  
  if (title.trim().length < 3) {
    return { isValid: false, message: 'Job title must be at least 3 characters' };
  }
  
  return { isValid: true };
};

// Location validation
export const validateLocation = (location: string): ValidationResult => {
  if (!location.trim()) {
    return { isValid: false, message: 'Location is required' };
  }
  
  if (location.trim().length < 2) {
    return { isValid: false, message: 'Location must be at least 2 characters' };
  }
  
  return { isValid: true };
};

// Salary validation
export const validateSalary = (salary: string): ValidationResult => {
  if (!salary.trim()) {
    return { isValid: false, message: 'Salary is required' };
  }
  
  // Check if it's a valid number or contains common salary formats
  const salaryRegex = /^[\d,.\s]+$/;
  if (!salaryRegex.test(salary)) {
    return { isValid: false, message: 'Please enter a valid salary amount' };
  }
  
  return { isValid: true };
};

// Auto-correct common email typos
export const autoCorrectEmail = (email: string): string => {
  let corrected = email.toLowerCase().trim();
  
  // Common domain corrections
  const domainCorrections: { [key: string]: string } = {
    'gmail.co': 'gmail.com',
    'gmail.cm': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'yahoo.co': 'yahoo.com',
    'yahoo.cm': 'yahoo.com',
    'hotmail.co': 'hotmail.com',
    'hotmail.cm': 'hotmail.com',
    'outlook.co': 'outlook.com',
    'outlook.cm': 'outlook.com',
  };
  
  // Apply domain corrections
  Object.entries(domainCorrections).forEach(([wrong, correct]) => {
    if (corrected.endsWith(wrong)) {
      corrected = corrected.replace(wrong, correct);
    }
  });
  
  return corrected;
};

// Auto-correct common name typos
export const autoCorrectName = (name: string): string => {
  let corrected = name.trim();
  
  // Capitalize first letter of each word
  corrected = corrected.replace(/\b\w/g, (char) => char.toUpperCase());
  
  // Fix common name typos
  const nameCorrections: { [key: string]: string } = {
    'jon': 'John',
    'mike': 'Mike',
    'dave': 'Dave',
    'steve': 'Steve',
    'chris': 'Chris',
    'alex': 'Alex',
    'sam': 'Sam',
    'tom': 'Tom',
    'bob': 'Bob',
    'jim': 'Jim',
  };
  
  // Apply name corrections (case-insensitive)
  Object.entries(nameCorrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, correct);
  });
  
  return corrected;
};

