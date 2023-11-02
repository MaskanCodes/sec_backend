/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./auth-service/user-adapter.js":
/*!**************************************!*\
  !*** ./auth-service/user-adapter.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _authenticateUser: () => (/* binding */ _authenticateUser),
/* harmony export */   _changePassword: () => (/* binding */ _changePassword),
/* harmony export */   _forgotPassword: () => (/* binding */ _forgotPassword),
/* harmony export */   _insertAccessToken: () => (/* binding */ _insertAccessToken),
/* harmony export */   _insertActivationCode: () => (/* binding */ _insertActivationCode),
/* harmony export */   _registerUser: () => (/* binding */ _registerUser),
/* harmony export */   _resendCode: () => (/* binding */ _resendCode),
/* harmony export */   _sendOtpCode: () => (/* binding */ _sendOtpCode),
/* harmony export */   _updateActivationCode: () => (/* binding */ _updateActivationCode),
/* harmony export */   _updateOtpCode: () => (/* binding */ _updateOtpCode),
/* harmony export */   _updateProfile: () => (/* binding */ _updateProfile),
/* harmony export */   _verifyEmail: () => (/* binding */ _verifyEmail),
/* harmony export */   _verifyOtp: () => (/* binding */ _verifyOtp)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _database_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../database/helper */ "./database/helper.js");
/* harmony import */ var _database_tables__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../database/tables */ "./database/tables.js");
/* harmony import */ var _configs_utility__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../configs/utility */ "./configs/utility.js");
/* harmony import */ var _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../configs/sec-types */ "./configs/sec-types.js");
/* harmony import */ var _helpers_mail_helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/mail-helper */ "./helpers/mail-helper.js");
/* harmony import */ var _helpers_image_helper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/image-helper */ "./helpers/image-helper.js");
/* harmony import */ var _helpers_aws_helper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/aws-helper */ "./helpers/aws-helper.js");
/* harmony import */ var _configs_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../configs/common */ "./configs/common.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }








const _registerUser = async userData => {
  let OTP = null;
  const {
    email,
    mobile: contact_no_primary,
    role_id,
    password,
    added_by
  } = userData;
  const params = {
    email,
    contact_no_primary
  };
  const dbUser = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, params, "OR");
  if (dbUser.length) {
    if (dbUser[0].email === email.toLowerCase()) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("EMAIL_EXISTS", 403);
    if (dbUser[0].contact_no_primary === contact_no_primary) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("MOBILE_EXISTS", 403);
  } else {
    const newUser = {
      email,
      contact_no_primary,
      role_id,
      password,
      added_by
    };
    newUser.profile_picture = await (0,_helpers_image_helper__WEBPACK_IMPORTED_MODULE_6__.generateDummyProfileImg)(email);
    if (newUser.password) newUser.password = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.hashString)(newUser.password ? newUser.password : "");else {
      OTP = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.getOTP)();
      newUser.password = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.hashString)(OTP);
    }
    const user = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.createRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, [newUser], true, "suid");
    const activationCodeData = {
      activation_code: (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.getRandomNumber)(),
      activation_code_generated_on: new Date(),
      suid: user.suid,
      email: user.email
    };
    await _insertActivationCode(activationCodeData);
    await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.createRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_PATIENT_PLANS, [newUser], true, "suid");
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("EMAIL_NOT_VERIFIED", 202);
  }
  return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("REGISTRATION_FAILED", 404);
};
const _authenticateUser = async userData => {
  const {
    email,
    mobile,
    password,
    remember_me,
    login_with_email
  } = userData;
  const params = {
    email,
    contact_no_primary: mobile
  };
  const dbUser = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, params, "OR");
  const selectParams = "suid, email, profile_picture, access_token, access_token_expires_on, free_trial_expiration";
  if (dbUser.length) {
    if (dbUser[0].is_active === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.ACTIVE) {
      if (dbUser[0].can_login === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.ACTIVE) {
        if (login_with_email) {
          const checkPwd = password === (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.descryptHashString)(dbUser[0].password);
          if (checkPwd) {
            if (!dbUser[0].free_trial_expiration) {
              const currentDate = new Date();
              currentDate.setDate(currentDate.getDate() + 14);
              await _updateProfile({
                free_trial_expiration: currentDate,
                email
              });
            } else if (new Date() > new Date(dbUser[0].free_trial_expiration)) {
              return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("SUBSCRIPTION_EXPIRED", 202);
            }
            await _insertAccessToken(dbUser[0], remember_me);
            const user = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, params, "OR", selectParams);
            return user[0];
          }
          return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("USER_PASSWORD_INCORRECT", 404);
        }
        await _sendOtpCode(dbUser[0].suid, dbUser[0].contact_no_primary);
        return {
          message: "ACTIVATION_CODE_SENT"
        };
      }
      return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("INCOMPLETE_PROFILE", 202);
    }
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("EMAIL_NOT_VERIFIED", 202);
  }
  return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("USER_NOT_EXISTS", 404);
};
const _verifyEmail = async data => {
  const {
    email,
    activation_code
  } = data;
  const params = {
    email
  };
  const dbUser = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, params, "", "suid, is_active, role_id, is_approved");
  if (dbUser.length) {
    if (dbUser[0].is_active === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.ACTIVE) {
      if (dbUser[0].role_id === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userRole.DOCTOR && dbUser[0].is_approved === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.IN_ACTIVE) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("ADMIN_APPROVAL_REQUIRED", 202);
      return {
        message: "EMAIL_VERIFIED"
      };
    }
    const codeParams = {
      user_id: dbUser[0].suid,
      activation_code
    };
    const isValidActivationCode = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES, codeParams, "AND", "*", "desc", "code_id");
    if (isValidActivationCode.length) {
      const codeGeneratedDate = new Date(isValidActivationCode[0].activation_code_generated_on);
      codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + _configs_common__WEBPACK_IMPORTED_MODULE_8__.randomNumber.minutes);
      if (codeGeneratedDate >= new Date()) {
        if (activation_code.toString() === isValidActivationCode[0].activation_code.toString()) {
          const records = {
            is_active: _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.ACTIVE
          };
          const whereClause = {
            suid: dbUser[0].suid,
            email
          };
          await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.updateRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, records, whereClause, "AND");
        } else return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("INVALID_ACTIVATION_CODE", 404);
      } else {
        return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("ACTIVATION_CODE_EXPIRED", 404);
      }
      return {
        message: "EMAIL_VERIFIED"
      };
    }
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("INVALID_ACTIVATION_CODE", 404);
  }
  return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("USER_NOT_EXISTS", 404);
};
const _updateProfile = async data => {
  const records = _objectSpread({}, data);
  delete records.email;
  const dbUser = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, {
    email: data.email
  }, "", "suid, email, is_active, role_id, is_approved");
  if (dbUser.length) {
    if (dbUser[0].is_active === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.ACTIVE) {
      if (dbUser[0].role_id === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userRole.DOCTOR && dbUser[0].is_approved === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.IN_ACTIVE) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("ADMIN_APPROVAL_REQUIRED", 202);
      const selectParams = "suid, email, profile_picture, access_token, access_token_expires_on, free_trial_expiration";
      const whereClause = {
        email: dbUser[0].email,
        suid: dbUser[0].suid
      };
      records.can_login = 0;
      await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.updateRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, records, whereClause, "AND");
      await _insertAccessToken(dbUser[0], false);
      const user = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, whereClause, "OR", selectParams);
      return user[0];
    }
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("EMAIL_NOT_VERIFIED", 202);
  }
  return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("USER_NOT_EXISTS", 404);
};
const _verifyOtp = async data => {
  const {
    mobile: contact_no_primary,
    otp_code
  } = data;
  const params = {
    contact_no_primary
  };
  const dbUser = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, params, "", "suid, is_active, role_id, is_approved, can_login, free_trial_expiration");
  if (dbUser.length) {
    const codeParams = {
      user_id: dbUser[0].suid,
      otp_code
    };
    const isValidActivationCode = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES, codeParams, "AND", "*", "desc", "user_id");
    if (isValidActivationCode.length) {
      const codeGeneratedDate = new Date(isValidActivationCode[0].otp_code_generated_on);
      codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + _configs_common__WEBPACK_IMPORTED_MODULE_8__.randomNumber.minutes);
      if (codeGeneratedDate >= new Date()) {
        if (otp_code.toString() === isValidActivationCode[0].otp_code.toString() && isValidActivationCode[0].is_expired === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.ACTIVE) {
          const selectParams = "suid, email, profile_picture, access_token, access_token_expires_on, free_trial_expiration";
          if (dbUser[0].is_active === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.ACTIVE) {
            if (dbUser[0].role_id === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userRole.DOCTOR && dbUser[0].is_approved === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.IN_ACTIVE) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("ADMIN_APPROVAL_REQUIRED", 202);
            if (dbUser[0].can_login === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.IN_ACTIVE) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("INCOMPLETE_PROFILE", 202);
            if (!dbUser[0].free_trial_expiration) {
              const currentDate = new Date();
              currentDate.setDate(currentDate.getDate() + 14);
              await _updateProfile({
                free_trial_expiration: currentDate,
                email: dbUser[0]
              });
            } else if (new Date() > new Date(dbUser[0].free_trial_expiration)) {
              return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("SUBSCRIPTION_EXPIRED", 202);
            }
            await _insertAccessToken(dbUser[0], false);
            const user = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, params, "OR", selectParams);
            return user[0];
          }
          return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("EMAIL_NOT_VERIFIED", 202);
        }
        return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("INVALID_OTP_CODE", 404);
      }
      return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("ACTIVATION_CODE_EXPIRED", 404);
    }
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("INVALID_OTP_CODE", 404);
  }
  return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("USER_NOT_EXISTS", 404);
};
const _resendCode = async data => {
  const {
    email,
    mobile: contact_no_primary
  } = data;
  const params = {};
  if (email) {
    params.email = email;
  }
  if (contact_no_primary) {
    params.contact_no_primary = contact_no_primary;
  }
  const dbUser = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, params, "", "suid, email, contact_no_primary, is_active, role_id, is_approved, can_login");
  if (dbUser.length) {
    if (dbUser[0].role_id === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userRole.DOCTOR && dbUser[0].is_approved === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.IN_ACTIVE) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("ADMIN_APPROVAL_REQUIRED", 202);
    if (email) {
      const existingCodeData = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.runRawQuery)(`SELECT * from ${_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES} WHERE user_id = ${dbUser[0].suid} AND activation_code IS NOT NULL ORDER BY code_id DESC`);
      if (existingCodeData.length) {
        const codeGeneratedDate = new Date(existingCodeData[0].activation_code_generated_on);
        codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + _configs_common__WEBPACK_IMPORTED_MODULE_8__.randomNumber.minutes);
        if (existingCodeData[0].no_of_email_tries < 3) {
          return _updateActivationCode(existingCodeData[0], dbUser[0].suid, dbUser[0].email);
        }
        if (new Date() > codeGeneratedDate) {
          const activationCodeData = {
            activation_code: (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.getRandomNumber)(),
            activation_code_generated_on: new Date(),
            suid: dbUser[0].suid,
            email: dbUser[0].email
          };
          return _insertActivationCode(activationCodeData, true, "activation", "validate");
        }
        return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("NO_OF_TRIES_EXCEEDED", 202);
      }
      const activationCodeData = {
        activation_code: (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.getRandomNumber)(),
        activation_code_generated_on: new Date(),
        suid: dbUser[0].suid,
        email: dbUser[0].email
      };
      return _insertActivationCode(activationCodeData, true, "activation", "validate");
    }
    const existingCodeData = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.runRawQuery)(`SELECT * from ${_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES} WHERE user_id = ${dbUser[0].suid} AND otp_code IS NOT NULL ORDER BY code_id DESC`);
    if (existingCodeData.length) {
      const codeGeneratedDate = new Date(existingCodeData[0].otp_code_generated_on);
      codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + _configs_common__WEBPACK_IMPORTED_MODULE_8__.randomNumber.minutes);
      if (existingCodeData[0].no_of_mobile_tries < 3) {
        return _updateOtpCode(existingCodeData[0], dbUser[0].contact_no_primary);
      }
      if (new Date() > codeGeneratedDate) {
        await _sendOtpCode(dbUser[0].suid, dbUser[0].contact_no_primary);
        return {
          message: "ACTIVATION_CODE_SENT"
        };
      }
      return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("NO_OF_TRIES_EXCEEDED", 202);
    }
    await _sendOtpCode(dbUser[0].suid, dbUser[0].contact_no_primary);
    return {
      message: "ACTIVATION_CODE_SENT"
    };
  }
  return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("USER_NOT_EXISTS", 404);
};
const _forgotPassword = async data => {
  const {
    email
  } = data;
  const dbUser = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, {
    email
  }, "", "suid, email, is_active, role_id, is_approved, can_login");
  if (dbUser.length) {
    if (dbUser[0].is_active === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.ACTIVE) {
      if (dbUser[0].role_id === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userRole.DOCTOR && dbUser[0].is_approved === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.IN_ACTIVE) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("ADMIN_APPROVAL_REQUIRED", 202);
      const activationCodeData = {
        activation_code: (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.getRandomNumber)(),
        activation_code_generated_on: new Date(),
        suid: dbUser[0].suid,
        email: dbUser[0].email
      };
      return await _insertActivationCode(activationCodeData, true, "password reset", "reset your password");
    }
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("EMAIL_NOT_VERIFIED", 202);
  }
  return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("USER_NOT_EXISTS", 404);
};
const _changePassword = async data => {
  const {
    email,
    activation_code,
    new_password
  } = data;
  const dbUser = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, {
    email
  }, "", "suid, email, is_active, role_id, is_approved, can_login");
  if (dbUser.length) {
    const codeParams = {
      user_id: dbUser[0].suid,
      activation_code
    };
    const isValidActivationCode = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.getRecordByParams)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES, codeParams, "AND", "*", "desc", "code_id");
    const codeGeneratedDate = new Date(isValidActivationCode[0].activation_code_generated_on);
    codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + _configs_common__WEBPACK_IMPORTED_MODULE_8__.randomNumber.minutes);
    if (codeGeneratedDate >= new Date()) {
      if (activation_code.toString() === isValidActivationCode[0].activation_code.toString() && isValidActivationCode[0].is_expired === _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.ACTIVE) {
        const records = {
          password: (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.hashString)(new_password || "")
        };
        const whereClause = {
          suid: dbUser[0].suid,
          email
        };
        await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.updateRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, records, whereClause, "AND");
        return {
          message: "PASSWORD_CHANGE_SUCCESS"
        };
      }
      return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("INVALID_ACTIVATION_CODE", 404);
    }
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("ACTIVATION_CODE_EXPIRED", 404);
  }
  return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("USER_NOT_EXISTS", 404);
};
/** Helper functions */

