/* eslint-disable prettier/prettier */
import { tableNames } from "../database/tables";
import { getAllRecords, doctordetailscompleteQuery,doctordetailscompleteQueryId, patientappointmentQuerybystatusid, doctordetailsQueryId, docAppointmentdetailsQuerybyId, docAppointmentQuerybystatusId, createRecord, getRecordByParams, runRawQuery, runRawQueryid, updateRecord, completeDoctorsDetails, completeDoctorsDetailsId, appointmentQuery
    , DocDashboardAppQuery, DocDashoardAppstatusQuery, DocNotificationQuery, DocAppointmentHistory, DoctransactionQuery
    } from "../database/helper";
// import { getAllRecords, getRecordByParams } from "../database/helper";
// import { getCountryCodesList } from "./helpers";
import {
    createSuccessResponse,
    createErrorResponse,
    parseEventBody,
    parseError,
} from "../configs/utility";
import {
    _createdoclisting,
    _updateDoctorDetails,
    _UpdatedocAppQuerybystatusId
} from "./user-adapter";
import { getUserModel } from "../helpers/models/user-model";

export const getDoctorprofile = async (event, context, callback) => {
    try {
        const doctorprofile = await getAllRecords(tableNames.SEC_USERS);
        return createSuccessResponse({ response: doctorprofile }, 200);
    } catch (err) {
        console.log("Error in getDoctorprofile handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getDoctordetails = async (event, context, callback) => {
    try {
        const doctordetails = await getAllRecords(tableNames.SEC_DOCTORS_DETAILS);
        return createSuccessResponse({ response: doctordetails }, 200);
    } catch (err) {
        console.log("Error in getDoctordetails handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};



export const getDoctordetailscompleteall = async (event, context, callback) => {
    try {
     const doctordetails = await completeDoctorsDetails(tableNames.VW_SEC_COMPLETE_DOCTOR_DETAILS);
        return createSuccessResponse({ response: doctordetails }, 200);
    } catch (err) {
        console.log("Error in getDoctordetails handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

// export const getcompleteDoctorsDetailsId = async (event, context, callback) => {
//     try {
//         // eslint-disable-next-line prefer-destructuring
//         const id = event.pathParameters.id;
//         const doctordetails = await completeDoctorsDetailsId(tableNames.VW_SEC_COMPLETE_DOCTOR_DETAILS,"doctor_details_id", id);
//         return createSuccessResponse({ response: doctordetails }, 200);
//     } catch (err) {
//         console.log("Error in getDoctordetails handler", err, err.statusCode);
//         return createErrorResponse({ error: err.message }, 500);
//     }
// };

// export const getcompleteDoctorsDetailsId = async (event, context, callback) => {
//     try {
//         // eslint-disable-next-line prefer-destructuring
//         const id = event.pathParameters.id;
//         const doctordetails = await completeDoctorsDetailsId(tableNames.VW_SEC_COMPLETE_DOCTOR_DETAILS,"doctor_details_id", id);
//         return createSuccessResponse({ response: doctordetails }, 200);
//     } catch (err) {
//         console.log("Error in getDoctordetails handler", err, err.statusCode);
//         return createErrorResponse({ error: err.message }, 500);
//     }
// };


// export const getCompleteAppointmentdetails = async (event, context, callback) => {
//     try {
//         const completeappointment = await completeappointmentQuery(tableNames.SEC_APPOINTMENTS);
//         return createSuccessResponse({ response: completeappointment }, 200);
//     } catch (err) {
//         console.log("Error in complete appointment details handler", err, err.statusCode);
//         return createErrorResponse({ error: err.message }, 500);
//     }
// };


// export const getAppointmentbystatusid = async (event, context, callback) => {
//     try {
//         const app_status = event.pathParameters.status;
//         const app_id = event.pathParameters.id;
//         const appointmentbystatusid = await appointmentbystatusQueryid(tableNames.SEC_APPOINTMENTS, app_status, app_id);
//         return createSuccessResponse({ response: appointmentbystatusid }, 200);
//     } catch (err) {
//         console.log("Error in appointment status handler", err, err.statusCode);
//         return createErrorResponse({ error: err.message }, 500);
//     }
// };

// export const getDocDetailscomplete = async (event, context, callback) => {
//     try {
//         const doctordetailscomplete = await doctordetailscompleteQuery(tableNames.SEC_USERS, tableNames.SEC_DOCTORS_DETAILS, tableNames.SEC_DEPARTMENTS, "suid","doctor_id","speciality_id","department_id");
//         console.log(doctordetailscomplete);
//         return createSuccessResponse({ response: doctordetailscomplete }, 200);
//     } catch (err) {
//         console.log("Error in getDoctordetailscomplete handler", err, err.statusCode);
//         return createErrorResponse({ error: err.message }, 500);
//     }
// };
// --------------------------------------

export const getDocDashoardApp = async (event, context, callback) => {
    try {
        const doc_id = event.pathParameters.id;
        const DocDashoardApp = await DocDashboardAppQuery(tableNames.SEC_APPOINTMENTS, doc_id);
        return createSuccessResponse({ response: DocDashoardApp }, 200);
    } catch (err) {
        console.log("Error in Dashboard appointments handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};


export const getDocDashoardAppstatus = async (event, context, callback) => {
    try {
        const doc_id = event.pathParameters.id;
        const app_status = event.pathParameters.status;
        const DocDashoardAppstatus = await DocDashoardAppstatusQuery(tableNames.SEC_APPOINTMENTS, app_status, doc_id);
        return createSuccessResponse({ response: DocDashoardAppstatus }, 200);
    } catch (err) {
        console.log("Error in Dashboard appointments handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};



export const getDocNotification = async (event, context, callback) => {
    try {
        const doc_id = event.pathParameters.id; 
        const DocNotification = await DocNotificationQuery(tableNames.SEC_APPOINTMENTS, doc_id);
        return createSuccessResponse({ response: DocNotification }, 200);
    } catch (err) {
        console.log("Error in Dashboard appointments handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};



export const getDoctorsDetailsbyId = async (event, context, callback) => {
    try {
        // eslint-disable-next-line prefer-destructuring
        const doc_id = event.pathParameters.id;
        const doctordetailsId = await doctordetailsQueryId(tableNames.SEC_USERS, tableNames.SEC_DOCTORS_DETAILS, tableNames.SEC_DEPARTMENTS, "suid","doctor_id","speciality_id","department_id","doctor_details_id", doc_id);
        console.log('doctordetailsId', doctordetailsId);
        // console.log('docid',id);
        return createSuccessResponse({ response: doctordetailsId }, 200);
    } catch (err) {
        console.log("Error in getDoctordetails handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};


export const updateDoctorDetails = async (event) => {
    try {
        const data = parseEventBody(event.body);
        console.log(data);
        const user = await _updateDoctorDetails(data);
        console.log(user);
        if (user) {
            return createSuccessResponse({ response: user }, 200);
        }
        return createSuccessResponse({ response: " register number exists" }, 200);
    } catch (err) {
        console.log("Error missing ", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }

};



// Doctor Listing API




export const getdocAppointmentdetailsId = async (event, context, callback) => {
    try {
        const app_id = event.pathParameters.id;
        const completeappointmentbyId = await docAppointmentdetailsQuerybyId(tableNames.SEC_APPOINTMENTS, app_id);
        return createSuccessResponse({ response: completeappointmentbyId }, 200);
    } catch (err) {
        console.log("Error in complete appointment details handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getdocAppointmentbystatusId = async (event, context, callback) => {
    try {
        const app_id = event.pathParameters.id;
        const app_status = event.pathParameters.status;
        const appointmentbystatus = await docAppointmentQuerybystatusId(tableNames.SEC_APPOINTMENTS, app_status, app_id);
        console.log(appointmentbystatus);
        return createSuccessResponse({ response: appointmentbystatus }, 200);
    } catch (err) {
        console.log("Error in appointment status handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};





export const UpdatedocAppbystatusId = async (event) => {
    try {
        const data = parseEventBody(event.body);
        console.log('data',data);
        const user = await _UpdatedocAppQuerybystatusId(data);
        console.log('user' , user);
        if (user) {
            return createSuccessResponse({ response: user }, 200);
        }
        return createSuccessResponse({ response: "Appointment Confirmed" }, 200);
    } catch (err) {
        console.log("Error missing ", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }

};

 
// Doctor Listing API
export const create_doc_listing = async (event) => {
    try {
        const data = parseEventBody(event.body);
        console.log(data);
        const user = await _createdoclisting(data);
        console.log(user);
        if (user) {
            return createSuccessResponse({ response: user }, 200);
        }
        return createSuccessResponse({ response: "Listing Already Exists" }, 200);
    } catch (err) {
        console.log("Error missing ", err, err.message);
        const { message, code } = parseError(err.message);
        return createErrorResponse({ error: message }, code || 500);
    }

};

export const getDocAppointmentHistoryId = async (event, context, callback) => {
    try {
        const app_id = event.pathParameters.id;
        const DoctortAppointmentHistory = await DocAppointmentHistory(tableNames.SEC_APPOINTMENTS, app_id);
        return createSuccessResponse({ response: DoctortAppointmentHistory }, 200);
    } catch (err) {
        console.log("Error in Doctor appointment History handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};

export const getDocTransaction = async (event, context, callback) => {
    try {
        const doc_id = event.pathParameters.id;
        const DocTransaction = await DoctransactionQuery(tableNames.SEC_TRANSACTIONS, doc_id);
        return createSuccessResponse({ response: DocTransaction }, 200);
    } catch (err) {
        console.log("Error in Transaction Query   handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};


