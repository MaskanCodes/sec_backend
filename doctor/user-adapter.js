/* eslint-disable prettier/prettier */
import { createRecord, getRecordByParams, runRawQuery, updateRecord, getDocDetailRecord, getDocListingRecord,
    getDocAppRecord, getDocAppStatusRecord} from "../database/helper";
import { tableNames } from "../database/tables";
import {
    hashString,
    generateJWT,
    addHoursToDate,
    descryptHashString,
    generateError,
    getOTP,
    getRandomNumber,
    createSuccessResponse,
} from "../configs/utility";
import { expirationTime, userStatus, userRole } from "../configs/sec-types";
import { sendActivationCode } from "../helpers/mail-helper";
import { generateDummyProfileImg } from "../helpers/image-helper";
import { sendOTPToUser } from "../helpers/aws-helper";
import { randomNumber } from "../configs/common";


export const _updateDoctorDetails = async (data) => {
    const records = { ...data };
    // delete records.email;

    const dbUser = await getDocDetailRecord(
        tableNames.SEC_DOCTORS_DETAILS,
        { doctor_id: data.doctor_id },
        "",
        "doctor_id",
    );

    if (dbUser.length) {
        // if (dbUser[0].is_active === userStatus.ACTIVE) {
            if (
                dbUser[0].role_id === userRole.DOCTOR &&
                dbUser[0].is_approved === userStatus.IN_ACTIVE
            )
                return generateError("ADMIN_APPROVAL_REQUIRED", 202);

            const selectParams =
                "doctor_id, qualification , degree , state_reg_date ,  country_reg_date, job, hospital_org , start_date, lic_title, lic_certificate_no, lic_issuedby, lic_date, lic_description, award_title, award_issuedby, award_date, award_description, qualified_year, reg_date, speciality_id, state_med_council_id, state_reg_number, country_reg_number, university_name";

            const whereClause = {
                // email: dbUser[0].email,
                doctor_id: dbUser[0].doctor_id,
            };

            // records.can_login = 0;

            await updateRecord(tableNames.SEC_DOCTORS_DETAILS, records, whereClause, "AND");

            // await _insertAccessToken(dbUser[0], false);

            const user = await getDocDetailRecord(
                tableNames.SEC_DOCTORS_DETAILS,
                whereClause,
                "OR",
                selectParams,
            );
            return user[0];
        // }
        return generateError("Invalid Details", 202);
    }
    return generateError("USER_NOT_EXISTS", 404);
};

  
 

export const _UpdatedocAppQuerybystatusId = async (data) => {
    const records = { ...data };
    
    const dbUser = await getDocAppStatusRecord(
        tableNames.SEC_APPOINTMENTS,
        { appointment_id: data.appointment_id, patient_id: data.patient_id },
        "AND",
        "appointment_id, status"
    );

    console.log('dbuser', dbUser);

    if (dbUser.length) {
        console.log('dbUser ====  ', dbUser[0].status);

        if (dbUser[0].status === "booked") {
          
                records.status = "in_progress"; // Update the status to "in_progress"

                const whereClause = {
                    appointment_id: data.appointment_id, // Use the appointment_id as the condition
                };
                await updateRecord(tableNames.SEC_APPOINTMENTS, records, whereClause, "AND");
                const user = await getDocAppStatusRecord(
                    tableNames.SEC_APPOINTMENTS,
                    whereClause,
                    "OR",
                    "appointment_id, status" // Select the updated status
                );
                return user[0];
             
            // Check if the current status is "booked"
           
        } else if (dbUser[0].status === "in_progress") {
            // Check if the current status is "in_progress"
            // Write code for video or chat consultation
            // If successfully done, then the status is completed
            records.status = "completed"; // Update the status to "completed"

            const whereClause = {
                appointment_id: data.appointment_id, // Use the appointment_id as the condition
            };

            await updateRecord(tableNames.SEC_APPOINTMENTS, records, whereClause, "AND");

            const user = await getDocAppStatusRecord(
                tableNames.SEC_APPOINTMENTS,
                whereClause,
                "OR",
                "appointment_id, status" // Select the updated status
            );
            return user[0];
        } else if (dbUser[0].status === "completed") {
            records.status = "completed"; // The status remains "completed"

            const whereClause = {
                appointment_id: data.appointment_id, // Use the appointment_id as the condition
            };

            const user = await getDocAppStatusRecord(
                tableNames.SEC_APPOINTMENTS,
                whereClause,
                "OR",
                "appointment_id, status" // Select the current status
            );
            return user[0];
        // } else if (records.status === "cancelled") {
        //     records.status = "cancelled"; // Update the status to "cancelled"

        //     const whereClause = {
        //         appointment_id: data.appointment_id, // Use the appointment_id as the condition
        //     };

        //     await updateRecord(tableNames.SEC_APPOINTMENTS, records, whereClause, "AND");

        //     const user = await getDocAppStatusRecord(
        //         tableNames.SEC_APPOINTMENTS,
        //         whereClause,
        //         "OR",
        //         "appointment_id, status" // Select the updated status
        //     );
        //     return user[0];
        } else {
            return generateError("INVALID_STATUS_REQUEST", 404);
        }
    }
    return generateError("APPOINTMENT_NOT_FOUND", 404); // Appointment not found
};

 
 
export const _createdoclisting = async (data) => {
    // const records = { ...data };
    // delete records.email;
    const { doctor_id, listing_name , working_days , working_time ,  about} = data;
    const params = {
        doctor_id,
    };
    const dbUser = await getDocListingRecord(tableNames.SEC_DOCTOR_LISTING, params, "OR");
    if (dbUser.length) {
        if (dbUser[0].doctor_id === doctor_id) return generateError("Plan already exists", 403);
          
    } else {
        const newPlan = {
            doctor_id, 
            listing_name, 
            working_days, 
            working_time,  
            about,
        };
        await createRecord(tableNames.SEC_DOCTOR_LISTING, [newPlan], true, "doctor_listing_id");
        return createSuccessResponse("LISTING ADDED", 200);
    }
    return generateError("ERROR ADDING LISTING ", 404);
  
};


export const _updatedoclisting = async (data) => {
    const records = { ...data };
    delete records.doctor_id;

    const dbUser = await getDocListingRecord(
        tableNames.SEC_DOCTORS_DETAILS,
        { doctor_id: data.doctor_id },
        "",
        "doctor_id",
    );

    if (dbUser.length) {
        // if (dbUser[0].is_active === userStatus.ACTIVE) {
            if (
                dbUser[0].role_id === userRole.DOCTOR &&
                dbUser[0].is_approved === userStatus.IN_ACTIVE
            )
                return generateError("ADMIN_APPROVAL_REQUIRED", 202);

            const selectParams =
                "listing_name , working_days , working_time ,  about";

            const whereClause = {
                // email: dbUser[0].email,
                doctor_id: dbUser[0].doctor_id,
            };

            // records.can_login = 0;

            await updateRecord(tableNames.SEC_DOCTOR_LISTING, records, whereClause, "AND");

            // await _insertAccessToken(dbUser[0], false);

            const user = await getDocListingRecord(
                tableNames.SEC_DOCTOR_LISTING,
                whereClause,
                "OR",
                selectParams,
            );
            return user[0];
        // }
        return generateError("Invalid Details", 400);
    }
    return generateError("USER_NOT_EXISTS", 404);
};