const _insertAccessToken = async (user, remember_me = false) => {
  const userToken = await (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateJWT)(user.suid, remember_me);
  if (user) {
    const records = {
      last_login: new Date(),
      access_token: userToken,
      access_token_generated_on: new Date(),
      access_token_expires_on: (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.addHoursToDate)(new Date(), remember_me ? _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.expirationTime.remember.hours : _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.expirationTime.normal.hours)
    };
    const whereClause = {
      suid: user.suid,
      email: user.email
    };
    const updatedRecords = await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.updateRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USERS, records, whereClause, "AND");
    if (updatedRecords) {
      return records;
    }
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("TOKEN_INSERTION_FAILED", 400);
  }
  return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("USER_NOT_EXISTS", 404);
};
const _insertActivationCode = async (userData, isRegenerate, sub = "account activation", message = "activate your account") => {
  const updatRecords = {
    is_expired: _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.IN_ACTIVE
  };
  const whereClause = {
    user_id: userData.suid
  };
  await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.updateRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES, updatRecords, whereClause, "");
  const records = {
    activation_code: userData.activation_code,
    activation_code_generated_on: userData.activation_code_generated_on,
    user_id: userData.suid
  };
  await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.createRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES, [records]);
  await (0,_helpers_mail_helper__WEBPACK_IMPORTED_MODULE_5__.sendActivationCode)(userData.email, userData.activation_code, sub, message);
  console.log("Activation code sent successfully to ", userData.email);
  if (!isRegenerate) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.generateError)("EMAIL_NOT_VERIFIED", 202);
  return {
    message: "ACTIVATION_CODE_SENT"
  };
};
const _updateActivationCode = async (existingCodeData, user_id, email) => {
  const activation_code = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.getRandomNumber)();
  const activationCodeData = {
    activation_code,
    activation_code_generated_on: new Date(),
    no_of_email_tries: existingCodeData.no_of_email_tries + 1
  };
  const updateWhereClause = {
    user_id,
    code_id: existingCodeData.code_id
  };
  await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.updateRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES, activationCodeData, updateWhereClause, "AND");
  await (0,_helpers_mail_helper__WEBPACK_IMPORTED_MODULE_5__.sendActivationCode)(email, activation_code, "activation", "validate");
  console.log("Activation code sent successfully to ", email);
  return {
    message: "ACTIVATION_CODE_SENT"
  };
};
const _sendOtpCode = async (user_id, mobile) => {
  const updatRecords = {
    is_expired: _configs_sec_types__WEBPACK_IMPORTED_MODULE_4__.userStatus.IN_ACTIVE
  };
  const whereClause = {
    user_id
  };
  await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.updateRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES, updatRecords, whereClause, "");
  const otpCode = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.getOTP)();
  const message = `Your OTP is ${otpCode} and it is valid for ${_configs_common__WEBPACK_IMPORTED_MODULE_8__.randomNumber.minutes} minutes. Please do not share it with anyone.`;
  const records = {
    otp_code: otpCode,
    otp_code_generated_on: new Date(),
    user_id
  };
  await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.createRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES, [records]);
  await (0,_helpers_aws_helper__WEBPACK_IMPORTED_MODULE_7__.sendOTPToUser)(mobile, message);
};
const _updateOtpCode = async (existingCodeData, mobile) => {
  const otpCode = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_3__.getOTP)();
  const message = `Your OTP is ${otpCode} and it is valid for ${_configs_common__WEBPACK_IMPORTED_MODULE_8__.randomNumber.minutes} minutes. Please do not share it with anyone.`;
  const activationCodeData = {
    otp_code: otpCode,
    otp_code_generated_on: new Date(),
    no_of_mobile_tries: existingCodeData.no_of_mobile_tries + 1
  };
  const updateWhereClause = {
    user_id: existingCodeData.user_id,
    code_id: existingCodeData.code_id
  };
  await (0,_database_helper__WEBPACK_IMPORTED_MODULE_1__.updateRecord)(_database_tables__WEBPACK_IMPORTED_MODULE_2__.tableNames.SEC_USER_CODES, activationCodeData, updateWhereClause, "AND");
  await (0,_helpers_aws_helper__WEBPACK_IMPORTED_MODULE_7__.sendOTPToUser)(mobile, message);
  return {
    message: "ACTIVATION_CODE_SENT"
  };
};

