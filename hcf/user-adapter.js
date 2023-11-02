/* eslint-disable prettier/prettier */
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
    createSuccessResponse,
} from "../configs/utility";
import { expirationTime, userStatus, userRole } from "../configs/sec-types";
import { sendActivationCode } from "../helpers/mail-helper";
import { generateDummyProfileImg } from "../helpers/image-helper";
import { sendOTPToUser } from "../helpers/aws-helper";
import { randomNumber } from "../configs/common";

export const _updateDoctorDetails = async (userData) => {

    const {   qualification,
        description,
        qualified_year,
        reg_date,
        speciality_id,
        state_med_council_id,
        state_reg_number,
        country_reg_number,
        university_name,
        doctor_id,
        approved } = userData;
    // const params = {
    //     qualification,
    //     description,
    //     qualified_year,
    //     reg_date,
    //     speciality_id,
    //     state_med_council_id,
    //     state_reg_number,
    //     country_reg_number,
    //     university_name,
    //     doctor_id,
    //     approved
    // };
    // const dbUser = await getRecordByParams(tableNames.SEC_DOCTORS_DETAILS, params, "OR");

    // if (dbUser.length) {
    //   console.log("nothing is present here");
    // } else {
        const newUser = {
            qualification,
            description,
            qualified_year,
            reg_date,
            speciality_id,
            state_med_council_id,
            state_reg_number,
            country_reg_number,
            university_name,
            doctor_id,
            approved
        };
        // const user = await updateRecord(tableNames.SEC_USERS, records, whereClause, "AND");
        const user = await createRecord(tableNames.SEC_DOCTORS_DETAILS, [newUser], true, "doctor_details_id");

    return createSuccessResponse("success pass1", 202);
    // }
    // return generateError("sucess pass2", 202);

};
