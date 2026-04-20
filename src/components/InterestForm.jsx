import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { validateName, validateEmail, validateMobile, validateDepartment } from '../utils/validators';
import { addSubmission, isEmailDuplicate } from '../utils/storage';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
];

const initialFormState = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

const initialErrorState = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

export function InterestForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [successMessage, setSuccessMessage] = useState('');
  const successTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile),
      department: validateDepartment(formData.department),
    };

    if (!newErrors.email && isEmailDuplicate(formData.email.trim())) {
      newErrors.email = 'This email has already been submitted.';
    }

    setErrors(newErrors);

    return !newErrors.fullName && !newErrors.email && !newErrors.mobile && !newErrors.department;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      addSubmission({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        department: formData.department.trim(),
      });
    } catch (err) {
      console.error('InterestForm: failed to save submission.', err);
      setErrors((prev) => ({
        ...prev,
        fullName: 'Unable to save your submission. Please try again.',
      }));
      return;
    }

    setFormData(initialFormState);
    setErrors(initialErrorState);
    setSuccessMessage('Your interest form has been submitted successfully!');

    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
    successTimerRef.current = setTimeout(() => {
      setSuccessMessage('');
      successTimerRef.current = null;
    }, 4000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>New Hire Interest Form</h2>
        <p style={styles.subtitle}>
          Fill out the form below to express your interest in joining our team.
        </p>

        {successMessage && (
          <div style={styles.successBanner} role="status">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div style={styles.fieldGroup}>
            <label htmlFor="interest-fullName" style={styles.label}>
              Full Name <span style={styles.required}>*</span>
            </label>
            <input
              id="interest-fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.fullName ? styles.inputError : {}),
              }}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {errors.fullName && (
              <p style={styles.errorText} role="alert">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label htmlFor="interest-email" style={styles.label}>
              Email <span style={styles.required}>*</span>
            </label>
            <input
              id="interest-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
              placeholder="Enter your email address"
              autoComplete="email"
            />
            {errors.email && (
              <p style={styles.errorText} role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div style={styles.fieldGroup}>
            <label htmlFor="interest-mobile" style={styles.label}>
              Mobile Number <span style={styles.required}>*</span>
            </label>
            <input
              id="interest-mobile"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.mobile ? styles.inputError : {}),
              }}
              placeholder="Enter 10-digit mobile number"
              autoComplete="tel"
            />
            {errors.mobile && (
              <p style={styles.errorText} role="alert">
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Department */}
          <div style={styles.fieldGroup}>
            <label htmlFor="interest-department" style={styles.label}>
              Department <span style={styles.required}>*</span>
            </label>
            <select
              id="interest-department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={{
                ...styles.select,
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
              <p style={styles.errorText} role="alert">
                {errors.department}
              </p>
            )}
          </div>

          <button type="submit" style={styles.submitButton}>
            Submit Interest Form
          </button>
        </form>

        <div style={styles.backLinkWrapper}>
          <Link to="/" style={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: 'calc(100vh - 120px)',
    padding: '48px 24px',
    backgroundColor: '#f5f7fa',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
    padding: '40px 32px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  successBanner: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
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
    transition: 'border-color 0.2s ease',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
  },
  inputError: {
    borderColor: '#dc2626',
    boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)',
  },
  errorText: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#dc2626',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4f46e5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s ease',
  },
  backLinkWrapper: {
    textAlign: 'center',
    marginTop: '20px',
  },
  backLink: {
    fontSize: '14px',
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default InterestForm;