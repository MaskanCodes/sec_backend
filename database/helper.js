/* eslint-disable prettier/prettier */
import { initConnection } from ".";

async function queryDatabase(query, params) {
    const conn = await initConnection();
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

export async function createRecord(table, records, getResults, column) {
    const columns = Object.keys(records[0]).toString();
    const values = records.map((record) => Object.values(record));
    const query = `INSERT INTO ${table} (${columns}) VALUES ?`;
    const insertResult = await queryDatabase(query, [values]);
    const { insertId } = insertResult;

    if (getResults) {
        const selectQuery = `SELECT * FROM ${table} WHERE ${column} = ?`;
        const selectResult = await queryDatabase(selectQuery, [insertId]);
        return selectResult[0];
    }
    return insertId;
}

export async function updateRecord(table, record, whereColumns, joinParams) {
    const columns = Object.keys(record)
        .map((ele) => `${ele} = ?`)
        .toString();
    const whereClause = Object.keys(whereColumns)
        .map((key) => `${key} = ?`)
        .join(` ${joinParams} `);
    const params = [...Object.values(record), ...Object.values(whereColumns)];
    const query = `UPDATE ${table} SET ${columns} WHERE ${whereClause}`;
    return await queryDatabase(query, params);
}

export async function getAllRecords(table) {
    const query = `SELECT * FROM ${table}`;
    return await queryDatabase(query);
}

export async function getRecordByParams(
    table,
    whereColumns,
    joinParams,
    selectParams = "*",
    order = "desc",
    orderBy = "suid",
) {
    const whereClause = Object.keys(whereColumns)
        .map((key) => `${key} = ?`)
        .join(` ${joinParams} `);
    const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
    return await queryDatabase(query, [...Object.values(whereColumns)]);
}

export async function deleteRecord(table, whereColumns) {
    const whereClause = Object.keys(whereColumns)
        .map((key) => `${key} = ?`)
        .join(" AND ");
    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    return await queryDatabase(query, [...Object.values(whereColumns)]);
}

// export async function runRawQuery(table, alias1, alias2) {
//     const joinCondition = `${alias1.column1} = ${alias2.column2}`;
//    const query = `SELECT * FROM ${table}${alias1} JOIN ${table}${alias2} ON ${joinCondition} `;
export async function runRawQuery(table1, table2, table3, column1, column2, column3, column4) {
    const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2} JOIN ${table3} ON  ${table2}.${column3} =  ${table3}.${column4} `;
    return await queryDatabase(query);
}

export async function completeDoctorsDetails(table) {
    const query = `SELECT * FROM ${table}`;
    return await queryDatabase(query);
}

export async function completeDoctorsDetailsId(table, column, id) {
    // const query = `SELECT * FROM ${table} WHERE  ${table}.doctor_details_id = ?;`;
    const query = ` SELECT *
    FROM sec_users
    JOIN sec_doctors_details ON sec_users.suid = sec_doctors_details.doctor_id
    JOIN sec_departments ON sec_doctors_details.speciality_id = sec_departments.department_id
    WHERE sec_users.role_id = '3' AND sec_doctors_details.doctor_details_id = ?; `;
    return await queryDatabase(query, [id]);
}

export async function appointmentQuery(table) {
    const query = `SELECT * FROM ${table}`;
    return await queryDatabase(query);
}



export async function completeappointmentQuery(table) {
    const query = `SELECT * FROM ${table}`;
    return await queryDatabase(query);
}





// -----------------------------------------  Doctor API -------------------------------------------------------

export async function DocDashboardAppQuery(table, doc_id) {
    const query = `SELECT * FROM ${table} WHERE ${table}.doctor_id = ${doc_id}`;
    return await queryDatabase(query);
}


export async function DocDashoardAppstatusQuery(table, app_status, app_id) { 
    const query = `SELECT * FROM ${table} WHERE ${table}.status = '${app_status}' AND ${table}.doctor_id = ${app_id}`;
    return await queryDatabase(query);
}

export async function DocNotificationQuery(table, app_id) { 
    const query = `SELECT * FROM ${table} WHERE ${table}.doctor_id = ${app_id}`;
    return await queryDatabase(query);
}


export async function docAppointmentdetailsQuerybyId(table, app_id) {
    const query = `SELECT * FROM ${table} WHERE ${table}.doctor_id = ${app_id}`;
    return await queryDatabase(query);
}

export async function docAppointmentQuerybystatusId(table, app_status, app_id) { 
    const query = `SELECT * FROM ${table} WHERE ${table}.status = '${app_status}' AND ${table}.doctor_id = ${app_id}`;
    return await queryDatabase(query);
}


export async function getDocAppStatusRecord(
    table,
    whereColumns,
    joinParams,
    selectParams = "*",
    order = "desc",
    orderBy = "appointment_id",
) {
    const whereClause = Object.keys(whereColumns)
        .map((key) => `${key} = ?`)
        .join(` ${joinParams} `);
    const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
    return await queryDatabase(query, [...Object.values(whereColumns)]);
}

export async function getDocListingRecord(
    table,
    whereColumns,
    joinParams,
    selectParams = "*",
    order = "desc",
    orderBy = "doctor_id",
) {
    const whereClause = Object.keys(whereColumns)
        .map((key) => `${key} = ?`)
        .join(` ${joinParams} `);
    const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
    return await queryDatabase(query, [...Object.values(whereColumns)]);
}



export async function getDocAppRecord(
    table,
    whereColumns,
    joinParams,
    selectParams = "*",
    order = "desc",
    orderBy = "doctor_id",
) {
    const whereClause = Object.keys(whereColumns)
        .map((key) => `${key} = ?`)
        .join(` ${joinParams} `);
    const query = `SELECT ${selectParams} FROM ${table} WHERE ${whereClause} order by ${orderBy} ${order}`;
    return await queryDatabase(query, [...Object.values(whereColumns)]);
}

export async function doctordetailsQueryId(table1, table2, table3, column1, column2, column3, column4, column5, id) {
    // const query = `SELECT * FROM  ${table2} WHERE   ${table2}.doctor_id =  ${id} ;`;
    const query = ` SELECT *  FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2} JOIN ${table3} ON  ${table2}.${column3} =  ${table3}.${column4}
    WHERE ${table1}.role_id = '3' AND ${table2}.doctor_id = ${id} `;
  
    return await queryDatabase(query, [id]);
}


export async function getDocDetailRecord(
    table,
    whereColumns,
    joinParams,
    selectParams = "*",
    order = "desc",
    orderBy = "doctor_id",
) {
    const whereClause = Object.keys(whereColumns)
        .map((key) => `${key} = ?`)
        .join(` ${joinParams} `);
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


export async function DocAppointmentHistory(table, app_id) {
    // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
    const query = `SELECT * FROM ${table} WHERE ${table}.doctor_id = ${app_id}`;
    return await queryDatabase(query);
}


export async function DoctransactionQuery(table, doc_id) {
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
export async function dashboarddocdetailsQuery(table1, table2, table3, column1, column2, column3, column4) {
    const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2} JOIN ${table3} ON  ${table2}.${column3} =  ${table3}.${column4} 
    WHERE ${table1}.role_id = '3'`;
    return await queryDatabase(query);
}

