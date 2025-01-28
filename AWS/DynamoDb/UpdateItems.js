const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient  = require("./ClientDynamoDB.js");


async function updateItem(NameTable, ID, message) {
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    
    const command = new UpdateCommand({
        ExpressionAttributeNames: {
            "#RQ": "req",
            "#AC": "active"
        },
        ExpressionAttributeValues: {
            ":req": message.req,
            ":active": message.active
            },
        TableName: NameTable,
        Key: {
            ID: ID,
        },
        UpdateExpression: `set #RQ = :req, #AC = :active`,
        ReturnValues: "ALL_NEW",
    });
    
    const response = await docClient.send(command);
    return response;
}

module.exports = { updateItem };