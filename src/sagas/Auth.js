import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { SIGNIN_USER, SIGNOUT_USER, SIGNUP_USER } from "constants/ActionTypes";
import {
  showAuthMessage,
  userSignInSuccess,
  userSignOutSuccess,
  userSignUpSuccess
} from "actions/Auth";
import setAuthToken from "../util/setAuthToken";
import axios from "axios";
import jwt_decode from "jwt-decode";

const createUserWithEmailPasswordRequest = async (
  fullName,
  email,
  password,
  phone,
  confirmPassword,
  type
) => {
  return new Promise((resolve, rejects) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    // Request body
    const body = JSON.stringify({
      fullName,
      email,
      password,
      phone,
      confirmPassword,
      type
    });
    axios
      .post("http://localhost:5000/api/users/register", body, config)
      .then(authUser => resolve(authUser.data))
      .catch(error => rejects(error));
  });
};

const signInUserWithEmailPasswordRequest = async (email, password) => {
  return new Promise((resolve, rejects) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // Request body
    const body = JSON.stringify({ email, password });

    axios
      .post("http://localhost:5000/api/users/login", body, config)
      .then(res => resolve(res.data))
      .catch(error => rejects(error));
  });
};

function* createUserWithEmailPassword({ payload }) {
  const { fullName, email, password, phone, confirmPassword, type } = payload;
  try {
    const signUpUser = yield call(
      createUserWithEmailPasswordRequest,
      fullName,
      email,
      password,
      phone,
      confirmPassword,
      type
    );
    if (signUpUser.status === "failure") {
      if (signUpUser.msg.fullName)
        yield put(showAuthMessage(signUpUser.msg.fullName));
      if (signUpUser.msg.phone)
        yield put(showAuthMessage(signUpUser.msg.phone));
      if (signUpUser.msg.email)
        yield put(showAuthMessage(signUpUser.msg.email));
      if (signUpUser.msg.password)
        yield put(showAuthMessage(signUpUser.msg.password));
      if (signUpUser.msg.confirmPassword)
        yield put(showAuthMessage(signUpUser.msg.confirmPassword));
    } else {
      yield put(userSignUpSuccess(signUpUser.msg));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

function* signInUserWithEmailPassword({ payload }) {
  const { email, password } = payload;
  try {
    const signInUser = yield call(
      signInUserWithEmailPasswordRequest,
      email,
      password
    );
    if (signInUser.status === "failure") {
      if (signInUser.msg.email)
        yield put(showAuthMessage(signInUser.msg.email));
      if (signInUser.msg.password)
        yield put(showAuthMessage(signInUser.msg.password));
    } else {
      localStorage.setItem("jwtToken", signInUser.token);
      // Set token to Auth header
      setAuthToken(signInUser.token);
      // Decode token to get user data
      const decoded = jwt_decode(signInUser.token);
      // Set current user
      yield put(userSignInSuccess(decoded));
    }
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}
function* signOut() {
  try {
    localStorage.removeItem("jwtToken");
    yield put(userSignOutSuccess());
  } catch (error) {
    yield put(showAuthMessage(error));
  }
}

export function* createUserAccount() {
  yield takeEvery(SIGNUP_USER, createUserWithEmailPassword);
}

export function* signInUser() {
  yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
  yield all([fork(signInUser), fork(createUserAccount), fork(signOutUser)]);
}
