const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");


async function getTopicsAWS(client) {
    console.log("Obteniendo los Topics de DynamoDB...");
    
    const docClient = DynamoDBDocumentClient.from(client);
    const TABLE_NAME = 'Devices';
    const params = {
        TableName: TABLE_NAME,
    };

    try {
        const data = await docClient.send(new ScanCommand(params));
        const ids = data.Items.map(item => item.ID);

        return ids;
    } catch (error) {
        console.error("Error al obtener los datos de DynamoDB:", error.message);
        return [];
    }
}

module.exports = { getTopicsAWS };  