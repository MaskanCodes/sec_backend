import { createRecord, getRecordByParams, runRawQuery, updateRecord } from "../database/helper";
import { tableNames } from "../database/tables";
import {
    createSuccessResponse,
    createErrorResponse,
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

export const _updatePateintProfile = async (data) => {
    // console.log("ll=", data.length);
    const records = { ...data };
    delete records.email;
    const dbUser = await getRecordByParams(
        tableNames.SEC_USERS,
        { email: data.email },
        "",
        "suid, email, is_active, role_id, is_approved",
    );
    console.log("Khan=", dbUser.length);
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

            // await _insertAccessToken(dbUser[0], false);

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

 


export const _createAppointment = async (userData) => {

    // const records = { ...data };

    // const dbUser = await getRecordByParams(
    //     tableNames.SEC_USERS,
    //     { suid: data.suid },
    //     "",
    //     "suid, email, is_active, role_id, is_approved",
    // );

    // // const { email, mobile: contact_no_primary, role_id, password, added_by } = data;
    // // const params = {
    // //     email,
    // //     contact_no_primary,
    // // };
    // // const dbUser = await getRecordByParams(tableNames.SEC_USERS, params, "OR");

    // if (dbUser.length) {
    //     if (dbUser[0].suid !== records.patient_id) return generateError("USER DOES NOT EXIST", 403);

    //     // const whereClause = {
    //     //     email: dbUser[0].email,
    //     //     suid: dbUser[0].suid,
    //     // };
    // } else {
    //     const newAppointment = {
            
    //         appointment_date,
    //         patient_id,
    //         doctor_id,
    //         symptoms,
    //         attachments,
    //         status,
    //         reason,
    //         next_review_date, 
    //         action_done_by,
    //         minor_name,  
    //         minor_gender,
    //         minor_age, 
    //         minor_reports,  
    //         patient_report, 
    //         answer_1,  
    //         answer_2,  
    //         answer_3,  
    //         answer_4, 
    //         answer_5, 
    //         duration,
    //         subscription_id, 
    //         transaction_id, 
    //         problem,  
    //     };

    //     // newUser.profile_picture = await generateDummyProfileImg(email);

    //     const user = await createRecord(tableNames.SEC_APPOINTMENTS, [newAppointment], true, "appointment_id");
    //     return createSuccessResponse("Appointment Booked ", 200);
    // }
    //  return generateError("Error in booking Appointment ", 400);


 
    const {
        appointment_date,
        patient_id,
        doctor_id,
        symptoms,
        attachments,
        status,
        reason,
        next_review_date,
        action_done_by,
        minor_name,
        minor_gender,
        minor_age,
        minor_reports,
        patient_report,
        answer_1,
        answer_2,
        answer_3,
        answer_4,
        answer_5,
        duration,
        subscription_id,
        transaction_id,
        problem,
   } = userData;
   const newUser = {

        appointment_date,
        patient_id,
        doctor_id,
        symptoms,
        attachments,
        status,
        reason,
        next_review_date,
        action_done_by,
        minor_name,
        minor_gender,
        minor_age,
        minor_reports,
        patient_report,
        answer_1,
        answer_2,
        answer_3,
        answer_4,
        answer_5,
        duration,
        subscription_id,
        transaction_id,
        problem,
        };
        // const user = await updateRecord(tableNames.SEC_USERS, records, whereClause, "AND");
        const user = await createRecord(tableNames.SEC_APPOINTMENTS, [newUser], true, "appointment_id");

    return createSuccessResponse("Appointment Booked ", 202);

    // return generateError("sucess pass2", 202);
};