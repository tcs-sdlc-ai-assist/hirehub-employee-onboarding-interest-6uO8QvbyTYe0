/**
 * Validates a full name field.
 * @param {string} name - The name to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateName(name) {
  if (!name || name.trim().length === 0) {
    return 'Full name is required.';
  }
  if (!/^[A-Za-z\s]+$/.test(name.trim())) {
    return 'Full name must contain only alphabets and spaces.';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters.';
  }
  if (name.trim().length > 100) {
    return 'Full name must not exceed 100 characters.';
  }
  return '';
}

/**
 * Validates an email field.
 * @param {string} email - The email to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  if (email.trim().length > 254) {
    return 'Email must not exceed 254 characters.';
  }
  return '';
}

/**
 * Validates a mobile number field.
 * @param {string} mobile - The mobile number to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateMobile(mobile) {
  if (!mobile || mobile.trim().length === 0) {
    return 'Mobile number is required.';
  }
  if (!/^\d{10}$/.test(mobile.trim())) {
    return 'Mobile number must be exactly 10 digits.';
  }
  return '';
}

/**
 * Validates a department selection.
 * @param {string} department - The selected department value.
 * @returns {string} Error message or empty string if valid.
 */
export function validateDepartment(department) {
  if (!department || department.trim().length === 0) {
    return 'Please select a department.';
  }
  const allowedDepartments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
  ];
  if (!allowedDepartments.includes(department.trim())) {
    return 'Please select a valid department.';
  }
  return '';
}