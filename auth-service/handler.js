import {
    createSuccessResponse,
    createErrorResponse,
    parseEventBody,
    parseError,
} from "../configs/utility";
import { getUserModel } from "../helpers/models/user-model";
import {
    _authenticateUser,
    _updateProfile,
    _registerUser,
    _verifyEmail,
    _verifyOtp,
    _resendCode,
    _forgotPassword,
    _changePassword,
} from "./user-adapter";

export const registerUser = async (event) => {
    try {
        const data = parseEventBody(event.body);
        // console.log(data);
        const user = await _registerUser(data);
        console.log(user);
        if (user) {
            return createSuccessResponse({ response: user }, 200);
        }
        return createSuccessResponse({ response: "USER_NOT_EXISTS" }, 200);
    } catch (err) {
        console.log("Error in registerUser handler", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }
};

export const verifyUserEmail = async (event) => {
    try {
        const data = parseEventBody(event.body);

        const user = await _verifyEmail(data);

        if (user) return createSuccessResponse({ response: user }, 200);

        return createSuccessResponse({ response: "USER_NOT_EXISTS" }, 200);
    } catch (err) {
        console.log("Error in verifyUserEmail handler", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }
};

export const updateProfile = async (event) => {
    try {
        const data = parseEventBody(event.body);
        const userData = getUserModel(data);

        const user = await _updateProfile(userData);

        return createSuccessResponse({ response: user }, 200);
    } catch (err) {
        console.log("Error in updateProfile handler", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }
};

export const authenticateUser = async (event) => {
    try {
        const data = parseEventBody(event.body);

        const user = await _authenticateUser(data);

        if (user) return createSuccessResponse({ response: user }, 200);

        return createSuccessResponse({ response: "USER_NOT_EXISTS" }, 200);
    } catch (err) {
        console.log("Error in authenticateUser handler", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }
};

export const verifyUserOtp = async (event) => {
    try {
        const data = parseEventBody(event.body);

        const user = await _verifyOtp(data);

        if (user) return createSuccessResponse({ response: user }, 200);

        return createSuccessResponse({ response: "USER_NOT_EXISTS" }, 200);
    } catch (err) {
        console.log("Error in verifyUserOtp handler", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }
};

export const resendCode = async (event) => {
    try {
        const data = parseEventBody(event.body);

        const user = await _resendCode(data);

        if (user) return createSuccessResponse({ response: user }, 200);

        return createSuccessResponse({ response: "USER_NOT_EXISTS" }, 200);
    } catch (err) {
        console.log("Error in verifyUserOtp handler", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }
};

export const forgotPassword = async (event) => {
    try {
        const data = parseEventBody(event.body);

        const user = await _forgotPassword(data);
        console.log(user);
        if (user) return createSuccessResponse({ response: user }, 200);

        return createSuccessResponse({ response: "USER_NOT_EXISTS" }, 200);
    } catch (err) {
        console.log("Error in verifyUserOtp handler", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }
};

export const changePassword = async (event) => {
    try {
        const data = parseEventBody(event.body);

        const user = await _changePassword(data);

        if (user) return createSuccessResponse({ response: user }, 200);

        return createSuccessResponse({ response: "USER_NOT_EXISTS" }, 200);
    } catch (err) {
        console.log("Error in verifyUserOtp handler", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }
};