/***/ }),

/***/ "./configs/common.js":
/*!***************************!*\
  !*** ./configs/common.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OTP: () => (/* binding */ OTP),
/* harmony export */   SMSmessages: () => (/* binding */ SMSmessages),
/* harmony export */   app: () => (/* binding */ app),
/* harmony export */   aws: () => (/* binding */ aws),
/* harmony export */   envMapping: () => (/* binding */ envMapping),
/* harmony export */   randomNumber: () => (/* binding */ randomNumber),
/* harmony export */   thumbnail: () => (/* binding */ thumbnail),
/* harmony export */   totalFilesSize: () => (/* binding */ totalFilesSize)
/* harmony export */ });
"strict mode";

const randomNumber = {
  length: 6,
  containers: "7028361495",
  minutes: 20
};
const OTP = {
  length: 6,
  containers: "D01U2JKQZMNO56RST789LAB4CFGE3HIPVWXY"
};
const thumbnail = {
  width: 250,
  height: 250,
  imgFormat: "png"
};
const SMSmessages = {
  activation_code_message: "Your Shareecare verification Code is {0}. #ShareECare"
};
const aws = {
  s3: {
    params: {
      Bucket: "{0}.shareecare.documents",
      Domain: "{0}.documents.shareecare.com"
    }
  },
  settings: {
    root_path: "user_documents/{0}",
    // {0} UserId
    feedback_path: "user_feedbacks/{0}",
    // {0} UserId
    image_path: "/images",
    file_path: "/files"
  }
};
const app = {
  jwtSecret: process.env.JWT_SECRET
};
const envMapping = {
  development: "dev",
  production: "prod",
  test: "test"
};
const totalFilesSize = 20480;

/***/ }),

/***/ "./configs/sec-types.js":
/*!******************************!*\
  !*** ./configs/sec-types.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   expirationTime: () => (/* binding */ expirationTime),
/* harmony export */   isCompleted: () => (/* binding */ isCompleted),
/* harmony export */   isPublished: () => (/* binding */ isPublished),
/* harmony export */   isSent: () => (/* binding */ isSent),
/* harmony export */   mailType: () => (/* binding */ mailType),
/* harmony export */   notificationStatus: () => (/* binding */ notificationStatus),
/* harmony export */   notificationType: () => (/* binding */ notificationType),
/* harmony export */   registration_from: () => (/* binding */ registration_from),
/* harmony export */   registration_type: () => (/* binding */ registration_type),
/* harmony export */   result: () => (/* binding */ result),
/* harmony export */   userRole: () => (/* binding */ userRole),
/* harmony export */   userStatus: () => (/* binding */ userStatus)
/* harmony export */ });
const result = {
  SUCCESS: 0,
  // Success for all response if successful

  /** * 1 to 50 User related error codes ** */
  EMAIL_EXISTS: 1,
  // Email already exists
  MOBILE_EXISTS: 2,
  // Mobile already exists
  USER_NOT_EXISTS: 3,
  // User not exists
  USER_EXISTS: 4,
  // User exists
  USER_PASSWORD_INCORRECT: 5,
  // Password is wrong
  REGISTRATION_NOT_CONFIRMED: 6,
  // user Email is not conformed
  ACTIVATION_CODE_EXPIRED: 7,
  ACTIVATION_CODE_MISMATCH: 8,
  ALREADY_ACTIVE_MEMBER: 9,
  VALUE_NULL: 10,
  /** Document related service ** */
  DOCUMENT_N0T_EXISTS: 15,
  /** Firebase push notification service ** */
  FIREBASE_NOTIFICATION_ERROR: 20,
  /** * 351 t0 400 Google Api related error codes ** */
  ZERO_RESULTS: 351,
  OVER_QUERY_LIMIT: 352,
  REQUEST_DENIED: 353,
  INVALID_REQUEST: 354,
  UNKNOWN_ERROR: 355,
  /** * Response Types ** */
  OK: 200,
  BAD: 400,
  DENIED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500
};
const notificationType = {
  BROADCAST: 1,
  UNICAST: 2
};
const userRole = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  DOCTOR: 3,
  HCF: 4,
  PATIENT: 5
};
const userStatus = {
  ACTIVE: 0,
  IN_ACTIVE: 1,
  DELETED: 2,
  TRUNK: 3
};
const isPublished = {
  PUBLISHED: 0,
  UNPUBLISHED: 1
};
const isCompleted = {
  COMPLETED: 0,
  NOT_COMPLETED: 1
};
const mailType = {
  welcome: 0,
  resetPassword: 1,
  error: 999
};
const notificationStatus = {
  unRead: 1,
  read: 2
};
const isSent = {
  sent: 0,
  notSent: 1
};
const registration_type = {
  EMAIL: 1,
  SSO: 2
};
const registration_from = {
  WEB: 1,
  APP: 2
};
const expirationTime = {
  normal: {
    hours: 8,
    minutes: 2,
    seconds: 120,
    unit: "h"
  },
  remember: {
    hours: 12,
    minutes: 12 * 60 * 60,
    seconds: 60,
    unit: "h"
  }
};

/***/ }),

/***/ "./configs/utility.js":
/*!****************************!*\
  !*** ./configs/utility.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addHoursToDate: () => (/* binding */ addHoursToDate),
/* harmony export */   addMinutesToDate: () => (/* binding */ addMinutesToDate),
/* harmony export */   createDirectory: () => (/* binding */ createDirectory),
/* harmony export */   createErrorResponse: () => (/* binding */ createErrorResponse),
/* harmony export */   createSuccessResponse: () => (/* binding */ createSuccessResponse),
/* harmony export */   decodeJWT: () => (/* binding */ decodeJWT),
/* harmony export */   descryptHashString: () => (/* binding */ descryptHashString),
/* harmony export */   downloadFile: () => (/* binding */ downloadFile),
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   generateError: () => (/* binding */ generateError),
/* harmony export */   generateJWT: () => (/* binding */ generateJWT),
/* harmony export */   getDomainWithoutSubdomain: () => (/* binding */ getDomainWithoutSubdomain),
/* harmony export */   getFilenameAndExtension: () => (/* binding */ getFilenameAndExtension),
/* harmony export */   getFilesizeInBytes: () => (/* binding */ getFilesizeInBytes),
/* harmony export */   getOTP: () => (/* binding */ getOTP),
/* harmony export */   getPeriodStartEnd: () => (/* binding */ getPeriodStartEnd),
/* harmony export */   getRandomNumber: () => (/* binding */ getRandomNumber),
/* harmony export */   groupBy: () => (/* binding */ groupBy),
/* harmony export */   hashString: () => (/* binding */ hashString),
/* harmony export */   parseCookies: () => (/* binding */ parseCookies),
/* harmony export */   parseError: () => (/* binding */ parseError),
/* harmony export */   parseEventBody: () => (/* binding */ parseEventBody),
/* harmony export */   streamToString: () => (/* binding */ streamToString),
/* harmony export */   stringifyError: () => (/* binding */ stringifyError)
/* harmony export */ });
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! https */ "https");
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(https__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _sec_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sec-types */ "./configs/sec-types.js");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common */ "./configs/common.js");
//#!/usr/bin/env node
/* eslint-disable no-useless-escape */
"strict mode";







