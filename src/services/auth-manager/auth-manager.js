import config from '../config';

export function createAuthManager({ login, createUser }) {
  let currentUser = createUser({
    username: config.app.defaultUser,
  });

  const authManager = {
    authenticate,
    logout,

    get user() {
      return currentUser;
    },
  };

  return authManager;

  //----------------------------------------------------------------------------------------------------------------------

  async function authenticate({ username, password }) {
    let success = false;
    let error = false;

    if (navigator.onLine) {
      const result = JSON.parse(await login(username, password));

      if (result.status === 'ok') {
        currentUser.token = result.token;
        success = true;
      } else if (result.error) {
        console.error(result.error);
        error = 'LoginInvalid';
      }
    } else {
      error = 'LoginNoConnection';
    }

    return {
      success,
      error,
    };
  }

  function logout() {
    currentUser = null;
  }
}