// Patient Dashboard Single Doctors details 
export async function dashboarddocdetailsQueryId(table1, table2, table3, column1, column2, column3, column4, doc_id) {
    const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2} JOIN ${table3} ON  ${table2}.${column3} =  ${table3}.${column4} 
    WHERE ${table1}.role_id = '3' AND ${table2}.doctor_id = ${doc_id} `;
    return await queryDatabase(query);
}

// Patient Dashboard All HCF details
export async function dashboardhcfdetailsQuery(table1, table2, column1, column2) {
    const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2}  
    WHERE ${table1}.role_id = '4'`;
    return await queryDatabase(query);
}

// Patient Dashboard Single HCF details 
export async function dashboardhcfdetailsQueryId(table1, table2, column1, column2, hcf_id) {
    const query = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${column1} = ${table2}.${column2}  
    WHERE ${table1}.role_id = '4' AND ${table2}.hcf_id = ${hcf_id} `;
    return await queryDatabase(query);
}


export async function patientActivityQuery(table, app_id) {
    // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
    const query = `SELECT * FROM ${table} WHERE ${table}.patient_id = ${app_id}`;
    return await queryDatabase(query);
}



export async function patientNotificationQuery(table, app_id) {
    // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
    const query = `SELECT * FROM ${table} WHERE ${table}.patient_id = ${app_id}`;
    return await queryDatabase(query);
}

export async function patientappQuerybystatusid(table, app_status, app_id) {
    // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
    const query = `SELECT * FROM ${table} WHERE ${table}.status = '${app_status}' AND ${table}.patient_id = ${app_id}`;
    return await queryDatabase(query);
}

export async function appointmentHistoryQuery(table, app_id) {
    // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
    const query = `SELECT * FROM ${table} WHERE ${table}.patient_id = ${app_id}`;
    return await queryDatabase(query);
}

export async function patienttransactionQuery(table, user_id) {
    // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
    const query = `SELECT * FROM ${table} WHERE ${table}.user_id = ${user_id}`;
    return await queryDatabase(query);
}
export async function patientPlanQuery(table, pat_id) {
    // const query = `SELECT * FROM ${table} WHERE ${table}.status = ${app_status}`;
    const query = `SELECT * FROM ${table} WHERE ${table}.patient_id = ${pat_id}`;
    return await queryDatabase(query);
}