const cryptoAlgorithm = "aes-256-ctr"; // Do not alter
const cryptoPassword = Buffer.from(process.env.CRYPTO_PASSWORD, "base64"); // Do not alter
const IV_LENGTH = 16;
const randomStringLength = _common__WEBPACK_IMPORTED_MODULE_5__.randomNumber.length;
const chars = _common__WEBPACK_IMPORTED_MODULE_5__.randomNumber.containers;
const OTPlength = _common__WEBPACK_IMPORTED_MODULE_5__.OTP.length;
const OTPchars = _common__WEBPACK_IMPORTED_MODULE_5__.OTP.containers;

/**
 * Generates a random number of specified length using the specified characters
 * @returns {string} - The generated random number
 */
const getRandomNumber = () => {
  let result = "";
  for (let i = randomStringLength; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
};

/**
 * Generates a one-time password (OTP) of specified length using the specified characters
 * @returns {string} - The generated OTP
 */
const getOTP = () => {
  let result = "";
  for (let i = OTPlength; i > 0; --i) result += OTPchars[Math.round(Math.random() * (OTPchars.length - 1))];
  return result;
};

/**
 * Encrypts a password using AES-256-CTR encryption
 * @param {string} password - The password to be encrypted
 * @returns {string} - The encrypted password, prefixed by the initialization vector used in encryption
 */
const hashString = password => {
  const iv = crypto__WEBPACK_IMPORTED_MODULE_3___default().randomBytes(IV_LENGTH);
  const cipher = crypto__WEBPACK_IMPORTED_MODULE_3___default().createCipheriv(cryptoAlgorithm, Buffer.from(cryptoPassword), iv);
  const encrypted = cipher.update(password);
  const finalBuffer = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${finalBuffer.toString("hex")}`;
};

/**
 * Decrypts an encrypted password using AES-256-CTR encryption
 * @param {string} password - The encrypted password, prefixed by the initialization vector used in encryption
 * @returns {string} - The decrypted password
 */
const descryptHashString = password => {
  const textParts = password.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto__WEBPACK_IMPORTED_MODULE_3___default().createDecipheriv(cryptoAlgorithm, Buffer.from(cryptoPassword), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

/**
 * Generates a JSON web token (JWT) for the specified user ID
 * @param {string} user_id - The user ID for which the JWT is to be generated
 * @param {boolean} remember_me - Whether or not to generate a long-lived JWT for "remember me" functionality
 * @returns {Promise<string>} - A Promise that resolves to the generated JWT
 */
const generateJWT = async (user_id, remember_me) => {
  return await jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().sign({
    user_id
  }, _common__WEBPACK_IMPORTED_MODULE_5__.app.jwtSecret, {
    expiresIn: remember_me ? `${_sec_types__WEBPACK_IMPORTED_MODULE_4__.expirationTime.remember.hours}${_sec_types__WEBPACK_IMPORTED_MODULE_4__.expirationTime.normal.unit}` : `${_sec_types__WEBPACK_IMPORTED_MODULE_4__.expirationTime.normal.hours}${_sec_types__WEBPACK_IMPORTED_MODULE_4__.expirationTime.normal.unit}`
  });
};

/**
 * Decodes a JWT and returns the user ID it contains
 * @param {string} token - The JWT to be decoded
 * @returns {Promise<string>} - A Promise that resolves to the user ID contained in the JWT
 */
const decodeJWT = async token => {
  try {
    const decoded = await jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().verify(token, _common__WEBPACK_IMPORTED_MODULE_5__.app.jwtSecret);
    return decoded.user_id;
  } catch (err) {
    throw err;
  }
};

/**
 * Adds the specified number of hours to a given date
 * @param {Date} date - The date to which hours are to be added
 * @param {number} hours - The number of hours to add to the date
 * @returns {Date} - The resulting date
 */
const addHoursToDate = (date, hours) => {
  return new Date(new Date(date).setHours(date.getHours() + hours));
};

/**
 * Adds the specified number of minutes to a given date
 * @param {Date} date - The date to which minutes are to be added
 * @param {number} minutes - The number of minutes to add to the date
 * @returns {Date} - The resulting date
 */
const addMinutesToDate = (date, minutes) => {
  return new Date(new Date(date).setMinutes(date.getMinutes() + minutes));
};

/**
 * Gets the filename and extension from a given path/filename string
 * @param {string} pathfilename - The path/filename string from which to extract the filename and extension
 * @returns {string[]} - An array containing the filename and extension, respectively
 */
const getFilenameAndExtension = pathfilename => {
  const filenameextension = pathfilename.replace(/^.*[\\\/]/, "");
  const filename = filenameextension.substring(0, filenameextension.lastIndexOf("."));
  const ext = filenameextension.split(".").pop();
  return [filename, ext];
};

/**
 * Groups an array of objects by the specified key
 * @param {Object[]} arr - The array of objects to be grouped
 * @param {string} key - The key by which to group the objects
 * @returns {Object} - An object containing the groups of objects, with keys corresponding to the grouping key values
 */
const groupBy = (arr, key) => {
  const initialValue = {};
  return arr.reduce((acc, cval) => {
    const myAttribute = cval[key];
    acc[myAttribute] = [...(acc[myAttribute] || []), cval];
    return acc;
  }, initialValue);
};

/**
 * Creates a success response object for use in AWS Lambda functions
 * @param {Object|string} body - The body of the response object; can be an object or a string
 * @param {number} statusCode - The HTTP status code of the response
 * @returns {Object} - The response object, including headers necessary for CORS and content type
 */
const createSuccessResponse = (body, statusCode) => {
  const bodyString = typeof body === "object" ? JSON.stringify(body) : body;
  return {
    statusCode,
    body: bodyString,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json "
    }
  };
};

/**
 * Creates an error response object with a given message and status code
 *
 * @param {string} message - The error message
 * @param {number} statusCode - The HTTP status code
 * @returns {Object} - The error response object
 */
const createErrorResponse = (body, statusCode) => {
  const bodyString = typeof body === "object" ? JSON.stringify(body) : body;
  return {
    statusCode,
    body: bodyString || "Internal Server Error",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json "
    }
  };
};

/**
 * Converts a readable stream to a string
 *
 * @param {stream.Readable} stream - The stream to convert
 * @returns {Promise<string>} - A promise that resolves to the stream content as a string
 */
const streamToString = stream => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on("data", chunk => chunks.push(chunk));
  stream.on("error", reject);
  stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});

/**
 * Parses cookies from a given request object
 *
 * @param {Object} request - The request object
 * @returns {Object} - An object with the parsed cookies
 */
const parseCookies = request => {
  const list = {};
  try {
    const cookieHeader = request.queryStringParameters && request.queryStringParameters.cookie ? request.queryStringParameters.cookie.split(";") : request.cookies ? request.cookies : request.headers.Cookie ? request.headers.Cookie.split(";") : request.headers.cookie ? request.headers.cookie.split(";") : request.headers.authorization ? request.headers.authorization.split(";") : request.headers.Authorization.split(";");
    if (!cookieHeader) return list;
    cookieHeader.forEach(cookie => {
      const [name, ...rest] = cookie.split(`=`);
      const trimedName = name === null || name === void 0 ? void 0 : name.trim();
      if (!trimedName) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[trimedName] = decodeURIComponent(value);
    });
  } catch (err) {
    console.log("Some error occured in parsing cookies", err);
  }
  return list;
};

/**
 * Formats a date string to the format 'MM/DD/YYYY'
 *
 * @param {string} date - The date string to format
 * @returns {string} - The formatted date string
 */
const formatDate = date => {
  const newDate = new Date(date);
  return `${newDate.getMonth() > 8 ? newDate.getMonth() + 1 : `0${newDate.getMonth() + 1}`}/${newDate.getDate() > 9 ? newDate.getDate() : `0${newDate.getDate()}`}/${newDate.getFullYear()}`;
};

/**
 * Creates a directory at the given path
 *
 * @param {string} path - The path of the directory to create
 * @returns {Promise<void>} - A promise that resolves when the directory is created
 */
const createDirectory = async path => {
  try {
    if (!fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(path)) {
      fs__WEBPACK_IMPORTED_MODULE_2___default().mkdirSync(path);
    }
  } catch (err) {
    console.log("Error occured in creating directory", err);
  }
};

/**
 * Downloads a file from the given URL and saves it to the given file path
 *
 * @param {string} url - The URL of the file to download
 * @param {string} filePath - The path of the file to save to
 * @returns {Promise<void>} - A promise that resolves when the file is downloaded
 */
const downloadFile = async (url, filePath) => {
  return await new Promise((resolve, reject) => {
    console.log("Downloading file from ", url, "to", filePath);
    https__WEBPACK_IMPORTED_MODULE_1___default().get(url, response => {
      const code = response.statusCode ? response.statusCode : 0;
      if (code >= 400) {
        return reject(new Error(response.statusMessage));
      }

      // handle redirects
      if (code > 300 && code < 400 && !!response.headers.location) {
        return downloadFile(response.headers.location, filePath);
      }

      // save the file to disk
      const fileWriter = fs__WEBPACK_IMPORTED_MODULE_2___default().createWriteStream(filePath).on("finish", () => {
        console.log("Download Completed!");
        resolve({});
      });
      response.pipe(fileWriter);
      return "File written";
    }).on("error", error => {
      console.log("Error occured in downloading file", error);
      reject(error);
    });
  });
};

/**
 * Returns the top-level domain of a given URL without any subdomains.
 * @param {string} domain - The full domain to extract the top-level domain from.
 * @returns {string} - The top-level domain of the given domain without any subdomains.
 * @throws {Error} - Throws an error if the domain cannot be processed.
 */
const getDomainWithoutSubdomain = domain => {
  try {
    const domainCharacters = domain.split("").reverse();
    let domainReversed = "";
    let dotCount = 0;
    do {
      if (domainCharacters[0] === ".") {
        dotCount++;
        if (dotCount === 2) break;
      }
      domainReversed += domainCharacters[0];
      domainCharacters.splice(0, 1);
    } while (dotCount < 2 && domainCharacters.length > 0);
    return domainReversed.split("").reverse().join("");
  } catch (err) {
    console.log("Error occured while getting domain without sub domain", err);
    throw err;
  }
};

/**
 * Returns the size of a file in bytes given the file's path.
 * @param {string} filename - The path to the file to get the size of.
 * @returns {number} - The size of the file in bytes.
 */
const getFilesizeInBytes = filename => {
  const stats = fs__WEBPACK_IMPORTED_MODULE_2___default().statSync(filename);
  return stats.size;
};

/**
 * Returns the start and end dates of a specified period based on a given date.
 * @param {string} periodType - The type of period to get ("day", "month", "months", or "year").
 * @param {string[]} date - The date to calculate the period start and end from.
 * @param {number} value - The number of months to subtract when the periodType is "months".
 * @returns {Date[]} - An array containing the start and end dates of the specified period.
 * @throws {Error} - Throws an error if the periodType is not one of the specified types.
 */
const getPeriodStartEnd = (periodType, date, value) => {
  if (periodType === "date_range") return [new Date(date[0]), new Date(date[1])];
  const startDate = new Date(date[0]);
  const endDate = new Date(date[0]);
  if (periodType === "day") {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  } else if (periodType === "month") {
    startDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);
  } else if (periodType === "months") {
    startDate.setMonth(startDate.getMonth() - value);
    startDate.setDate(0);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);
  } else if (periodType === "year") {
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setMonth(startDate.getMonth());
    endDate.setMonth(startDate.getMonth());
    endDate.setHours(23, 59, 59, 999);
  } else {
    throw new Error(stringifyError({
      message: "Invalid period type",
      code: 400
    }));
  }
  return [startDate, endDate];
};
const parseEventBody = parseBody => {
  if (parseBody) {
    return JSON.parse(parseBody);
  }
  return parseBody;
};
const stringifyError = errObj => {
  try {
    return JSON.stringify(errObj);
  } catch (err) {
    return errObj;
  }
};
const parseError = errObj => {
  try {
    return JSON.parse(errObj);
  } catch (err) {
    return errObj;
  }
};
const generateError = (message, code) => {
  throw new Error(stringifyError({
    message,
    code
  }));
};

/***/ }),

/***/ "./database/helper.js":
/*!****************************!*\
  !*** ./database/helper.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocAppointmentHistory: () => (/* binding */ DocAppointmentHistory),
/* harmony export */   DocDashboardAppQuery: () => (/* binding */ DocDashboardAppQuery),
/* harmony export */   DocDashoardAppstatusQuery: () => (/* binding */ DocDashoardAppstatusQuery),
/* harmony export */   DocNotificationQuery: () => (/* binding */ DocNotificationQuery),
/* harmony export */   DoctransactionQuery: () => (/* binding */ DoctransactionQuery),
/* harmony export */   appointmentHistoryQuery: () => (/* binding */ appointmentHistoryQuery),
/* harmony export */   appointmentQuery: () => (/* binding */ appointmentQuery),
/* harmony export */   completeDoctorsDetails: () => (/* binding */ completeDoctorsDetails),
/* harmony export */   completeDoctorsDetailsId: () => (/* binding */ completeDoctorsDetailsId),
/* harmony export */   completeappointmentQuery: () => (/* binding */ completeappointmentQuery),
/* harmony export */   createRecord: () => (/* binding */ createRecord),
/* harmony export */   dashboarddocdetailsQuery: () => (/* binding */ dashboarddocdetailsQuery),
/* harmony export */   dashboarddocdetailsQueryId: () => (/* binding */ dashboarddocdetailsQueryId),
/* harmony export */   dashboardhcfdetailsQuery: () => (/* binding */ dashboardhcfdetailsQuery),
/* harmony export */   dashboardhcfdetailsQueryId: () => (/* binding */ dashboardhcfdetailsQueryId),
/* harmony export */   deleteRecord: () => (/* binding */ deleteRecord),
/* harmony export */   docAppointmentQuerybystatusId: () => (/* binding */ docAppointmentQuerybystatusId),
/* harmony export */   docAppointmentdetailsQuerybyId: () => (/* binding */ docAppointmentdetailsQuerybyId),
/* harmony export */   doctordetailsQueryId: () => (/* binding */ doctordetailsQueryId),
/* harmony export */   getAllRecords: () => (/* binding */ getAllRecords),
/* harmony export */   getDocAppRecord: () => (/* binding */ getDocAppRecord),
/* harmony export */   getDocAppStatusRecord: () => (/* binding */ getDocAppStatusRecord),
/* harmony export */   getDocDetailRecord: () => (/* binding */ getDocDetailRecord),
/* harmony export */   getDocListingRecord: () => (/* binding */ getDocListingRecord),
/* harmony export */   getRecordByParams: () => (/* binding */ getRecordByParams),
/* harmony export */   patientActivityQuery: () => (/* binding */ patientActivityQuery),
/* harmony export */   patientNotificationQuery: () => (/* binding */ patientNotificationQuery),
/* harmony export */   patientPlanQuery: () => (/* binding */ patientPlanQuery),
/* harmony export */   patientappQuerybystatusid: () => (/* binding */ patientappQuerybystatusid),
/* harmony export */   patienttransactionQuery: () => (/* binding */ patienttransactionQuery),
/* harmony export */   runRawQuery: () => (/* binding */ runRawQuery),
/* harmony export */   updateRecord: () => (/* binding */ updateRecord)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./database/index.js");
/* eslint-disable prettier/prettier */

async function queryDatabase(query, params) {
  const conn = await (0,___WEBPACK_IMPORTED_MODULE_0__.initConnection)();
  try {
    if (params) {
      const rows = await conn.query(query, params);
      return rows;
    }
    const rows = await conn.query(query);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (conn) conn.end();
  }
}
async function createRecord(table, records, getResults, column) {
  const columns = Object.keys(records[0]).toString();
  const values = records.map(record => Object.values(record));
  const query = `INSERT INTO ${table} (${columns}) VALUES ?`;
  const insertResult = await queryDatabase(query, [values]);
  const {
    insertId
  } = insertResult;
  if (getResults) {
    const selectQuery = `SELECT * FROM ${table} WHERE ${column} = ?`;
    const selectResult = await queryDatabase(selectQuery, [insertId]);
    return selectResult[0];
  }
  return insertId;
}
async function updateRecord(table, record, whereColumns, joinParams) {
  const columns = Object.keys(record).map(ele => `${ele} = ?`).toString();
  const whereClause = Object.keys(whereColumns).map(key => `${key} = ?`).join(` ${joinParams} `);
  const params = [...Object.values(record), ...Object.values(whereColumns)];
  const query = `UPDATE ${table} SET ${columns} WHERE ${whereClause}`;
  return await queryDatabase(query, params);
}
async function getAllRecords(table) {
  const query = `SELECT * FROM ${table}`;
  return await queryDatabase(query);
}
async function getRecordByParams(table, whereColumns, joinParams, selectParams = "*", order = "desc", orderBy = "suid") {
  const whereClause = Object.keys(whereColumns).map(key => `${key} = ?`).join(` ${joinParams} `);
  const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
  return await queryDatabase(query, [...Object.values(whereColumns)]);
}
async function deleteRecord(table, whereColumns) {
  const whereClause = Object.keys(whereColumns).map(key => `${key} = ?`).join(" AND ");
  const query = `DELETE FROM ${table} WHERE ${whereClause}`;
  return await queryDatabase(query, [...Object.values(whereColumns)]);
}

// export async function runRawQuery(table, alias1, alias2) {
//     const joinCondition = `${alias1.column1} = ${alias2.column2}`;
//    const query = `SELECT * FROM ${table}${alias1} JOIN ${table}${alias2} ON ${joinCondition} `;
async function runRawQuery(table1, table2, table3, column1, column2, column3, column4) {
  const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2} JOIN ${table3} ON  ${table2}.${column3} =  ${table3}.${column4} `;
  return await queryDatabase(query);
}
async function completeDoctorsDetails(table) {
  const query = `SELECT * FROM ${table}`;
  return await queryDatabase(query);
}
async function completeDoctorsDetailsId(table, column, id) {
  // const query = `SELECT * FROM ${table} WHERE  ${table}.doctor_details_id = ?;`;
  const query = ` SELECT *
    FROM sec_users
    JOIN sec_doctors_details ON sec_users.suid = sec_doctors_details.doctor_id
    JOIN sec_departments ON sec_doctors_details.speciality_id = sec_departments.department_id
    WHERE sec_users.role_id = '3' AND sec_doctors_details.doctor_details_id = ?; `;
  return await queryDatabase(query, [id]);
}
async function appointmentQuery(table) {
  const query = `SELECT * FROM ${table}`;
  return await queryDatabase(query);
}
async function completeappointmentQuery(table) {
  const query = `SELECT * FROM ${table}`;
  return await queryDatabase(query);
}

// -----------------------------------------  Doctor API -------------------------------------------------------

async function DocDashboardAppQuery(table, doc_id) {
  const query = `SELECT * FROM ${table} WHERE ${table}.doctor_id = ${doc_id}`;
  return await queryDatabase(query);
}
async function DocDashoardAppstatusQuery(table, app_status, app_id) {
  const query = `SELECT * FROM ${table} WHERE ${table}.status = '${app_status}' AND ${table}.doctor_id = ${app_id}`;
  return await queryDatabase(query);
}
async function DocNotificationQuery(table, app_id) {
  const query = `SELECT * FROM ${table} WHERE ${table}.doctor_id = ${app_id}`;
  return await queryDatabase(query);
}
async function docAppointmentdetailsQuerybyId(table, app_id) {
  const query = `SELECT * FROM ${table} WHERE ${table}.doctor_id = ${app_id}`;
  return await queryDatabase(query);
}
async function docAppointmentQuerybystatusId(table, app_status, app_id) {
  const query = `SELECT * FROM ${table} WHERE ${table}.status = '${app_status}' AND ${table}.doctor_id = ${app_id}`;
  return await queryDatabase(query);
}
async function getDocAppStatusRecord(table, whereColumns, joinParams, selectParams = "*", order = "desc", orderBy = "appointment_id") {
  const whereClause = Object.keys(whereColumns).map(key => `${key} = ?`).join(` ${joinParams} `);
  const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
  return await queryDatabase(query, [...Object.values(whereColumns)]);
}
async function getDocListingRecord(table, whereColumns, joinParams, selectParams = "*", order = "desc", orderBy = "doctor_id") {
  const whereClause = Object.keys(whereColumns).map(key => `${key} = ?`).join(` ${joinParams} `);
  const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
  return await queryDatabase(query, [...Object.values(whereColumns)]);
}
async function getDocAppRecord(table, whereColumns, joinParams, selectParams = "*", order = "desc", orderBy = "doctor_id") {
  const whereClause = Object.keys(whereColumns).map(key => `${key} = ?`).join(` ${joinParams} `);
  const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
  return await queryDatabase(query, [...Object.values(whereColumns)]);
}
async function doctordetailsQueryId(table1, table2, table3, column1, column2, column3, column4, column5, id) {
  // const query = `SELECT * FROM  ${table2} WHERE   ${table2}.doctor_id =  ${id} ;`;
  const query = ` SELECT *  FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2} JOIN ${table3} ON  ${table2}.${column3} =  ${table3}.${column4}
    WHERE ${table1}.role_id = '3' AND ${table2}.doctor_id = ${id} `;
  return await queryDatabase(query, [id]);
}
async function getDocDetailRecord(table, whereColumns, joinParams, selectParams = "*", order = "desc", orderBy = "doctor_id") {
  const whereClause = Object.keys(whereColumns).map(key => `${key} = ?`).join(` ${joinParams} `);
  const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
  return await queryDatabase(query, [...Object.values(whereColumns)]);
}

// export async function getDocListingRecord(
//     table,
//     whereColumns,
//     joinParams,
//     selectParams = "*",
//     order = "desc",
//     orderBy = "doctor_id",
// ) {
//     const whereClause = Object.keys(whereColumns)
//         .map((key) => `${key} = ?`)
//         .join(` ${joinParams} `);
//     const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
//     return await queryDatabase(query, [...Object.values(whereColumns)]);
// }

async function DocAppointmentHistory(table, app_id) {
  // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
  const query = `SELECT * FROM ${table} WHERE ${table}.doctor_id = ${app_id}`;
  return await queryDatabase(query);
}
async function DoctransactionQuery(table, doc_id) {
  // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
  const query = `SELECT * FROM ${table} WHERE ${table}.user_id = ${doc_id}`;
  return await queryDatabase(query);
}
// export async function getDocListingRecord(
//     table,
//     whereColumns,
//     joinParams,
//     selectParams = "*",
//     order = "desc",
//     orderBy = "doctor_id",
// ) {
//     const whereClause = Object.keys(whereColumns)
//         .map((key) => `${key} = ?`)
//         .join(` ${joinParams} `);
//     const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
//     return await queryDatabase(query, [...Object.values(whereColumns)]);
// }

// -----------------------------------------------------------Patient -------------------------------------------
// Patient Dashboard All Doctors details
async function dashboarddocdetailsQuery(table1, table2, table3, column1, column2, column3, column4) {
  const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2} JOIN ${table3} ON  ${table2}.${column3} =  ${table3}.${column4} 
    WHERE ${table1}.role_id = '3'`;
  return await queryDatabase(query);
}

// Patient Dashboard Single Doctors details 
async function dashboarddocdetailsQueryId(table1, table2, table3, column1, column2, column3, column4, doc_id) {
  const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2} JOIN ${table3} ON  ${table2}.${column3} =  ${table3}.${column4} 
    WHERE ${table1}.role_id = '3' AND ${table2}.doctor_id = ${doc_id} `;
  return await queryDatabase(query);
}

