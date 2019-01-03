export default function createUser(description) {
  let { username, token } = description;

  return {
    get username() {
      return username;
    },
    get token() {
      return token;
    },
    set token(newToken) {
      token = newToken;
    },
  };
}
