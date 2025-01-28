const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
    throw new Error("Las variables de entorno de AWS no están configuradas correctamente.");
}

const dynamoDBClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

module.exports = dynamoDBClient;