// Patient Dashboard All HCF details
async function dashboardhcfdetailsQuery(table1, table2, column1, column2) {
  const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2}  
    WHERE ${table1}.role_id = '4'`;
  return await queryDatabase(query);
}

// Patient Dashboard Single HCF details 
async function dashboardhcfdetailsQueryId(table1, table2, column1, column2, hcf_id) {
  const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2}  
    WHERE ${table1}.role_id = '4' AND ${table2}.hcf_id = ${hcf_id} `;
  return await queryDatabase(query);
}
async function patientActivityQuery(table, app_id) {
  // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
  const query = `SELECT * FROM ${table} WHERE ${table}.patient_id = ${app_id}`;
  return await queryDatabase(query);
}
async function patientNotificationQuery(table, app_id) {
  // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
  const query = `SELECT * FROM ${table} WHERE ${table}.patient_id = ${app_id}`;
  return await queryDatabase(query);
}
async function patientappQuerybystatusid(table, app_status, app_id) {
  // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
  const query = `SELECT * FROM ${table} WHERE ${table}.status = '${app_status}' AND ${table}.patient_id = ${app_id}`;
  return await queryDatabase(query);
}
async function appointmentHistoryQuery(table, app_id) {
  // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
  const query = `SELECT * FROM ${table} WHERE ${table}.patient_id = ${app_id}`;
  return await queryDatabase(query);
}
async function patienttransactionQuery(table, user_id) {
  // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
  const query = `SELECT * FROM ${table} WHERE ${table}.user_id = ${user_id}`;
  return await queryDatabase(query);
}
async function patientPlanQuery(table, pat_id) {
  // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
  const query = `SELECT * FROM ${table} WHERE ${table}.patient_id = ${pat_id}`;
  return await queryDatabase(query);
}

