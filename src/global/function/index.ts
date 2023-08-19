export const checkEmail = (value: string) => {
  if (!value.includes('@')) {
    return 'Email should contain "@" symbol.';
  }
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

export const checkExistence = (value: string) => {
  if (!value) {
    return 'This field is required.';
  }
  return null;
};
