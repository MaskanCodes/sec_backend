import { registration_type } from "../../configs/sec-types";

export const getUserModel = (data) => {
    const newData = { ...data };
    if (newData.token_id === undefined) {
        newData.registration_type = registration_type.EMAIL;
        newData.tokens = [];
    } else {
        newData.registration_type = registration_type.SSO;
        newData.tokens = [
            { token_id: newData.token_id, SSO_type: newData.registered_via, is_login: true },
        ];
    }

    const userData = {
        email: newData.email ? newData.email.trim() : newData.email,
        first_name: newData.first_name ? newData.first_name.trim() : newData.first_name,
        last_name: newData.last_name ? newData.last_name.trim() : newData.last_name,
        middle_name: newData.middle_name ? newData.middle_name.trim() : newData.middle_name,
        added_by: newData.added_by || "",
        gender: newData.gender || "",
        DOB: newData.DOB ? newData.DOB.trim() : newData.DOB,
        country_id: newData.country_id,
        state_id: newData.state_id,
        city_id: newData.city_id,
        street_address1: newData.street_address1,
        street_address2: newData.street_address2,
        zip_code: newData.zip_code,
    };

    return userData;
};
