import { createRecord, getRecordByParams, runRawQuery, updateRecord } from "../database/helper";
import { tableNames } from "../database/tables";
import {
    hashString,
    generateJWT,
    addHoursToDate,
    descryptHashString,
    generateError,
    getOTP,
    getRandomNumber,
} from "../configs/utility";
import { expirationTime, userStatus, userRole } from "../configs/sec-types";
import { sendActivationCode } from "../helpers/mail-helper";
import { generateDummyProfileImg } from "../helpers/image-helper";
import { sendOTPToUser } from "../helpers/aws-helper";
import { randomNumber } from "../configs/common";

export const _registerUser = async (userData) => {
    let OTP = null;
    const { email, mobile: contact_no_primary, role_id, password, added_by } = userData;
    const params = {
        email,
        contact_no_primary,
    };
    const dbUser = await getRecordByParams(tableNames.SEC_USERS, params, "OR");

    if (dbUser.length) {
        if (dbUser[0].email === email.toLowerCase()) return generateError("EMAIL_EXISTS", 403);
        if (dbUser[0].contact_no_primary === contact_no_primary)
            return generateError("MOBILE_EXISTS", 403);
    } else {
        const newUser = {
            email,
            contact_no_primary,
            role_id,
            password,
            added_by,
        };

        newUser.profile_picture = await generateDummyProfileImg(email);

        if (newUser.password)
            newUser.password = hashString(newUser.password ? newUser.password : "");
        else {
            OTP = getOTP();
            newUser.password = hashString(OTP);
        }
        const user = await createRecord(tableNames.SEC_USERS, [newUser], true, "suid");

        const activationCodeData = {
            activation_code: getRandomNumber(),
            activation_code_generated_on: new Date(),
            suid: user.suid,
            email: user.email,
        };

        await _insertActivationCode(activationCodeData);

        await createRecord(tableNames.SEC_PATIENT_PLANS, [newUser], true, "suid");

        return generateError("EMAIL_NOT_VERIFIED", 202);
    }
    return generateError("REGISTRATION_FAILED", 404);
};

export const _authenticateUser = async (userData) => {
    const { email, mobile, password, remember_me, login_with_email } = userData;

    const params = {
        email,
        contact_no_primary: mobile,
    };

    const dbUser = await getRecordByParams(tableNames.SEC_USERS, params, "OR");

    const selectParams =
        "suid, email, profile_picture, access_token, access_token_expires_on, free_trial_expiration";

    if (dbUser.length) {
        if (dbUser[0].is_active === userStatus.ACTIVE) {
            if (dbUser[0].can_login === userStatus.ACTIVE) {
                if (login_with_email) {
                    const checkPwd = password === descryptHashString(dbUser[0].password);

                    if (checkPwd) {
                        if (!dbUser[0].free_trial_expiration) {
                            const currentDate = new Date();
                            currentDate.setDate(currentDate.getDate() + 14);

                            await _updateProfile({
                                free_trial_expiration: currentDate,
                                email,
                            });
                        } else if (new Date() > new Date(dbUser[0].free_trial_expiration)) {
                            return generateError("SUBSCRIPTION_EXPIRED", 202);
                        }
                        await _insertAccessToken(dbUser[0], remember_me);

                        const user = await getRecordByParams(
                            tableNames.SEC_USERS,
                            params,
                            "OR",
                            selectParams,
                        );
                        return user[0];
                    }
                    return generateError("USER_PASSWORD_INCORRECT", 404);
                }
                await _sendOtpCode(dbUser[0].suid, dbUser[0].contact_no_primary);
                return {
                    message: "ACTIVATION_CODE_SENT",
                };
            }
            return generateError("INCOMPLETE_PROFILE", 202);
        }
        return generateError("EMAIL_NOT_VERIFIED", 202);
    }
    return generateError("USER_NOT_EXISTS", 404);
};

export const _verifyEmail = async (data) => {
    const { email, activation_code } = data;

    const params = {
        email,
    };
    const dbUser = await getRecordByParams(
        tableNames.SEC_USERS,
        params,
        "",
        "suid, is_active, role_id, is_approved",
    );

    if (dbUser.length) {
        if (dbUser[0].is_active === userStatus.ACTIVE) {
            if (
                dbUser[0].role_id === userRole.DOCTOR &&
                dbUser[0].is_approved === userStatus.IN_ACTIVE
            )
                return generateError("ADMIN_APPROVAL_REQUIRED", 202);
            return {
                message: "EMAIL_VERIFIED",
            };
        }
        const codeParams = {
            user_id: dbUser[0].suid,
            activation_code,
        };
        const isValidActivationCode = await getRecordByParams(
            tableNames.SEC_USER_CODES,
            codeParams,
            "AND",
            "*",
            "desc",
            "code_id",
        );

        if (isValidActivationCode.length) {
            const codeGeneratedDate = new Date(
                isValidActivationCode[0].activation_code_generated_on,
            );
            codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + randomNumber.minutes);

            if (codeGeneratedDate >= new Date()) {
                if (
                    activation_code.toString() ===
                    isValidActivationCode[0].activation_code.toString()
                ) {
                    const records = {
                        is_active: userStatus.ACTIVE,
                    };

                    const whereClause = {
                        suid: dbUser[0].suid,
                        email,
                    };

                    await updateRecord(tableNames.SEC_USERS, records, whereClause, "AND");
                } else return generateError("INVALID_ACTIVATION_CODE", 404);
            } else {
                return generateError("ACTIVATION_CODE_EXPIRED", 404);
            }
            return {
                message: "EMAIL_VERIFIED",
            };
        }
        return generateError("INVALID_ACTIVATION_CODE", 404);
    }
    return generateError("USER_NOT_EXISTS", 404);
};