/***/ }),

/***/ "./database/index.js":
/*!***************************!*\
  !*** ./database/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initConnection: () => (/* binding */ initConnection)
/* harmony export */ });
/* harmony import */ var serverless_mysql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! serverless-mysql */ "serverless-mysql");
/* harmony import */ var serverless_mysql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(serverless_mysql__WEBPACK_IMPORTED_MODULE_0__);

let pool;
const initConnection = async () => {
  try {
    if (!pool) {
      console.log("connecting to database............");
      pool = serverless_mysql__WEBPACK_IMPORTED_MODULE_0___default()({
        config: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          waitForConnections: true,
          connectionLimit: process.env.CONNECTION_LIMIT,
          // maximum number of connections in the pool
          queueLimit: process.env.QUEUE_LIMIT // maximum number of requests in the queue
        }
      });

      console.log("connected to database");
      return pool;
    }
    console.log("using cached connection............");
    return pool;
  } catch (err) {
    console.log("Error occurred in database connection", err);
    throw err;
  }
};

/***/ }),

/***/ "./database/tables.js":
/*!****************************!*\
  !*** ./database/tables.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tableNames: () => (/* binding */ tableNames)
/* harmony export */ });
const tableNames = {
  SEC_COUNTRIES: "sec_countries",
  SEC_STATES: "sec_states",
  SEC_CITIES: "sec_cities",
  SEC_ROLES: "sec_roles",
  SEC_DEPARTMENTS: "sec_departments",
  SEC_USERS: "sec_users",
  SEC_USER_CODES: "sec_user_codes",
  SEC_PATIENT_PLANS: "sec_patient_plans",
  SEC_DOCTORS_DETAILS: "sec_doctors_details",
  VW_SEC_COMPLETE_DOCTOR_DETAILS: "completedoctordetails",
  SEC_APPOINTMENTS: "sec_appointments",
  SEC_TRANSACTIONS: "sec_transactions",
  SEC_DOCTOR_LISTING: "sec_doc_listing_details",
  SEC_HCF_DETAILS: "sec_hcf_details"
};

