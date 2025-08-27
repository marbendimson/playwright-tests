export const loginSelectors = {
    username: '#loginform-username',
    password: '#loginform-password',
    submit: 'button[type="submit"]',
    erroremptypass: '.invalid-feedback:has-text("Password cannot be blank")', // Password error
    erroremptyusername: '.invalid-feedback:has-text("Username cannot be blank")', // Username error
    //erroremptyusername: '.invalid-feedback',
    error1: '.alert.alert-warning', // Login attempt warning
    success: 'h4.mb-sm-0:has-text("Dashboard")', // Dashboard element
  };