export const _updateProfile = async (data) => {
    const records = { ...data };
    delete records.email;

    const dbUser = await getRecordByParams(
        tableNames.SEC_USERS,
        { email: data.email },
        "",
        "suid, email, is_active, role_id, is_approved",
    );

    if (dbUser.length) {
        if (dbUser[0].is_active === userStatus.ACTIVE) {
            if (
                dbUser[0].role_id === userRole.DOCTOR &&
                dbUser[0].is_approved === userStatus.IN_ACTIVE
            )
                return generateError("ADMIN_APPROVAL_REQUIRED", 202);

            const selectParams =
                "suid, email, profile_picture, access_token, access_token_expires_on, free_trial_expiration";

            const whereClause = {
                email: dbUser[0].email,
                suid: dbUser[0].suid,
            };

            records.can_login = 0;

            await updateRecord(tableNames.SEC_USERS, records, whereClause, "AND");

            await _insertAccessToken(dbUser[0], false);

            const user = await getRecordByParams(
                tableNames.SEC_USERS,
                whereClause,
                "OR",
                selectParams,
            );
            return user[0];
        }
        return generateError("EMAIL_NOT_VERIFIED", 202);
    }
    return generateError("USER_NOT_EXISTS", 404);
};

export const _verifyOtp = async (data) => {
    const { mobile: contact_no_primary, otp_code } = data;

    const params = {
        contact_no_primary,
    };
    const dbUser = await getRecordByParams(
        tableNames.SEC_USERS,
        params,
        "",
        "suid, is_active, role_id, is_approved, can_login, free_trial_expiration",
    );

    if (dbUser.length) {
        const codeParams = {
            user_id: dbUser[0].suid,
            otp_code,
        };
        const isValidActivationCode = await getRecordByParams(
            tableNames.SEC_USER_CODES,
            codeParams,
            "AND",
            "*",
            "desc",
            "user_id",
        );

        if (isValidActivationCode.length) {
            const codeGeneratedDate = new Date(isValidActivationCode[0].otp_code_generated_on);
            codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + randomNumber.minutes);

            if (codeGeneratedDate >= new Date()) {
                if (
                    otp_code.toString() === isValidActivationCode[0].otp_code.toString() &&
                    isValidActivationCode[0].is_expired === userStatus.ACTIVE
                ) {
                    const selectParams =
                        "suid, email, profile_picture, access_token, access_token_expires_on, free_trial_expiration";

                    if (dbUser[0].is_active === userStatus.ACTIVE) {
                        if (
                            dbUser[0].role_id === userRole.DOCTOR &&
                            dbUser[0].is_approved === userStatus.IN_ACTIVE
                        )
                            return generateError("ADMIN_APPROVAL_REQUIRED", 202);
                        if (dbUser[0].can_login === userStatus.IN_ACTIVE)
                            return generateError("INCOMPLETE_PROFILE", 202);

                        if (!dbUser[0].free_trial_expiration) {
                            const currentDate = new Date();
                            currentDate.setDate(currentDate.getDate() + 14);

                            await _updateProfile({
                                free_trial_expiration: currentDate,
                                email: dbUser[0],
                            });
                        } else if (new Date() > new Date(dbUser[0].free_trial_expiration)) {
                            return generateError("SUBSCRIPTION_EXPIRED", 202);
                        }
                        await _insertAccessToken(dbUser[0], false);

                        const user = await getRecordByParams(
                            tableNames.SEC_USERS,
                            params,
                            "OR",
                            selectParams,
                        );
                        return user[0];
                    }
                    return generateError("EMAIL_NOT_VERIFIED", 202);
                }
                return generateError("INVALID_OTP_CODE", 404);
            }
            return generateError("ACTIVATION_CODE_EXPIRED", 404);
        }
        return generateError("INVALID_OTP_CODE", 404);
    }
    return generateError("USER_NOT_EXISTS", 404);
};

