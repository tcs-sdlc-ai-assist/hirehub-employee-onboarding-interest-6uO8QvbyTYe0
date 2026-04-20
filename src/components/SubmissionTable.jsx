import React from 'react';
import PropTypes from 'prop-types';

const DEPARTMENT_COLORS = {
  Engineering: { background: '#dbeafe', color: '#1e40af' },
  Design: { background: '#fce7f3', color: '#9d174d' },
  Marketing: { background: '#d1fae5', color: '#065f46' },
  'Human Resources': { background: '#fef3c7', color: '#92400e' },
  Sales: { background: '#ede9fe', color: '#5b21b6' },
  Finance: { background: '#ffedd5', color: '#9a3412' },
  Operations: { background: '#e0e7ff', color: '#3730a3' },
};

function getDepartmentBadgeStyle(department) {
  const colors = DEPARTMENT_COLORS[department] || { background: '#f3f4f6', color: '#374151' };
  return {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '9999px',
    fontSize: '0.85em',
    fontWeight: 600,
    background: colors.background,
    color: colors.color,
    whiteSpace: 'nowrap',
  };
}

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

const tableWrapperStyle = {
  overflowX: 'auto',
  width: '100%',
  WebkitOverflowScrolling: 'touch',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '700px',
  fontSize: '0.95rem',
};

const thStyle = {
  textAlign: 'left',
  padding: '12px 14px',
  borderBottom: '2px solid #e5e7eb',
  background: '#f9fafb',
  color: '#374151',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '10px 14px',
  borderBottom: '1px solid #f3f4f6',
  color: '#1f2937',
  verticalAlign: 'middle',
};

const actionBtnBase = {
  border: 'none',
  borderRadius: '6px',
  padding: '6px 14px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.88em',
  marginRight: '6px',
  transition: 'background 0.15s, opacity 0.15s',
};

const editBtnStyle = {
  ...actionBtnBase,
  background: '#2563eb',
  color: '#fff',
};

const deleteBtnStyle = {
  ...actionBtnBase,
  background: '#ef4444',
  color: '#fff',
  marginRight: 0,
};

const emptyStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  color: '#6b7280',
  fontSize: '1.1rem',
};

export function SubmissionTable({ submissions, onEdit, onDelete }) {
  if (!submissions || submissions.length === 0) {
    return <div style={emptyStyle}>No submissions yet.</div>;
  }

  return (
    <div style={tableWrapperStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Mobile</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Submitted At</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr
              key={submission.id}
              style={{
                background: index % 2 === 0 ? '#fff' : '#f9fafb',
              }}
            >
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{submission.fullName}</td>
              <td style={tdStyle}>{submission.email}</td>
              <td style={tdStyle}>{submission.mobile}</td>
              <td style={tdStyle}>
                <span style={getDepartmentBadgeStyle(submission.department)}>
                  {submission.department}
                </span>
              </td>
              <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                {formatDate(submission.submittedAt)}
              </td>
              <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                <button
                  style={editBtnStyle}
                  onClick={() => onEdit(submission)}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  aria-label={`Edit ${submission.fullName}`}
                  type="button"
                >
                  Edit
                </button>
                <button
                  style={deleteBtnStyle}
                  onClick={() => onDelete(submission.id)}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  aria-label={`Delete ${submission.fullName}`}
                  type="button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      submittedAt: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SubmissionTable;