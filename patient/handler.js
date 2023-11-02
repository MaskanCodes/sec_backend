import { tableNames } from "../database/tables";
import { getAllRecords, getRecordByParams, patientappQuerybystatusid, dashboarddocdetailsQuery, dashboarddocdetailsQueryId, patientActivityQuery, patientNotificationQuery,
    appointmentHistoryQuery, patienttransactionQuery, patientPlanQuery, dashboardhcfdetailsQuery, dashboardhcfdetailsQueryId } from "../database/helper";
// import { getCountryCodesList } from "./helpers";
import {
    createSuccessResponse,
    createErrorResponse,
    parseEventBody,
    parseError,
} from "../configs/utility";

import { getUserModel } from "../helpers/models/user-model";
import { _updatePateintProfile, _createAppointment
} from "./user-adapter";

export const getPatientprofile = async (event, context, callback) => {
    try {
        const patientprofile = await getAllRecords(tableNames.SEC_USERS);
        return createSuccessResponse({ response: patientprofile }, 200);
    } catch (err) {
        console.log("Error in getPatientprofile handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const createAppointment = async (event) => {
    try {
        const userData = parseEventBody(event.body);
        console.log("n", userData);
        // const userData = getUserModel(data);
        // console.log("younus", userData.length);
        // const puser = await _updatePateintProfile(userData);
        const user = await _createAppointment(userData);
        if (user) {
            return createSuccessResponse({ response: user }, 200);
        }
        return createSuccessResponse({ response: " Appointment exists" }, 200);
    } catch (err) {
        console.log("Error in booking appoinmentment", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }
};



export const getAppointment = async (event, context, callback) => {
    try {
        const patientAppointment = await getAllRecords(tableNames.SEC_APPOINTMENTS);
        return createSuccessResponse({ response: patientAppointment }, 200);
    } catch (err) {
        console.log("Error in patientAppointment handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};


// -------------- Patient ------------------------------------------------


export const getDashboardDoctordetails = async (event, context, callback) => {
    try {
        const doctordetails = await dashboarddocdetailsQuery(tableNames.SEC_USERS, tableNames.SEC_DOCTORS_DETAILS, tableNames.SEC_DEPARTMENTS, "suid","doctor_id","speciality_id","department_id");
        return createSuccessResponse({ response: doctordetails }, 200);
    } catch (err) {
        console.log("Error in getDoctordetails handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};



export const getDashboardDoctordetailsbyId = async (event, context, callback) => {
    try {
        const doc_id = event.pathParameters.id;
        const doctordetails = await dashboarddocdetailsQueryId(tableNames.SEC_USERS, tableNames.SEC_DOCTORS_DETAILS, tableNames.SEC_DEPARTMENTS, "suid","doctor_id","speciality_id","department_id", doc_id);
        return createSuccessResponse({ response: doctordetails }, 200);
    } catch (err) {
        console.log("Error in getDoctordetails handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};



export const getDashboardHcfdetails = async (event, context, callback) => {
    try {
        const hcfdetails = await dashboardhcfdetailsQuery(tableNames.SEC_USERS, tableNames.SEC_HCF_DETAILS, "suid","hcf_id");
        return createSuccessResponse({ response: hcfdetails }, 200);
    } catch (err) {
        console.log("Error in hcf details handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};


export const getDashboardHcfdetailsbyId = async (event, context, callback) => {
    try {
        const hcf_id = event.pathParameters.id;
        const hcfdetails = await dashboardhcfdetailsQueryId(tableNames.SEC_USERS, tableNames.SEC_HCF_DETAILS, "suid","hcf_id", hcf_id);
        return createSuccessResponse({ response: hcfdetails }, 200);
    } catch (err) {
        console.log("Error in  hcf details  handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};



export const getpatientActivity = async (event, context, callback) => {
    try {
        const app_id = event.pathParameters.id;
        const patientActivity = await patientActivityQuery(tableNames.SEC_APPOINTMENTS, app_id);
        return createSuccessResponse({ response: patientActivity }, 200);
    } catch (err) {
        console.log("Error in patient Activity handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};



export const getpatientNotification = async (event, context, callback) => {
    try {
        const app_id = event.pathParameters.id;
        const patientNotification = await patientNotificationQuery(tableNames.SEC_APPOINTMENTS, app_id);
        return createSuccessResponse({ response: patientNotification }, 200);
    } catch (err) {
        console.log("Error in patient Notification handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};



export const getpatientAppbystatusid = async (event, context, callback) => {
    try {
        const app_id = event.pathParameters.id;
        const app_status = event.pathParameters.status;
        const patientappointmentbystatus = await patientappQuerybystatusid(tableNames.SEC_APPOINTMENTS, app_status, app_id);
        console.log(patientappointmentbystatus);
        return createSuccessResponse({ response: patientappointmentbystatus }, 200);
    } catch (err) {
        console.log("Error in appointment status handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};


export const getappointmentHistory = async (event, context, callback) => {
    try {
        const app_id = event.pathParameters.id;
        const patientAppointmentHistory = await appointmentHistoryQuery(tableNames.SEC_APPOINTMENTS, app_id);
        return createSuccessResponse({ response: patientAppointmentHistory }, 200);
    } catch (err) {
        console.log("Error in appointment History handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getTransaction = async (event, context, callback) => {
    try {
        const user_id = event.pathParameters.id;
        const patientTransaction = await patienttransactionQuery(tableNames.SEC_TRANSACTIONS, user_id);
        return createSuccessResponse({ response: patientTransaction }, 200);
    } catch (err) {
        console.log("Error in Transaction Query   handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getPatientPlan = async (event, context, callback) => {
    try {
        const pat_id = event.pathParameters.id;
        const patientPlan = await patientPlanQuery(tableNames.SEC_PATIENT_PLANS, pat_id);
        return createSuccessResponse({ response: patientPlan }, 200);
    } catch (err) {
        console.log("Error in Transaction Query   handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};
