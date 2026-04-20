import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment,
} from './validators';

describe('validateName', () => {
  it('returns empty string for a valid name', () => {
    expect(validateName('John Doe')).toBe('');
  });

  it('returns empty string for a valid single name with two characters', () => {
    expect(validateName('Jo')).toBe('');
  });

  it('returns empty string for a name with only spaces between words', () => {
    expect(validateName('Mary Jane Watson')).toBe('');
  });

  it('returns error when name is empty', () => {
    expect(validateName('')).toBe('Full name is required.');
  });

  it('returns error when name is undefined', () => {
    expect(validateName(undefined)).toBe('Full name is required.');
  });

  it('returns error when name is null', () => {
    expect(validateName(null)).toBe('Full name is required.');
  });

  it('returns error when name is only whitespace', () => {
    expect(validateName('   ')).toBe('Full name is required.');
  });

  it('returns error when name contains numbers', () => {
    expect(validateName('John123')).toBe('Full name must contain only alphabets and spaces.');
  });

  it('returns error when name contains special characters', () => {
    expect(validateName('John@Doe')).toBe('Full name must contain only alphabets and spaces.');
  });

  it('returns error when name contains hyphens', () => {
    expect(validateName('Mary-Jane')).toBe('Full name must contain only alphabets and spaces.');
  });

  it('returns error when name is only one character', () => {
    expect(validateName('J')).toBe('Full name must be at least 2 characters.');
  });

  it('returns error when name exceeds 100 characters', () => {
    const longName = 'A'.repeat(101);
    expect(validateName(longName)).toBe('Full name must not exceed 100 characters.');
  });

  it('returns empty string for a name exactly 100 characters', () => {
    const exactName = 'A'.repeat(100);
    expect(validateName(exactName)).toBe('');
  });
});

describe('validateEmail', () => {
  it('returns empty string for a valid email', () => {
    expect(validateEmail('john@example.com')).toBe('');
  });

  it('returns empty string for a valid email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe('');
  });

  it('returns error when email is empty', () => {
    expect(validateEmail('')).toBe('Email is required.');
  });

  it('returns error when email is undefined', () => {
    expect(validateEmail(undefined)).toBe('Email is required.');
  });

  it('returns error when email is null', () => {
    expect(validateEmail(null)).toBe('Email is required.');
  });

  it('returns error when email is only whitespace', () => {
    expect(validateEmail('   ')).toBe('Email is required.');
  });

  it('returns error for email without @ symbol', () => {
    expect(validateEmail('johnexample.com')).toBe('Please enter a valid email address.');
  });

  it('returns error for email without domain', () => {
    expect(validateEmail('john@')).toBe('Please enter a valid email address.');
  });

  it('returns error for email without local part', () => {
    expect(validateEmail('@example.com')).toBe('Please enter a valid email address.');
  });

  it('returns error for email without TLD', () => {
    expect(validateEmail('john@example')).toBe('Please enter a valid email address.');
  });

  it('returns error for email with spaces', () => {
    expect(validateEmail('john doe@example.com')).toBe('Please enter a valid email address.');
  });

  it('returns error when email exceeds 254 characters', () => {
    const longLocal = 'a'.repeat(243);
    const longEmail = `${longLocal}@example.com`;
    expect(longEmail.length).toBeGreaterThan(254);
    expect(validateEmail(longEmail)).toBe('Email must not exceed 254 characters.');
  });
});

describe('validateMobile', () => {
  it('returns empty string for a valid 10-digit mobile number', () => {
    expect(validateMobile('9876543210')).toBe('');
  });

  it('returns error when mobile is empty', () => {
    expect(validateMobile('')).toBe('Mobile number is required.');
  });

  it('returns error when mobile is undefined', () => {
    expect(validateMobile(undefined)).toBe('Mobile number is required.');
  });

  it('returns error when mobile is null', () => {
    expect(validateMobile(null)).toBe('Mobile number is required.');
  });

  it('returns error when mobile is only whitespace', () => {
    expect(validateMobile('   ')).toBe('Mobile number is required.');
  });

  it('returns error when mobile is too short (less than 10 digits)', () => {
    expect(validateMobile('12345')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile is too long (more than 10 digits)', () => {
    expect(validateMobile('12345678901')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile contains non-numeric characters', () => {
    expect(validateMobile('98765abcde')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile contains special characters', () => {
    expect(validateMobile('987-654-32')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile contains spaces', () => {
    expect(validateMobile('987 654 321')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile has leading plus sign', () => {
    expect(validateMobile('+9876543210')).toBe('Mobile number must be exactly 10 digits.');
  });
});

describe('validateDepartment', () => {
  it('returns empty string for a valid department - Engineering', () => {
    expect(validateDepartment('Engineering')).toBe('');
  });

  it('returns empty string for a valid department - Design', () => {
    expect(validateDepartment('Design')).toBe('');
  });

  it('returns empty string for a valid department - Marketing', () => {
    expect(validateDepartment('Marketing')).toBe('');
  });

  it('returns empty string for a valid department - Sales', () => {
    expect(validateDepartment('Sales')).toBe('');
  });

  it('returns empty string for a valid department - Human Resources', () => {
    expect(validateDepartment('Human Resources')).toBe('');
  });

  it('returns empty string for a valid department - Finance', () => {
    expect(validateDepartment('Finance')).toBe('');
  });

  it('returns empty string for a valid department - Operations', () => {
    expect(validateDepartment('Operations')).toBe('');
  });

  it('returns empty string for a valid department - Product', () => {
    expect(validateDepartment('Product')).toBe('');
  });

  it('returns error when department is empty', () => {
    expect(validateDepartment('')).toBe('Please select a department.');
  });

  it('returns error when department is undefined', () => {
    expect(validateDepartment(undefined)).toBe('Please select a department.');
  });

  it('returns error when department is null', () => {
    expect(validateDepartment(null)).toBe('Please select a department.');
  });

  it('returns error when department is only whitespace', () => {
    expect(validateDepartment('   ')).toBe('Please select a department.');
  });

  it('returns error for an invalid department value', () => {
    expect(validateDepartment('Legal')).toBe('Please select a valid department.');
  });

  it('returns error for a department with wrong casing', () => {
    expect(validateDepartment('engineering')).toBe('Please select a valid department.');
  });
});