export const _resendCode = async (data) => {
    const { email, mobile: contact_no_primary } = data;

    const params = {};

    if (email) {
        params.email = email;
    }
    if (contact_no_primary) {
        params.contact_no_primary = contact_no_primary;
    }

    const dbUser = await getRecordByParams(
        tableNames.SEC_USERS,
        params,
        "",
        "suid, email, contact_no_primary, is_active, role_id, is_approved, can_login",
    );

    if (dbUser.length) {
        if (dbUser[0].role_id === userRole.DOCTOR && dbUser[0].is_approved === userStatus.IN_ACTIVE)
            return generateError("ADMIN_APPROVAL_REQUIRED", 202);

        if (email) {
            const existingCodeData = await runRawQuery(
                `SELECT * from ${tableNames.SEC_USER_CODES} WHERE user_id = ${dbUser[0].suid} AND activation_code IS NOT NULL ORDER BY code_id DESC`,
            );

            if (existingCodeData.length) {
                const codeGeneratedDate = new Date(
                    existingCodeData[0].activation_code_generated_on,
                );
                codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + randomNumber.minutes);

                if (existingCodeData[0].no_of_email_tries < 3) {
                    return _updateActivationCode(
                        existingCodeData[0],
                        dbUser[0].suid,
                        dbUser[0].email,
                    );
                }
                if (new Date() > codeGeneratedDate) {
                    const activationCodeData = {
                        activation_code: getRandomNumber(),
                        activation_code_generated_on: new Date(),
                        suid: dbUser[0].suid,
                        email: dbUser[0].email,
                    };
                    return _insertActivationCode(
                        activationCodeData,
                        true,
                        "activation",
                        "validate",
                    );
                }

                return generateError("NO_OF_TRIES_EXCEEDED", 202);
            }
            const activationCodeData = {
                activation_code: getRandomNumber(),
                activation_code_generated_on: new Date(),
                suid: dbUser[0].suid,
                email: dbUser[0].email,
            };
            return _insertActivationCode(activationCodeData, true, "activation", "validate");
        }
        const existingCodeData = await runRawQuery(
            `SELECT * from ${tableNames.SEC_USER_CODES} WHERE user_id = ${dbUser[0].suid} AND otp_code IS NOT NULL ORDER BY code_id DESC`,
        );

        if (existingCodeData.length) {
            const codeGeneratedDate = new Date(existingCodeData[0].otp_code_generated_on);
            codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + randomNumber.minutes);

            if (existingCodeData[0].no_of_mobile_tries < 3) {
                return _updateOtpCode(existingCodeData[0], dbUser[0].contact_no_primary);
            }
            if (new Date() > codeGeneratedDate) {
                await _sendOtpCode(dbUser[0].suid, dbUser[0].contact_no_primary);
                return {
                    message: "ACTIVATION_CODE_SENT",
                };
            }

            return generateError("NO_OF_TRIES_EXCEEDED", 202);
        }
        await _sendOtpCode(dbUser[0].suid, dbUser[0].contact_no_primary);
        return {
            message: "ACTIVATION_CODE_SENT",
        };
    }
    return generateError("USER_NOT_EXISTS", 404);
};

export const _forgotPassword = async (data) => {
    const { email } = data;

    const dbUser = await getRecordByParams(
        tableNames.SEC_USERS,
        { email },
        "",
        "suid, email, is_active, role_id, is_approved, can_login",
    );

    if (dbUser.length) {
        if (dbUser[0].is_active === userStatus.ACTIVE) {
            if (
                dbUser[0].role_id === userRole.DOCTOR &&
                dbUser[0].is_approved === userStatus.IN_ACTIVE
            )
                return generateError("ADMIN_APPROVAL_REQUIRED", 202);

            const activationCodeData = {
                activation_code: getRandomNumber(),
                activation_code_generated_on: new Date(),
                suid: dbUser[0].suid,
                email: dbUser[0].email,
            };

            return await _insertActivationCode(
                activationCodeData,
                true,
                "password reset",
                "reset your password",
            );
        }
        return generateError("EMAIL_NOT_VERIFIED", 202);
    }
    return generateError("USER_NOT_EXISTS", 404);
};

