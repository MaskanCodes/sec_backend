import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const config = { region: process.env.REGION };

const sesClient = new SESClient(config);
const snsClient = new SNSClient(config);

export const sendEmailToUser = async (sendTo, subject, body) => {
    try {
        const input = {
            Source: process.env.FROM_EMAIL_ADDRESS, // required
            Destination: {
                ToAddresses: [sendTo],
            },
            Message: {
                // Message
                Subject: {
                    Charset: "UTF-8",
                    Data: subject,
                },
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: body,
                    },
                },
            },
            ReplyToAddresses: [process.env.FROM_EMAIL_ADDRESS],
        };
        const command = new SendEmailCommand(input);
        const response = await sesClient.send(command);
        console.log(`Email has been sent to ${sendTo}`);
        console.log(response);
        return response;
    } catch (err) {
        console.log("Error occured in sending email to user due to", err);
        throw err;
    }
};

export const sendOTPToUser = async (phoneNumber, message) => {
    const messageAttributes = {
        "SEC.SNS.SMS.SMSType": { DataType: "String", StringValue: "Transactional" },
        "SEC.SNS.SMS.SenderID": { DataType: "String", StringValue: "SenderID" },
        "SEC.SNS.SMS.MessageType": { DataType: "String", StringValue: "SMS" },
        "SEC.SNS.SMS.OriginationNumber": { DataType: "String", StringValue: "OriginationNumber" },
    };

    try {
        const publishParams = {
            Message: message,
            MessageAttributes: messageAttributes,
            PhoneNumber: phoneNumber,
        };
        const command = new PublishCommand(publishParams);
        const response = await snsClient.send(command);
        console.log("Message sent. Message ID:", response.MessageId);
        console.log(`OTP sent successfully to ${phoneNumber}`);
        console.log(response);
        return response;
    } catch (err) {
        console.log("Error occured in sending otp to user due to", err);
        console.error(`Failed to send OTP to ${phoneNumber}:`, err);
        throw err;
    }
};
