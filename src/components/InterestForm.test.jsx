import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { InterestForm } from './InterestForm';
import * as storage from '../utils/storage';

function renderInterestForm() {
  return render(
    <MemoryRouter>
      <InterestForm />
    </MemoryRouter>
  );
}

describe('InterestForm', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the form title and subtitle', () => {
      renderInterestForm();

      expect(screen.getByText('New Hire Interest Form')).toBeInTheDocument();
      expect(
        screen.getByText('Fill out the form below to express your interest in joining our team.')
      ).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      renderInterestForm();

      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderInterestForm();

      expect(screen.getByRole('button', { name: /Submit Interest Form/i })).toBeInTheDocument();
    });

    it('renders the Back to Home link', () => {
      renderInterestForm();

      const backLink = screen.getByText('← Back to Home');
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('renders department select with placeholder option', () => {
      renderInterestForm();

      const select = screen.getByLabelText(/Department/i);
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Select a department')).toBeInTheDocument();
    });
  });

  describe('validation errors', () => {
    it('shows validation errors when submitting empty form', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(screen.getByText('Full name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Mobile number is required.')).toBeInTheDocument();
      expect(screen.getByText('Please select a department.')).toBeInTheDocument();
    });

    it('shows error for invalid name with numbers', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/i), 'John123');
      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(screen.getByText('Full name must contain only alphabets and spaces.')).toBeInTheDocument();
    });

    it('shows error for name with only one character', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/i), 'J');
      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(screen.getByText('Full name must be at least 2 characters.')).toBeInTheDocument();
    });

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Email/i), 'notanemail');
      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });

    it('shows error for mobile number with less than 10 digits', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Mobile Number/i), '12345');
      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(screen.getByText('Mobile number must be exactly 10 digits.')).toBeInTheDocument();
    });

    it('shows error for mobile number with non-numeric characters', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Mobile Number/i), '98765abcde');
      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(screen.getByText('Mobile number must be exactly 10 digits.')).toBeInTheDocument();
    });

    it('clears field error when user starts typing in that field', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));
      expect(screen.getByText('Full name is required.')).toBeInTheDocument();

      await user.type(screen.getByLabelText(/Full Name/i), 'J');
      expect(screen.queryByText('Full name is required.')).not.toBeInTheDocument();
    });
  });

  describe('duplicate email error', () => {
    it('shows duplicate email error when email already exists', async () => {
      const user = userEvent.setup();

      storage.addSubmission({
        fullName: 'Existing User',
        email: 'existing@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(screen.getByText('This email has already been submitted.')).toBeInTheDocument();
    });

    it('shows duplicate email error for case-insensitive match', async () => {
      const user = userEvent.setup();

      storage.addSubmission({
        fullName: 'Existing User',
        email: 'Test@Example.COM',
        mobile: '1234567890',
        department: 'Engineering',
      });

      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department/i), 'Design');

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(screen.getByText('This email has already been submitted.')).toBeInTheDocument();
    });
  });

  describe('successful submission', () => {
    it('shows success banner after valid submission', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(
        screen.getByText('Your interest form has been submitted successfully!')
      ).toBeInTheDocument();
    });

    it('resets form fields after successful submission', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const mobileInput = screen.getByLabelText(/Mobile Number/i);
      const departmentSelect = screen.getByLabelText(/Department/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(mobileInput, '9876543210');
      await user.selectOptions(departmentSelect, 'Engineering');

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(mobileInput).toHaveValue('');
      expect(departmentSelect).toHaveValue('');
    });

    it('persists submission to localStorage', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/Email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '5551234567');
      await user.selectOptions(screen.getByLabelText(/Department/i), 'Design');

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      const submissions = storage.getSubmissions();
      expect(submissions).toHaveLength(1);
      expect(submissions[0].fullName).toBe('Jane Smith');
      expect(submissions[0].email).toBe('jane@example.com');
      expect(submissions[0].mobile).toBe('5551234567');
      expect(submissions[0].department).toBe('Design');
    });

    it('clears validation errors after successful submission', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      // First submit with empty form to trigger errors
      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));
      expect(screen.getByText('Full name is required.')).toBeInTheDocument();

      // Now fill in valid data and submit
      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department/i), 'Marketing');

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(screen.queryByText('Full name is required.')).not.toBeInTheDocument();
      expect(screen.queryByText('Email is required.')).not.toBeInTheDocument();
      expect(screen.queryByText('Mobile number is required.')).not.toBeInTheDocument();
      expect(screen.queryByText('Please select a department.')).not.toBeInTheDocument();
    });
  });

  describe('success banner auto-dismiss', () => {
    it('auto-dismisses success banner after timeout', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(
        screen.getByText('Your interest form has been submitted successfully!')
      ).toBeInTheDocument();

      vi.advanceTimersByTime(4000);

      await waitFor(() => {
        expect(
          screen.queryByText('Your interest form has been submitted successfully!')
        ).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe('storage error handling', () => {
    it('shows error when storage fails to save', async () => {
      const user = userEvent.setup();
      vi.spyOn(storage, 'addSubmission').mockImplementation(() => {
        throw new Error('Storage full');
      });

      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/i), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /Submit Interest Form/i }));

      expect(
        screen.getByText('Unable to save your submission. Please try again.')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Your interest form has been submitted successfully!')
      ).not.toBeInTheDocument();
    });
  });
});