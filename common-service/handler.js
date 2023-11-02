import { createSuccessResponse, createErrorResponse } from "../configs/utility";
import { tableNames } from "../database/tables";
import { getAllRecords, getRecordByParams } from "../database/helper";
import { getCountryCodesList } from "./helpers";

export const getCountryCodes = async (event, context, callback) => {
    try {
        const countryCodes = getCountryCodesList();
        return createSuccessResponse({ response: countryCodes }, 200);
    } catch (err) {
        console.log("Error in getCountryCodes handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getCountries = async (event, context, callback) => {
    try {
        const countries = await getAllRecords(tableNames.SEC_COUNTRIES);
        return createSuccessResponse({ response: countries }, 200);
    } catch (err) {
        console.log("Error in getCountries handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getStates = async (event, context, callback) => {
    try {
        if (event.queryStringParameters) {
            const { country_id } = event.queryStringParameters;

            if (!country_id) {
                return createErrorResponse({ error: "Missing country_id query parameters" }, 400);
            }
            const params = {
                country_id,
            };
            const states = await getRecordByParams(
                tableNames.SEC_STATES,
                params,
                "OR",
                "*",
                "asc",
                "state_id",
            );
            return createSuccessResponse({ response: states }, 200);
        }
        return createErrorResponse({ error: "Missing required query parameters" }, 400);
    } catch (err) {
        console.log("Error in getStates handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getCities = async (event, context, callback) => {
    try {
        if (event.queryStringParameters) {
            const { state_id } = event.queryStringParameters;

            if (!state_id) {
                return createErrorResponse({ error: "Missing state_id query parameters" }, 400);
            }
            const params = {
                state_id,
            };
            const states = await getRecordByParams(
                tableNames.SEC_CITIES,
                params,
                "OR",
                "*",
                "asc",
                "city_id",
            );
            return createSuccessResponse({ response: states }, 200);
        }
        return createErrorResponse({ error: "Missing required query parameters" }, 400);
    } catch (err) {
        console.log("Error in handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getRoles = async (event, context, callback) => {
    try {
        const countries = await getAllRecords(tableNames.SEC_ROLES);
        return createSuccessResponse({ response: countries }, 200);
    } catch (err) {
        console.log("Error in getCountries handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getDepartments = async (event, context, callback) => {
    try {
        const countries = await getAllRecords(tableNames.SEC_DEPARTMENTS);
        return createSuccessResponse({ response: countries }, 200);
    } catch (err) {
        console.log("Error in getCountries handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};
