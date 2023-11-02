import mysql from "serverless-mysql";

let pool;

export const initConnection = async () => {
    try {
        if (!pool) {
            console.log("connecting to database............");
            pool = mysql({
                config: {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                    waitForConnections: true,
                    connectionLimit: process.env.CONNECTION_LIMIT, // maximum number of connections in the pool
                    queueLimit: process.env.QUEUE_LIMIT, // maximum number of requests in the queue
                },
            });
            console.log("connected to database");
            return pool;
        }

        console.log("using cached connection............");
        return pool;
    } catch (err) {
        console.log("Error occurred in database connection", err);
        throw err;
    }
};