export const _changePassword = async (data) => {
    const { email, activation_code, new_password } = data;

    const dbUser = await getRecordByParams(
        tableNames.SEC_USERS,
        { email },
        "",
        "suid, email, is_active, role_id, is_approved, can_login",
    );

    if (dbUser.length) {
        const codeParams = {
            user_id: dbUser[0].suid,
            activation_code,
        };
        const isValidActivationCode = await getRecordByParams(
            tableNames.SEC_USER_CODES,
            codeParams,
            "AND",
            "*",
            "desc",
            "code_id",
        );

        const codeGeneratedDate = new Date(isValidActivationCode[0].activation_code_generated_on);
        codeGeneratedDate.setMinutes(codeGeneratedDate.getMinutes() + randomNumber.minutes);

        if (codeGeneratedDate >= new Date()) {
            if (
                activation_code.toString() ===
                    isValidActivationCode[0].activation_code.toString() &&
                isValidActivationCode[0].is_expired === userStatus.ACTIVE
            ) {
                const records = {
                    password: hashString(new_password || ""),
                };

                const whereClause = {
                    suid: dbUser[0].suid,
                    email,
                };

                await updateRecord(tableNames.SEC_USERS, records, whereClause, "AND");

                return {
                    message: "PASSWORD_CHANGE_SUCCESS",
                };
            }
            return generateError("INVALID_ACTIVATION_CODE", 404);
        }
        return generateError("ACTIVATION_CODE_EXPIRED", 404);
    }
    return generateError("USER_NOT_EXISTS", 404);
};
/** Helper functions */

export const _insertAccessToken = async (user, remember_me = false) => {
    const userToken = await generateJWT(user.suid, remember_me);

    if (user) {
        const records = {
            last_login: new Date(),
            access_token: userToken,
            access_token_generated_on: new Date(),
            access_token_expires_on: addHoursToDate(
                new Date(),
                remember_me ? expirationTime.remember.hours : expirationTime.normal.hours,
            ),
        };

        const whereClause = {
            suid: user.suid,
            email: user.email,
        };

        const updatedRecords = await updateRecord(
            tableNames.SEC_USERS,
            records,
            whereClause,
            "AND",
        );

        if (updatedRecords) {
            return records;
        }
        return generateError("TOKEN_INSERTION_FAILED", 400);
    }
    return generateError("USER_NOT_EXISTS", 404);
};

export const _insertActivationCode = async (
    userData,
    isRegenerate,
    sub = "account activation",
    message = "activate your account",
) => {
    const updatRecords = {
        is_expired: userStatus.IN_ACTIVE,
    };

    const whereClause = {
        user_id: userData.suid,
    };

    await updateRecord(tableNames.SEC_USER_CODES, updatRecords, whereClause, "");

    const records = {
        activation_code: userData.activation_code,
        activation_code_generated_on: userData.activation_code_generated_on,
        user_id: userData.suid,
    };

    await createRecord(tableNames.SEC_USER_CODES, [records]);
    await sendActivationCode(userData.email, userData.activation_code, sub, message);
    console.log("Activation code sent successfully to ", userData.email);
    if (!isRegenerate) return generateError("EMAIL_NOT_VERIFIED", 202);
    return {
        message: "ACTIVATION_CODE_SENT",
    };
};

export const _updateActivationCode = async (existingCodeData, user_id, email) => {
    const activation_code = getRandomNumber();
    const activationCodeData = {
        activation_code,
        activation_code_generated_on: new Date(),
        no_of_email_tries: existingCodeData.no_of_email_tries + 1,
    };

    const updateWhereClause = {
        user_id,
        code_id: existingCodeData.code_id,
    };

    await updateRecord(tableNames.SEC_USER_CODES, activationCodeData, updateWhereClause, "AND");

    await sendActivationCode(email, activation_code, "activation", "validate");
    console.log("Activation code sent successfully to ", email);

    return {
        message: "ACTIVATION_CODE_SENT",
    };
};

export const _sendOtpCode = async (user_id, mobile) => {
    const updatRecords = {
        is_expired: userStatus.IN_ACTIVE,
    };

    const whereClause = {
        user_id,
    };

    await updateRecord(tableNames.SEC_USER_CODES, updatRecords, whereClause, "");

    const otpCode = getOTP();

    const message = `Your OTP is ${otpCode} and it is valid for ${randomNumber.minutes} minutes. Please do not share it with anyone.`;

    const records = {
        otp_code: otpCode,
        otp_code_generated_on: new Date(),
        user_id,
    };

    await createRecord(tableNames.SEC_USER_CODES, [records]);

    await sendOTPToUser(mobile, message);
};

export const _updateOtpCode = async (existingCodeData, mobile) => {
    const otpCode = getOTP();

    const message = `Your OTP is ${otpCode} and it is valid for ${randomNumber.minutes} minutes. Please do not share it with anyone.`;

    const activationCodeData = {
        otp_code: otpCode,
        otp_code_generated_on: new Date(),
        no_of_mobile_tries: existingCodeData.no_of_mobile_tries + 1,
    };

    const updateWhereClause = {
        user_id: existingCodeData.user_id,
        code_id: existingCodeData.code_id,
    };

    await updateRecord(tableNames.SEC_USER_CODES, activationCodeData, updateWhereClause, "AND");

    await sendOTPToUser(mobile, message);

    return {
        message: "ACTIVATION_CODE_SENT",
    };
};
