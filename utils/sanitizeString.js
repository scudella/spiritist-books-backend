import * as sanitizer from 'string-sanitizer';
import validator from 'validator';

function sanitizeName(name) {
  const sanitizedName = sanitizer.sanitize.keepSpace(name);
  if (name === sanitizedName) {
    return true;
  }
  return false;
}

function sanitizeEmail(email) {
  return validator.isEmail(email);
}

export { sanitizeName, sanitizeEmail };
