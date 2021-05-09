import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const cognitoFlag = true;
const myExceptions = Object.freeze({
  UserNotConfirmedException: 1,
});

const MyRequest = (function () {
  const host = 'http://localhost';
  const port = 3000;

  /* Use this function for testing when the rest api is not yet implemented */
  function requestToServerTest(input, apiName) {
    return new Promise((resolve, reject) => {
      let res = {
        success: Math.floor(Math.random() * 2) == 0 ? true : false,
        code: Math.floor(Math.random() * 100),
        msg: 'hello',
      };
      if (res.success === true) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  }

  function requestToServer(input, apiName) {
    const api = `${this.host}:${this.port}/${apiName}`;
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    const request = new Request(api, {
      header: header,
      method: 'POST',
      body: input,
    });

    return new Promise((reslove, reject) => {
      return fetch(request);
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonRes) => {
        if (jsonRes.success == true) {
          reslove(jsonRes);
        } else {
          reject(jsonRes);
        }
      })
      .catch((error) => {
        console.error(error);
        const errRes = { success: false, code: null, message: 'unknown error' };
        reject(errRes);
      });
  }

  function signIn(email, password) {
    let ret = null;
    const input = { email: email, password: password };
    const jsonInput = JSON.stringify(input);

    if (cognitoFlag === true) {
      ret = Auth.signIn(email, password);
    } else {
      ret = requestToServer(jsonInput, '/v1/signIn');
    }
    return ret;
  }

  function signUp(email, password) {
    let ret = null;
    /* create input of json format */
    const input = { email: email, password: password };
    const jsonInput = JSON.stringify(input);
    /* request to server */
    if (cognitoFlag === true) {
      ret = Auth.signUp({
        username: email,
        password: password,
        attributes: {
          nickname: '',
          gender: '',
          'custom:additional_verified': 0,
        },
      });
    } else {
      ret = requestToServer(jsonInput, '/v1/signup');
    }
    return ret;
  }

  function confirmSignUp(email, code) {
    let ret = null;
    /* create input of json format */
    const input = { email: email, code: code };
    const jsonInput = JSON.stringify(input);
    /* request to server */
    if (cognitoFlag === true) {
      ret = Auth.confirmSignUp(email, code);
    } else {
      ret = requestToServer(jsonInput, '/v1/confirmSignUp');
    }

    return ret;
  }

  function resendCode(email) {
    let ret = null;
    /* create input of json format */
    const input = { email: email };
    const jsonInput = JSON.stringify(input);
    if (cognitoFlag === true) {
      ret = Auth.resendSignUp(email);
    } else {
      ret = requestToServer(jsonInput, '/v1/resendCode');
    }

    return ret;
  }

  function checkNickname(nickname) {
    const input = { nickname: nickname };
    const jsonInput = JSON.stringify(input);
    // return requestToServer(jsonInput, '/v1/checkNickname');

    return requestToServerTest(jsonInput, '/v1/checkNickname');
  }

  function registerAdditionalInfo(nickname, gender) {
    const input = { nickname: nickname, gender: gender };
    const jsonInput = JSON.stringify(input);

    return requestToServerTest(jsonInput, '/v1/registerAdditionalInfo');
  }

  return {
    signIn: signIn,
    signUp: signUp,
    confirmSignUp: confirmSignUp,
    resendCode: resendCode,
    checkNickname: checkNickname,
    registerAdditionalInfo: registerAdditionalInfo,
  };
})();

export { MyRequest, cognitoFlag, myExceptions };
