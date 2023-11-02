import jwt from "jsonwebtoken";
import { getRecordByParams } from "../database/helper";
import { generateError } from "../configs/utility";
import { tableNames } from "../database/tables";
import { userStatus } from "../configs/sec-types";

export const handler = async (event) => {
    try {
        // Get Token from the Authorization header
        const authorizationHeader = event.headers.Authorization;
        if (!authorizationHeader) {
            throw new Error("UNAUTHORIZED: No authorization token provided", 401);
        }
        const [bearer, token] = authorizationHeader.split(" ");
        if (bearer !== "Bearer" || !token) {
            throw new Error("UNAUTHORIZED: Invalid authorization token", 401);
        }

        // const token = event.authorizationToken;
        const decodedToken = await decode(token);
        const user = await lookupUser(decodedToken);
        const principalId = user.suid.toString();
        return generateAllow(principalId, event.routeArn, user);
    } catch (ex) {
        console.log("Error in custom authorizer handler due to ", ex);
        if (ex.name === "TokenExpiredError") {
            return generateDeny("", event.routeArn, {
                body: JSON.stringify({
                    message: "Unauthenticated",
                }),
            });
        }
        throw ex;
    }
};

const decode = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        throw err;
    }
};

const lookupUser = async (decodedToken) => {
    const params = {
        suid: decodedToken.user_id,
    };

    const selectParams = "suid, email, is_active, can_login";

    const dbUser = await getRecordByParams(tableNames.SEC_USERS, params, "OR", selectParams);

    if (dbUser.length) {
        if (dbUser[0].is_active === userStatus.ACTIVE) {
            if (dbUser[0].can_login === userStatus.ACTIVE) {
                return dbUser[0];
            }
            throw generateError("INCOMPLETE_PROFILE", 202); // Throw an error instead of returning an error response
        }
        throw generateError("EMAIL_NOT_VERIFIED", 202); // Throw an error instead of returning an error response
    }
    throw generateError("USER_NOT_EXISTS", 404); // Throw an error instead of returning an error response
};

const generatePolicy = (principalId, effect, resource, context) => {
    const authResponse = {
        principalId, // Set the principalId to context.suid
    };

    if (effect && resource) {
        const policyDocument = {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: resource,
                },
            ],
        };
        authResponse.policyDocument = policyDocument;
    }

    // include user details in the context
    authResponse.context = {
        user: JSON.stringify(context),
    };

    return authResponse;
};

const generateAllow = (principalId, resource, context) => {
    return generatePolicy(principalId, "Allow", resource, context);
};

const generateDeny = (principalId, resource, context) => {
    return generatePolicy(principalId, "Deny", resource, context);
};
