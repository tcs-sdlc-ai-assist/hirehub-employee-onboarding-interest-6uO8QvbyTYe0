import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { validateName, validateMobile, validateDepartment } from '../utils/validators';

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
];

export function EditModal({ submission, onSave, onClose }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [department, setDepartment] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (submission) {
      setFullName(submission.fullName || '');
      setEmail(submission.email || '');
      setMobile(submission.mobile || '');
      setDepartment(submission.department || '');
      setErrors({});
    }
  }, [submission]);

  const validate = useCallback(() => {
    const newErrors = {};

    const nameError = validateName(fullName);
    if (nameError) {
      newErrors.fullName = nameError;
    }

    const mobileError = validateMobile(mobile);
    if (mobileError) {
      newErrors.mobile = mobileError;
    }

    const departmentError = validateDepartment(department);
    if (departmentError) {
      newErrors.department = departmentError;
    }

    return newErrors;
  }, [fullName, mobile, department]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave({
      id: submission.id,
      fullName: fullName.trim(),
      email: submission.email,
      mobile: mobile.trim(),
      department: department.trim(),
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!submission) {
    return null;
  }

  return (
    <div style={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Edit Submission">
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Submission</h2>
          <button
            type="button"
            style={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.body}>
            <div style={styles.fieldGroup}>
              <label htmlFor="edit-fullName" style={styles.label}>
                Full Name <span style={styles.required}>*</span>
              </label>
              <input
                id="edit-fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  ...styles.input,
                  ...(errors.fullName ? styles.inputError : {}),
                }}
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <p style={styles.errorText}>{errors.fullName}</p>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="edit-email" style={styles.label}>
                Email
              </label>
              <input
                id="edit-email"
                type="email"
                value={email}
                readOnly
                style={{ ...styles.input, ...styles.inputReadOnly }}
                tabIndex={-1}
              />
              <p style={styles.hintText}>Email cannot be changed.</p>
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="edit-mobile" style={styles.label}>
                Mobile Number <span style={styles.required}>*</span>
              </label>
              <input
                id="edit-mobile"
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                style={{
                  ...styles.input,
                  ...(errors.mobile ? styles.inputError : {}),
                }}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
              />
              {errors.mobile && (
                <p style={styles.errorText}>{errors.mobile}</p>
              )}
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="edit-department" style={styles.label}>
                Department <span style={styles.required}>*</span>
              </label>
              <select
                id="edit-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  ...styles.input,
                  ...(errors.department ? styles.inputError : {}),
                }}
              >
                <option value="">Select a department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p style={styles.errorText}>{errors.department}</p>
              )}
            </div>
          </div>

          <div style={styles.footer}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onClose}
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
              type="submit"
              style={styles.saveButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4338ca';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4f46e5';
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    submittedAt: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

EditModal.defaultProps = {
  submission: null,
};

const styles = {
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
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    lineHeight: 1,
    transition: 'all 0.15s ease',
  },
  body: {
    padding: '24px',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#dc2626',
    marginLeft: '2px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    fontFamily: 'inherit',
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#dc2626',
    boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
  },
  inputReadOnly: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    cursor: 'not-allowed',
  },
  errorText: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#dc2626',
  },
  hintText: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#9ca3af',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
  },
  cancelButton: {
    padding: '10px 20px',
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
  saveButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4f46e5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    fontFamily: 'inherit',
  },
};

export default EditModal;