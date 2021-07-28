
export interface IAuthentication {
  id: string | null;
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  sendEmail: boolean;
  isAdmin: boolean;
  isAuthorised: boolean;
  refreshToken: string | null;
}


export class Authentication implements IAuthentication {
  id = null;
  userName = null;
  firstName = null;
  lastName = null;
  email = null;
  password = null;
  sendEmail = true;
  isAdmin = false;
  isAuthorised = false;
  refreshToken = null;
}

export class MyToken {
  success = false;
  token = '';
  subject = '';
  errorMessage = '';
  expTime: Date | null = null;
  username = '';
  firstName = '';
  name = '';
  id = '';
  isAdmin = '';
  isAuthorised = '';
  refreshToken = '';
  version = '';
}


export class ChangePassword {
  userName = '';
  firstName = '';
  lastName = '';
  email = '';
  oldPassword = '';
  password = '';
  token = '';
}

export class ChangeRole {
  userId = '';
  roleName = '';
  isSelected = false;
}


export class ResponseAuthentication {
  expires = new Date();
  isAdmin = false;
  isAuthorised = false;
  success = false;
}
