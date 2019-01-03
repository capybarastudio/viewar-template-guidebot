import createUser from './user';
import viewarApi from 'viewar-api';
import { createAuthManager } from './auth-manager';

const login = (username, password) =>
  viewarApi.http.post(
    'http://dev2.viewar.com/templates/custom/guidebot/action:ajaxLogin',
    { username, password }
  );

export default createAuthManager({
  login,
  createUser,
});
