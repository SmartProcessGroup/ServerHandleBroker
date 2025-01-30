const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient  = require("./ClientDynamoDB.js");
const commands = require("../../Utils/Commands.js");

async function addItem(NameTable, ID, message) {

    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const data = splitData(message);    //Data a Guardar
    const date = Math.floor(Date.now() / 1000).toString(); //Fecha de la data
    const params = {
        TableName: NameTable,
        Key: { ID },
        UpdateExpression: "SET #values.#date = :data, pos = :location",
        ExpressionAttributeNames: { "#values": "values", "#date": date},
        ExpressionAttributeValues: { ":data": data, ":location": message.pos}, 
        ReturnValues: "ALL_NEW", 
    };
    
    try {
        const response = await docClient.send(new UpdateCommand(params));
        console.log("Elemento actualizado");
        return response.Attributes;
        
    } catch (error) {
        console.error("Error al añadir el elemento:", error.message);
        throw error;
    }
}

function splitData(data) {
    var result = {};
    
    for (const key of Object.keys(data)) {
        if (!commands.hasOwnProperty(key)) {
            continue; // Ignorar comandos que no estén en `commands`
        }

        result[key] = data[key].reduce((acc, element, index) => {   
            const subkey = commands[key][index];
            if (subkey) {
                acc[subkey] = element;
            }
            return acc;
        },{});
    }
    return result;
}


module.exports = { addItem };