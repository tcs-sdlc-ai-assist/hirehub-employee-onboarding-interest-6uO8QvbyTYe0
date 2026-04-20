const STORAGE_KEY = 'hirehub_submissions';

/**
 * Generates a UUID string for submission IDs.
 * Uses crypto.randomUUID() if available, otherwise falls back to a manual implementation.
 * @returns {string} A UUID string
 */
function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retrieves all submissions from localStorage.
 * Gracefully handles JSON parse errors by resetting to an empty array.
 * @returns {Array<Object>} Array of submission objects
 */
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.error('storage.js: submissions data is not an array, resetting to empty.');
      saveSubmissions([]);
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('storage.js: failed to parse submissions from localStorage, resetting to empty.', error);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (writeError) {
      console.error('storage.js: failed to reset localStorage.', writeError);
    }
    return [];
  }
}

/**
 * Saves the full submissions array to localStorage.
 * @param {Array<Object>} submissions - The array of submission objects to persist
 */
export function saveSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error('storage.js: failed to save submissions to localStorage.', error);
  }
}

/**
 * Adds a new submission to localStorage with a generated UUID and timestamp.
 * @param {Object} submission - The submission data (fullName, email, mobile, department)
 * @returns {Object} The complete submission object with id and submittedAt
 */
export function addSubmission(submission) {
  const submissions = getSubmissions();
  const newSubmission = {
    id: generateUUID(),
    fullName: submission.fullName,
    email: submission.email,
    mobile: submission.mobile,
    department: submission.department,
    submittedAt: new Date().toISOString(),
  };
  submissions.push(newSubmission);
  saveSubmissions(submissions);
  return newSubmission;
}

/**
 * Updates an existing submission by ID with the provided updates.
 * @param {string} id - The UUID of the submission to update
 * @param {Object} updates - An object containing the fields to update
 * @returns {Object|null} The updated submission object, or null if not found
 */
export function updateSubmission(id, updates) {
  const submissions = getSubmissions();
  const index = submissions.findIndex(function (s) {
    return s.id === id;
  });
  if (index === -1) {
    console.error('storage.js: submission not found for id:', id);
    return null;
  }
  submissions[index] = { ...submissions[index], ...updates };
  saveSubmissions(submissions);
  return submissions[index];
}

/**
 * Deletes a submission by ID from localStorage.
 * @param {string} id - The UUID of the submission to delete
 * @returns {boolean} True if the submission was found and deleted, false otherwise
 */
export function deleteSubmission(id) {
  const submissions = getSubmissions();
  const filtered = submissions.filter(function (s) {
    return s.id !== id;
  });
  if (filtered.length === submissions.length) {
    console.error('storage.js: submission not found for deletion, id:', id);
    return false;
  }
  saveSubmissions(filtered);
  return true;
}

/**
 * Checks if an email already exists in the submissions.
 * Optionally excludes a specific submission by ID (useful for edit scenarios).
 * @param {string} email - The email address to check
 * @param {string} [excludeId] - Optional submission ID to exclude from the check
 * @returns {boolean} True if a duplicate email exists, false otherwise
 */
export function isEmailDuplicate(email, excludeId) {
  const submissions = getSubmissions();
  const normalizedEmail = email.toLowerCase().trim();
  return submissions.some(function (s) {
    if (excludeId && s.id === excludeId) {
      return false;
    }
    return s.email.toLowerCase().trim() === normalizedEmail;
  });
}