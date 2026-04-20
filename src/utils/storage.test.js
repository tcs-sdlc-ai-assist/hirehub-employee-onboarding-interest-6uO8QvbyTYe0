import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSubmissions,
  saveSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  isEmailDuplicate,
} from './storage';

const STORAGE_KEY = 'hirehub_submissions';

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getSubmissions', () => {
    it('returns an empty array when localStorage has no data', () => {
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns parsed submissions when localStorage has valid data', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2024-01-15T10:00:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));

      const result = getSubmissions();
      expect(result).toEqual(submissions);
      expect(result).toHaveLength(1);
    });

    it('returns an empty array and resets localStorage when data is corrupted JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{not valid json!!!');

      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
    });

    it('returns an empty array and resets localStorage when data is not an array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));

      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
    });

    it('returns an empty array when localStorage value is a string instead of array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify('just a string'));

      const result = getSubmissions();
      expect(result).toEqual([]);
    });
  });

  describe('saveSubmissions', () => {
    it('saves submissions array to localStorage', () => {
      const submissions = [
        {
          id: 'test-1',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          mobile: '9876543210',
          department: 'Design',
          submittedAt: '2024-01-15T12:00:00.000Z',
        },
      ];

      saveSubmissions(submissions);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toEqual(submissions);
    });

    it('saves an empty array to localStorage', () => {
      saveSubmissions([]);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toEqual([]);
    });

    it('overwrites existing data in localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 'old' }]));

      const newSubmissions = [{ id: 'new-1' }, { id: 'new-2' }];
      saveSubmissions(newSubmissions);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toEqual(newSubmissions);
      expect(stored).toHaveLength(2);
    });
  });

  describe('addSubmission', () => {
    it('adds a new submission with a generated UUID and timestamp', () => {
      const input = {
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        mobile: '5551234567',
        department: 'Marketing',
      };

      const result = addSubmission(input);

      expect(result).toHaveProperty('id');
      expect(typeof result.id).toBe('string');
      expect(result.id.length).toBeGreaterThan(0);
      expect(result.fullName).toBe('Alice Johnson');
      expect(result.email).toBe('alice@example.com');
      expect(result.mobile).toBe('5551234567');
      expect(result.department).toBe('Marketing');
      expect(result).toHaveProperty('submittedAt');
      expect(new Date(result.submittedAt).toString()).not.toBe('Invalid Date');
    });

    it('persists the new submission to localStorage', () => {
      const input = {
        fullName: 'Bob Brown',
        email: 'bob@example.com',
        mobile: '5559876543',
        department: 'Sales',
      };

      addSubmission(input);

      const stored = getSubmissions();
      expect(stored).toHaveLength(1);
      expect(stored[0].fullName).toBe('Bob Brown');
    });

    it('appends to existing submissions without overwriting', () => {
      addSubmission({
        fullName: 'First User',
        email: 'first@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      addSubmission({
        fullName: 'Second User',
        email: 'second@example.com',
        mobile: '2222222222',
        department: 'Design',
      });

      const stored = getSubmissions();
      expect(stored).toHaveLength(2);
      expect(stored[0].fullName).toBe('First User');
      expect(stored[1].fullName).toBe('Second User');
    });

    it('generates unique IDs for each submission', () => {
      const first = addSubmission({
        fullName: 'User A',
        email: 'a@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      const second = addSubmission({
        fullName: 'User B',
        email: 'b@example.com',
        mobile: '2222222222',
        department: 'Design',
      });

      expect(first.id).not.toBe(second.id);
    });
  });

  describe('updateSubmission', () => {
    it('updates an existing submission by ID', () => {
      const added = addSubmission({
        fullName: 'Original Name',
        email: 'original@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const updated = updateSubmission(added.id, {
        fullName: 'Updated Name',
        department: 'Design',
      });

      expect(updated).not.toBeNull();
      expect(updated.fullName).toBe('Updated Name');
      expect(updated.department).toBe('Design');
      expect(updated.email).toBe('original@example.com');
      expect(updated.id).toBe(added.id);
    });

    it('persists the update to localStorage', () => {
      const added = addSubmission({
        fullName: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      updateSubmission(added.id, { fullName: 'Changed Name' });

      const stored = getSubmissions();
      expect(stored[0].fullName).toBe('Changed Name');
    });

    it('returns null when submission ID is not found', () => {
      addSubmission({
        fullName: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const result = updateSubmission('nonexistent-id', { fullName: 'Nope' });
      expect(result).toBeNull();
    });

    it('does not modify other submissions when updating one', () => {
      const first = addSubmission({
        fullName: 'First',
        email: 'first@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      const second = addSubmission({
        fullName: 'Second',
        email: 'second@example.com',
        mobile: '2222222222',
        department: 'Design',
      });

      updateSubmission(second.id, { fullName: 'Second Updated' });

      const stored = getSubmissions();
      expect(stored[0].fullName).toBe('First');
      expect(stored[0].id).toBe(first.id);
      expect(stored[1].fullName).toBe('Second Updated');
    });
  });

  describe('deleteSubmission', () => {
    it('deletes a submission by ID and returns true', () => {
      const added = addSubmission({
        fullName: 'To Delete',
        email: 'delete@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const result = deleteSubmission(added.id);
      expect(result).toBe(true);

      const stored = getSubmissions();
      expect(stored).toHaveLength(0);
    });

    it('returns false when submission ID is not found', () => {
      addSubmission({
        fullName: 'Existing',
        email: 'existing@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const result = deleteSubmission('nonexistent-id');
      expect(result).toBe(false);

      const stored = getSubmissions();
      expect(stored).toHaveLength(1);
    });

    it('only removes the targeted submission and keeps others', () => {
      const first = addSubmission({
        fullName: 'Keep Me',
        email: 'keep@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      const second = addSubmission({
        fullName: 'Delete Me',
        email: 'deleteme@example.com',
        mobile: '2222222222',
        department: 'Design',
      });

      deleteSubmission(second.id);

      const stored = getSubmissions();
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(first.id);
      expect(stored[0].fullName).toBe('Keep Me');
    });

    it('persists the deletion to localStorage', () => {
      const added = addSubmission({
        fullName: 'Will Be Gone',
        email: 'gone@example.com',
        mobile: '1234567890',
        department: 'Sales',
      });

      deleteSubmission(added.id);

      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw);
      expect(parsed).toHaveLength(0);
    });
  });

  describe('isEmailDuplicate', () => {
    it('returns false when no submissions exist', () => {
      const result = isEmailDuplicate('new@example.com');
      expect(result).toBe(false);
    });

    it('returns true when email already exists', () => {
      addSubmission({
        fullName: 'Existing User',
        email: 'existing@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const result = isEmailDuplicate('existing@example.com');
      expect(result).toBe(true);
    });

    it('performs case-insensitive email comparison', () => {
      addSubmission({
        fullName: 'Test User',
        email: 'Test@Example.COM',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(isEmailDuplicate('test@example.com')).toBe(true);
      expect(isEmailDuplicate('TEST@EXAMPLE.COM')).toBe(true);
    });

    it('returns false when email does not exist', () => {
      addSubmission({
        fullName: 'Other User',
        email: 'other@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const result = isEmailDuplicate('different@example.com');
      expect(result).toBe(false);
    });

    it('excludes a specific submission ID from the duplicate check', () => {
      const added = addSubmission({
        fullName: 'Self User',
        email: 'self@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      const result = isEmailDuplicate('self@example.com', added.id);
      expect(result).toBe(false);
    });

    it('still detects duplicates when excludeId does not match the duplicate', () => {
      const first = addSubmission({
        fullName: 'First',
        email: 'duplicate@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });

      const second = addSubmission({
        fullName: 'Second',
        email: 'unique@example.com',
        mobile: '2222222222',
        department: 'Design',
      });

      const result = isEmailDuplicate('duplicate@example.com', second.id);
      expect(result).toBe(true);
    });

    it('handles emails with leading and trailing whitespace', () => {
      addSubmission({
        fullName: 'Whitespace User',
        email: 'whitespace@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(isEmailDuplicate('  whitespace@example.com  ')).toBe(true);
    });
  });
});