/***/ }),

/***/ "./helpers/aws-helper.js":
/*!*******************************!*\
  !*** ./helpers/aws-helper.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sendEmailToUser: () => (/* binding */ sendEmailToUser),
/* harmony export */   sendOTPToUser: () => (/* binding */ sendOTPToUser)
/* harmony export */ });
/* harmony import */ var _aws_sdk_client_ses__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aws-sdk/client-ses */ "@aws-sdk/client-ses");
/* harmony import */ var _aws_sdk_client_ses__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_client_ses__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _aws_sdk_client_sns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aws-sdk/client-sns */ "@aws-sdk/client-sns");
/* harmony import */ var _aws_sdk_client_sns__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_aws_sdk_client_sns__WEBPACK_IMPORTED_MODULE_1__);


const config = {
  region: process.env.REGION
};
const sesClient = new _aws_sdk_client_ses__WEBPACK_IMPORTED_MODULE_0__.SESClient(config);
const snsClient = new _aws_sdk_client_sns__WEBPACK_IMPORTED_MODULE_1__.SNSClient(config);
const sendEmailToUser = async (sendTo, subject, body) => {
  try {
    const input = {
      Source: process.env.FROM_EMAIL_ADDRESS,
      // required
      Destination: {
        ToAddresses: [sendTo]
      },
      Message: {
        // Message
        Subject: {
          Charset: "UTF-8",
          Data: subject
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body
          }
        }
      },
      ReplyToAddresses: [process.env.FROM_EMAIL_ADDRESS]
    };
    const command = new _aws_sdk_client_ses__WEBPACK_IMPORTED_MODULE_0__.SendEmailCommand(input);
    const response = await sesClient.send(command);
    console.log(`Email has been sent to ${sendTo}`);
    console.log(response);
    return response;
  } catch (err) {
    console.log("Error occured in sending email to user due to", err);
    throw err;
  }
};
const sendOTPToUser = async (phoneNumber, message) => {
  const messageAttributes = {
    "SEC.SNS.SMS.SMSType": {
      DataType: "String",
      StringValue: "Transactional"
    },
    "SEC.SNS.SMS.SenderID": {
      DataType: "String",
      StringValue: "SenderID"
    },
    "SEC.SNS.SMS.MessageType": {
      DataType: "String",
      StringValue: "SMS"
    },
    "SEC.SNS.SMS.OriginationNumber": {
      DataType: "String",
      StringValue: "OriginationNumber"
    }
  };
  try {
    const publishParams = {
      Message: message,
      MessageAttributes: messageAttributes,
      PhoneNumber: phoneNumber
    };
    const command = new _aws_sdk_client_sns__WEBPACK_IMPORTED_MODULE_1__.PublishCommand(publishParams);
    const response = await snsClient.send(command);
    console.log("Message sent. Message ID:", response.MessageId);
    console.log(`OTP sent successfully to ${phoneNumber}`);
    console.log(response);
    return response;
  } catch (err) {
    console.log("Error occured in sending otp to user due to", err);
    console.error(`Failed to send OTP to ${phoneNumber}:`, err);
    throw err;
  }
};

/***/ }),

/***/ "./helpers/image-helper.js":
/*!*********************************!*\
  !*** ./helpers/image-helper.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateDummyProfileImg: () => (/* binding */ generateDummyProfileImg),
/* harmony export */   getRandomColor: () => (/* binding */ getRandomColor)
/* harmony export */ });
//#!/usr/bin/env node
"strict mode";

class ProfileImage {
  constructor(initials, options = {}) {
    this.initials = initials;
    this.width = 100;
    this.height = 100;
    this.textColor = options.textColor || "#ffffff";
    this.backgroundColor = options.backgroundColor;
    this.fontFamily = options.fontFamily || "sans-serif";
    this.fontSize = this.height / (this.initials.length * 0.5 + 1);
    this.fontWeight = options.fontWeight || "bold";
  }
  png() {
    // returns png as base64 string
    /* eslint-disable global-require */
    const {
      createCanvas
    } = __webpack_require__(/*! canvas */ "canvas");
    const canvas = createCanvas(this.width, this.height);
    const context = canvas.getContext("2d");
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = this.height / 2;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = `#${this.backgroundColor}`;
    context.fill();
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.textAlign = "center";
    context.fillStyle = this.textColor;

    // context.textBaseline = "middle";
    context.fillText(this.initials, canvas.width / 2, canvas.height / 2 + this.fontSize * 0.68 / 2);
    return canvas.toDataURL("image/png");
  }
}
const getRandomColor = async () => {
  let color = "";
  const possible = "ABCDEFabcdef0123456789";
  for (let i = 0; i < 6; i++) color += possible.charAt(Math.floor(Math.random() * possible.length));
  return color;
};
const generateDummyProfileImg = async name => {
  const color = await getRandomColor();
  const text = name.slice(0, 2).toUpperCase();
  const img = new ProfileImage(text, {
    backgroundColor: color
  });
  const src = img.png();
  return src;
};

/***/ }),

/***/ "./helpers/mail-helper.js":
/*!********************************!*\
  !*** ./helpers/mail-helper.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sendActivationCode: () => (/* binding */ sendActivationCode)
/* harmony export */ });
/* harmony import */ var _configs_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../configs/common */ "./configs/common.js");
/* harmony import */ var _aws_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./aws-helper */ "./helpers/aws-helper.js");
"strict mode";



