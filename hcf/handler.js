/* eslint-disable prettier/prettier */
import { tableNames } from "../database/tables";
import { getAllRecords, createRecord, getRecordByParams, runRawQuery, updateRecord, appointmentQuery} from "../database/helper";
// import { getAllRecords, getRecordByParams } from "../database/helper";
// import { getCountryCodesList } from "./helpers";
import {
    createSuccessResponse,
    createErrorResponse,
    parseEventBody,
    parseError,
} from "../configs/utility";
import {
    _updateDoctorDetails,
} from "./user-adapter";
import { getUserModel } from "../helpers/models/user-model";
 


