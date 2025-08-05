// Date Utilities - Gregorian Calendar Only
export const formatDate = (date, options = {}) => {
  if (!date) return '-';

  let dateObj;

  // Handle Firestore Timestamp
  if (date && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  }
  // Handle seconds timestamp
  else if (date && typeof date.seconds === 'number') {
    dateObj = new Date(date.seconds * 1000);
  }
  // Handle regular Date or timestamp
  else if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return '-';
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  };

  // Always use Gregorian calendar (en-GB for DD/MM/YYYY format)
  return dateObj.toLocaleDateString('en-GB', defaultOptions);
};

export const formatDateTime = (date, options = {}) => {
  if (!date) return '-';

  let dateObj;

  // Handle Firestore Timestamp
  if (date && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  }
  // Handle seconds timestamp
  else if (date && typeof date.seconds === 'number') {
    dateObj = new Date(date.seconds * 1000);
  }
  // Handle regular Date or timestamp
  else if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return '-';
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options,
  };

  // Always use Gregorian calendar
  return (
    dateObj.toLocaleDateString('en-GB', defaultOptions) +
    ' ' +
    dateObj.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  );
};

export const formatRelativeTime = date => {
  if (!date) return '-';

  let dateObj;

  // Handle Firestore Timestamp
  if (date && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  }
  // Handle seconds timestamp
  else if (date && typeof date.seconds === 'number') {
    dateObj = new Date(date.seconds * 1000);
  }
  // Handle regular Date or timestamp
  else if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return '-';
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'منذ لحظات';
  } else if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`;
  } else if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`;
  } else if (diffInDays < 7) {
    return `منذ ${diffInDays} يوم`;
  } else {
    return formatDate(dateObj);
  }
};

export const isDateExpired = date => {
  if (!date) return false;

  let dateObj;

  // Handle Firestore Timestamp
  if (date && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  }
  // Handle seconds timestamp
  else if (date && typeof date.seconds === 'number') {
    dateObj = new Date(date.seconds * 1000);
  }
  // Handle regular Date or timestamp
  else if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return false;
  }

  return new Date() > dateObj;
};
