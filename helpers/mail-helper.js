"strict mode";

import { randomNumber } from "../configs/common";
import { sendEmailToUser } from "./aws-helper";

export const sendActivationCode = async (email, code, sub, action) => {
    console.log(email, code, sub, action);
    try {
        const subject = `Share-e-care ${sub} code`;
        const body = `<html> \
                        <head> \
                            <title>Welcome to Share-e-care</title> \
                        </head> \
                        <body> \
                            <div>Please use this code to ${action}. Your code is ${code} and will expire in ${randomNumber.minutes} minutes</div> \
                        </body> \
                        </html>`;

        // await sendEmailToUser(email, subject, body);
        console.log("Code has been sent to ", email);
    } catch (err) {
        console.log("Error occured in sending activation code due to", err);
        throw err;
    }
};
