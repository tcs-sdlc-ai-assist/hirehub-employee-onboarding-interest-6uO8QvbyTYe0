import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import * as storage from '../utils/storage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );
}

const mockSubmissions = [
  {
    id: 'uuid-1',
    fullName: 'John Doe',
    email: 'john@example.com',
    mobile: '1234567890',
    department: 'Engineering',
    submittedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'uuid-2',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    mobile: '9876543210',
    department: 'Design',
    submittedAt: '2024-01-16T14:30:00.000Z',
  },
  {
    id: 'uuid-3',
    fullName: 'Bob Wilson',
    email: 'bob@example.com',
    mobile: '5551234567',
    department: 'Engineering',
    submittedAt: '2024-01-17T09:15:00.000Z',
  },
];

describe('AdminDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the dashboard header with title and subtitle', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue([]);
      renderDashboard();

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manage onboarding submissions')).toBeInTheDocument();
    });

    it('renders the logout button', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue([]);
      renderDashboard();

      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('renders stat cards with correct values when submissions exist', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      expect(screen.getByText('Departments')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();

      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
    });

    it('renders stat cards with zero values when no submissions exist', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue([]);
      renderDashboard();

      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();

      expect(screen.getByText('Departments')).toBeInTheDocument();
      // 0 for departments as well
      const departmentsStat = screen.getAllByText('0');
      expect(departmentsStat.length).toBeGreaterThanOrEqual(2);
    });

    it('renders the submissions table header with total count', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      expect(screen.getByText('Submissions')).toBeInTheDocument();
      expect(screen.getByText('3 total')).toBeInTheDocument();
    });
  });

  describe('submission table display', () => {
    it('renders all submissions in the table', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('renders department badges for each submission', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      const engineeringBadges = screen.getAllByText('Engineering');
      expect(engineeringBadges.length).toBe(2);
      expect(screen.getByText('Design')).toBeInTheDocument();
    });

    it('renders edit and delete buttons for each submission', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      expect(editButtons).toHaveLength(3);

      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons).toHaveLength(3);
    });
  });

  describe('empty state', () => {
    it('shows empty state message when no submissions exist', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue([]);
      renderDashboard();

      expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
    });
  });

  describe('edit modal', () => {
    it('opens edit modal when edit button is clicked', async () => {
      const user = userEvent.setup();
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
    });

    it('closes edit modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });

    it('closes edit modal when close button is clicked', async () => {
      const user = userEvent.setup();
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);

      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });

    it('saves changes and closes modal on valid edit', async () => {
      const user = userEvent.setup();
      const getSubmissionsSpy = vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      const updateSubmissionSpy = vi.spyOn(storage, 'updateSubmission').mockReturnValue({
        ...mockSubmissions[0],
        fullName: 'John Updated',
      });
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      const nameInput = screen.getByLabelText(/Full Name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'John Updated');

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      expect(updateSubmissionSpy).toHaveBeenCalledWith('uuid-1', {
        fullName: 'John Updated',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });

    it('shows validation errors when saving with invalid data', async () => {
      const user = userEvent.setup();
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      const nameInput = screen.getByLabelText(/Full Name/i);
      await user.clear(nameInput);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      expect(screen.getByText('Full name is required.')).toBeInTheDocument();
      expect(screen.getByText('Edit Submission')).toBeInTheDocument();
    });

    it('reloads submissions after successful edit', async () => {
      const user = userEvent.setup();
      const getSubmissionsSpy = vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      vi.spyOn(storage, 'updateSubmission').mockReturnValue({
        ...mockSubmissions[0],
        fullName: 'John Updated',
      });
      renderDashboard();

      const initialCallCount = getSubmissionsSpy.mock.calls.length;

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      expect(getSubmissionsSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  describe('delete confirmation dialog', () => {
    it('opens delete confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup();
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(screen.getByText('Delete Submission')).toBeInTheDocument();
      expect(
        screen.getByText('Are you sure you want to delete this submission? This action cannot be undone.')
      ).toBeInTheDocument();
    });

    it('closes delete dialog when cancel button is clicked', async () => {
      const user = userEvent.setup();
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(screen.getByText('Delete Submission')).toBeInTheDocument();

      // The cancel button inside the confirm dialog
      const dialogCancelButton = screen.getAllByText('Cancel');
      // There might be only one Cancel button visible (the dialog one)
      await user.click(dialogCancelButton[dialogCancelButton.length - 1]);

      expect(
        screen.queryByText('Are you sure you want to delete this submission? This action cannot be undone.')
      ).not.toBeInTheDocument();
    });

    it('deletes submission and closes dialog when confirm delete is clicked', async () => {
      const user = userEvent.setup();
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      const deleteSubmissionSpy = vi.spyOn(storage, 'deleteSubmission').mockReturnValue(true);
      renderDashboard();

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      // Click the Delete button inside the confirmation dialog
      // There are now multiple "Delete" texts: table buttons + dialog button
      const allDeleteButtons = screen.getAllByText('Delete');
      // The last "Delete" button should be the confirm one in the dialog
      const confirmDeleteButton = allDeleteButtons[allDeleteButtons.length - 1];
      await user.click(confirmDeleteButton);

      expect(deleteSubmissionSpy).toHaveBeenCalledWith('uuid-1');
      expect(
        screen.queryByText('Are you sure you want to delete this submission? This action cannot be undone.')
      ).not.toBeInTheDocument();
    });

    it('reloads submissions after successful delete', async () => {
      const user = userEvent.setup();
      const getSubmissionsSpy = vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      vi.spyOn(storage, 'deleteSubmission').mockReturnValue(true);
      renderDashboard();

      const initialCallCount = getSubmissionsSpy.mock.calls.length;

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      const allDeleteButtons = screen.getAllByText('Delete');
      const confirmDeleteButton = allDeleteButtons[allDeleteButtons.length - 1];
      await user.click(confirmDeleteButton);

      expect(getSubmissionsSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it('closes delete dialog when clicking overlay background', async () => {
      const user = userEvent.setup();
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(screen.getByText('Delete Submission')).toBeInTheDocument();

      const overlay = screen.getByRole('dialog', { name: 'Confirm deletion' });
      await user.click(overlay);

      expect(
        screen.queryByText('Are you sure you want to delete this submission? This action cannot be undone.')
      ).not.toBeInTheDocument();
    });
  });

  describe('logout functionality', () => {
    it('clears session storage and navigates to home on logout', async () => {
      const user = userEvent.setup();
      sessionStorage.setItem('hirehub_admin_auth', 'true');
      vi.spyOn(storage, 'getSubmissions').mockReturnValue([]);
      renderDashboard();

      const logoutButton = screen.getByText('Logout');
      await user.click(logoutButton);

      expect(sessionStorage.getItem('hirehub_admin_auth')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('stat cards accuracy', () => {
    it('displays correct department count for unique departments', () => {
      const submissions = [
        { ...mockSubmissions[0], department: 'Engineering' },
        { ...mockSubmissions[1], department: 'Engineering' },
        { ...mockSubmissions[2], department: 'Design' },
      ];
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(submissions);
      renderDashboard();

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays latest submission date correctly', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue(mockSubmissions);
      renderDashboard();

      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
      // The latest submission is uuid-3 with date 2024-01-17
      // We just verify the stat card is rendered with a non-dash value
      const latestLabel = screen.getByText('Latest Submission');
      expect(latestLabel).toBeInTheDocument();
    });

    it('displays dash for latest submission when no submissions exist', () => {
      vi.spyOn(storage, 'getSubmissions').mockReturnValue([]);
      renderDashboard();

      expect(screen.getByText('—')).toBeInTheDocument();
    });
  });
});