import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';
import { SubmissionTable } from './SubmissionTable';
import { EditModal } from './EditModal';

function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

function getUniqueDepartments(submissions) {
  const departments = new Set();
  submissions.forEach((s) => {
    if (s.department) {
      departments.add(s.department);
    }
  });
  return departments.size;
}

function getLatestSubmissionDate(submissions) {
  if (submissions.length === 0) return '—';
  let latest = null;
  submissions.forEach((s) => {
    if (s.submittedAt) {
      const d = new Date(s.submittedAt);
      if (!isNaN(d.getTime()) && (!latest || d > latest)) {
        latest = d;
      }
    }
  });
  if (!latest) return '—';
  return formatDate(latest.toISOString());
}

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const loadSubmissions = useCallback(() => {
    const data = getSubmissions();
    setSubmissions(data);
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleLogout = () => {
    sessionStorage.removeItem('hirehub_admin_auth');
    navigate('/');
  };

  const handleEdit = (submission) => {
    setEditingSubmission(submission);
  };

  const handleEditSave = (updated) => {
    try {
      updateSubmission(updated.id, {
        fullName: updated.fullName,
        mobile: updated.mobile,
        department: updated.department,
      });
      loadSubmissions();
      setEditingSubmission(null);
    } catch (err) {
      console.error('AdminDashboard: failed to update submission.', err);
    }
  };

  const handleEditClose = () => {
    setEditingSubmission(null);
  };

  const handleDeleteRequest = (id) => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deletingId) return;
    try {
      deleteSubmission(deletingId);
      loadSubmissions();
      setDeletingId(null);
    } catch (err) {
      console.error('AdminDashboard: failed to delete submission.', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingId(null);
  };

  const totalSubmissions = submissions.length;
  const uniqueDepartments = getUniqueDepartments(submissions);
  const latestSubmission = getLatestSubmissionDate(submissions);

  return (
    <div style={styles.page}>
      {/* Dashboard Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage onboarding submissions</p>
        </div>
        <button
          type="button"
          style={styles.logoutButton}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.borderColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
        >
          Logout
        </button>
      </div>

      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📋</div>
          <div>
            <p style={styles.statLabel}>Total Submissions</p>
            <p style={styles.statValue}>{totalSubmissions}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#ede9fe', color: '#7c3aed' }}>🏢</div>
          <div>
            <p style={styles.statLabel}>Departments</p>
            <p style={styles.statValue}>{uniqueDepartments}</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: '#dcfce7', color: '#16a34a' }}>🕒</div>
          <div>
            <p style={styles.statLabel}>Latest Submission</p>
            <p style={styles.statValueSmall}>{latestSubmission}</p>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>Submissions</h2>
          <span style={styles.tableCount}>{totalSubmissions} total</span>
        </div>
        <SubmissionTable
          submissions={submissions}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </div>

      {/* Edit Modal */}
      {editingSubmission && (
        <EditModal
          submission={editingSubmission}
          onSave={handleEditSave}
          onClose={handleEditClose}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div
          style={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleDeleteCancel();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm deletion"
        >
          <div style={styles.confirmDialog}>
            <div style={styles.confirmBody}>
              <div style={styles.confirmIcon}>⚠️</div>
              <h3 style={styles.confirmTitle}>Delete Submission</h3>
              <p style={styles.confirmMessage}>
                Are you sure you want to delete this submission? This action cannot be undone.
              </p>
            </div>
            <div style={styles.confirmFooter}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleDeleteCancel}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                style={styles.deleteButton}
                onClick={handleDeleteConfirm}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a1a2e',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
  },
  logoutButton: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    fontFamily: 'inherit',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    flexShrink: 0,
  },
  statLabel: {
    margin: '0 0 4px 0',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
  },
  statValue: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1.2',
  },
  statValueSmall: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    lineHeight: '1.4',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  tableTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
  },
  tableCount: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px',
  },
  confirmDialog: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
  },
  confirmBody: {
    padding: '32px 24px 20px',
  },
  confirmIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: '24px',
  },
  confirmTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
  },
  confirmMessage: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
  },
  confirmFooter: {
    display: 'flex',
    gap: '10px',
    padding: '20px 24px 28px',
    justifyContent: 'center',
  },
  cancelButton: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },
  deleteButton: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    fontFamily: 'inherit',
  },
};

export default AdminDashboard;