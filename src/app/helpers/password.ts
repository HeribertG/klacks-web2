

export function generatePassword() {

  const length = 6;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const digits = '0123456789';
  const charset1 = '@#?!';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }

  for (let i = 0, n = digits.length; i < 2; ++i) {
    retVal += digits.charAt(Math.floor(Math.random() * n));
  }
  retVal += charset1.charAt(Math.floor(Math.random() * 3));
  return retVal;
}

export const enum PasswordCheckStrength {
  Short,
  Common,
  Weak,
  Ok,
  Strong,
}




export function checkPasswordStrength(password: string): PasswordCheckStrength {



  function isPasswordCommon(pwd: string): boolean {
    const commonPasswordPatterns = /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;
    return  commonPasswordPatterns.test(pwd);
  }

  const minimumLength = 8;

  // Build up the strenth of our password
  let numberOfElements = 0;
  numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Lowercase letters
  numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Uppercase letters
  numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;      // Numbers
  numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;   // Special characters (inc. space)

  // Assume we have a poor password already
  let currentPasswordStrength = PasswordCheckStrength.Short;

  // Check then strenth of this password using some simple rules
  if (password === null || password.length < minimumLength) {
      currentPasswordStrength = PasswordCheckStrength.Short;
  } else if (isPasswordCommon(password) === true) {
      currentPasswordStrength = PasswordCheckStrength.Common;
  } else if (numberOfElements === 0 || numberOfElements === 1 || numberOfElements === 2) {
      currentPasswordStrength = PasswordCheckStrength.Weak;
  } else if (numberOfElements === 3) {
      currentPasswordStrength = PasswordCheckStrength.Ok;
  } else {
      currentPasswordStrength = PasswordCheckStrength.Strong;
  }

  // Return the strength of this password
  return currentPasswordStrength;


}

