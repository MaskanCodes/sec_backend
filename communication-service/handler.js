import { createSuccessResponse, createErrorResponse } from "../configs/utility";

export const test = async (event, context, callback) => {
    try {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "Communication service function executed successfully!",
                input: event,
            }),
        };
        return createSuccessResponse({ response }, 200);
    } catch (err) {
        console.log("Error in handler", err, err.statusCode);
        return createErrorResponse({ error: err.message }, 500);
    }
};