const sendActivationCode = async (email, code, sub, action) => {
  console.log(email, code, sub, action);
  try {
    const subject = `Share-e-care ${sub} code`;
    const body = `<html> \
                        <head> \
                            <title>Welcome to Share-e-care</title> \
                        </head> \
                        <body> \
                            <div>Please use this code to ${action}. Your code is ${code} and will expire in ${_configs_common__WEBPACK_IMPORTED_MODULE_0__.randomNumber.minutes} minutes</div> \
                        </body> \
                        </html>`;

    // await sendEmailToUser(email, subject, body);
    console.log("Code has been sent to ", email);
  } catch (err) {
    console.log("Error occured in sending activation code due to", err);
    throw err;
  }
};

/***/ }),

/***/ "./helpers/models/user-model.js":
/*!**************************************!*\
  !*** ./helpers/models/user-model.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getUserModel: () => (/* binding */ getUserModel)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "@babel/runtime/helpers/defineProperty");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _configs_sec_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../configs/sec-types */ "./configs/sec-types.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

const getUserModel = data => {
  const newData = _objectSpread({}, data);
  if (newData.token_id === undefined) {
    newData.registration_type = _configs_sec_types__WEBPACK_IMPORTED_MODULE_1__.registration_type.EMAIL;
    newData.tokens = [];
  } else {
    newData.registration_type = _configs_sec_types__WEBPACK_IMPORTED_MODULE_1__.registration_type.SSO;
    newData.tokens = [{
      token_id: newData.token_id,
      SSO_type: newData.registered_via,
      is_login: true
    }];
  }
  const userData = {
    email: newData.email ? newData.email.trim() : newData.email,
    first_name: newData.first_name ? newData.first_name.trim() : newData.first_name,
    last_name: newData.last_name ? newData.last_name.trim() : newData.last_name,
    middle_name: newData.middle_name ? newData.middle_name.trim() : newData.middle_name,
    added_by: newData.added_by || "",
    gender: newData.gender || "",
    DOB: newData.DOB ? newData.DOB.trim() : newData.DOB,
    country_id: newData.country_id,
    state_id: newData.state_id,
    city_id: newData.city_id,
    street_address1: newData.street_address1,
    street_address2: newData.street_address2,
    zip_code: newData.zip_code
  };
  return userData;
};

/***/ }),

/***/ "@aws-sdk/client-ses":
/*!**************************************!*\
  !*** external "@aws-sdk/client-ses" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-ses");

/***/ }),

/***/ "@aws-sdk/client-sns":
/*!**************************************!*\
  !*** external "@aws-sdk/client-sns" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("@aws-sdk/client-sns");

/***/ }),

/***/ "@babel/runtime/helpers/defineProperty":
/*!********************************************************!*\
  !*** external "@babel/runtime/helpers/defineProperty" ***!
  \********************************************************/
/***/ ((module) => {

module.exports = require("@babel/runtime/helpers/defineProperty");

/***/ }),

/***/ "canvas":
/*!*************************!*\
  !*** external "canvas" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("canvas");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "serverless-mysql":
/*!***********************************!*\
  !*** external "serverless-mysql" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("serverless-mysql");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./auth-service/handler.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   authenticateUser: () => (/* binding */ authenticateUser),
/* harmony export */   changePassword: () => (/* binding */ changePassword),
/* harmony export */   forgotPassword: () => (/* binding */ forgotPassword),
/* harmony export */   registerUser: () => (/* binding */ registerUser),
/* harmony export */   resendCode: () => (/* binding */ resendCode),
/* harmony export */   updateProfile: () => (/* binding */ updateProfile),
/* harmony export */   verifyUserEmail: () => (/* binding */ verifyUserEmail),
/* harmony export */   verifyUserOtp: () => (/* binding */ verifyUserOtp)
/* harmony export */ });
/* harmony import */ var _configs_utility__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../configs/utility */ "./configs/utility.js");
/* harmony import */ var _helpers_models_user_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/models/user-model */ "./helpers/models/user-model.js");
/* harmony import */ var _user_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user-adapter */ "./auth-service/user-adapter.js");



const registerUser = async event => {
  try {
    const data = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseEventBody)(event.body);
    // console.log(data);
    const user = await (0,_user_adapter__WEBPACK_IMPORTED_MODULE_2__._registerUser)(data);
    console.log(user);
    if (user) {
      return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
        response: user
      }, 200);
    }
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: "USER_NOT_EXISTS"
    }, 200);
  } catch (err) {
    console.log("Error in registerUser handler", err, err.message);
    const {
      message,
      code
    } = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseError)(err.message);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createErrorResponse)({
      error: message
    }, code || 500);
  }
};
const verifyUserEmail = async event => {
  try {
    const data = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseEventBody)(event.body);
    const user = await (0,_user_adapter__WEBPACK_IMPORTED_MODULE_2__._verifyEmail)(data);
    if (user) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: user
    }, 200);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: "USER_NOT_EXISTS"
    }, 200);
  } catch (err) {
    console.log("Error in verifyUserEmail handler", err, err.message);
    const {
      message,
      code
    } = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseError)(err.message);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createErrorResponse)({
      error: message
    }, code || 500);
  }
};
const updateProfile = async event => {
  try {
    const data = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseEventBody)(event.body);
    const userData = (0,_helpers_models_user_model__WEBPACK_IMPORTED_MODULE_1__.getUserModel)(data);
    const user = await (0,_user_adapter__WEBPACK_IMPORTED_MODULE_2__._updateProfile)(userData);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: user
    }, 200);
  } catch (err) {
    console.log("Error in updateProfile handler", err, err.message);
    const {
      message,
      code
    } = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseError)(err.message);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createErrorResponse)({
      error: message
    }, code || 500);
  }
};
const authenticateUser = async event => {
  try {
    const data = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseEventBody)(event.body);
    const user = await (0,_user_adapter__WEBPACK_IMPORTED_MODULE_2__._authenticateUser)(data);
    if (user) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: user
    }, 200);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: "USER_NOT_EXISTS"
    }, 200);
  } catch (err) {
    console.log("Error in authenticateUser handler", err, err.message);
    const {
      message,
      code
    } = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseError)(err.message);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createErrorResponse)({
      error: message
    }, code || 500);
  }
};
const verifyUserOtp = async event => {
  try {
    const data = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseEventBody)(event.body);
    const user = await (0,_user_adapter__WEBPACK_IMPORTED_MODULE_2__._verifyOtp)(data);
    if (user) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: user
    }, 200);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: "USER_NOT_EXISTS"
    }, 200);
  } catch (err) {
    console.log("Error in verifyUserOtp handler", err, err.message);
    const {
      message,
      code
    } = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseError)(err.message);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createErrorResponse)({
      error: message
    }, code || 500);
  }
};
const resendCode = async event => {
  try {
    const data = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseEventBody)(event.body);
    const user = await (0,_user_adapter__WEBPACK_IMPORTED_MODULE_2__._resendCode)(data);
    if (user) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: user
    }, 200);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: "USER_NOT_EXISTS"
    }, 200);
  } catch (err) {
    console.log("Error in verifyUserOtp handler", err, err.message);
    const {
      message,
      code
    } = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseError)(err.message);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createErrorResponse)({
      error: message
    }, code || 500);
  }
};
const forgotPassword = async event => {
  try {
    const data = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseEventBody)(event.body);
    const user = await (0,_user_adapter__WEBPACK_IMPORTED_MODULE_2__._forgotPassword)(data);
    console.log(user);
    if (user) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: user
    }, 200);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: "USER_NOT_EXISTS"
    }, 200);
  } catch (err) {
    console.log("Error in verifyUserOtp handler", err, err.message);
    const {
      message,
      code
    } = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseError)(err.message);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createErrorResponse)({
      error: message
    }, code || 500);
  }
};
const changePassword = async event => {
  try {
    const data = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseEventBody)(event.body);
    const user = await (0,_user_adapter__WEBPACK_IMPORTED_MODULE_2__._changePassword)(data);
    if (user) return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: user
    }, 200);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createSuccessResponse)({
      response: "USER_NOT_EXISTS"
    }, 200);
  } catch (err) {
    console.log("Error in verifyUserOtp handler", err, err.message);
    const {
      message,
      code
    } = (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.parseError)(err.message);
    return (0,_configs_utility__WEBPACK_IMPORTED_MODULE_0__.createErrorResponse)({
      error: message
    }, code || 500);
  }
};
})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=handler.js.map