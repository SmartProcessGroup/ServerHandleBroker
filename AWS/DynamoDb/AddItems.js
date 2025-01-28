const { DynamoDBDocumentClient, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient  = require("./ClientDynamoDB.js");
const commands = require("../../Utils/Commands.js");


// async function addItem(NameTable, MAC, message) {
//     const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
//     data = splitData(message);

//     const command = new PutCommand({
//         TableName: NameTable,
//         Item: {
//             MAC: MAC,
//             ...data
//         },
//       });
//     //   console.log(command);
      
//       const response = await docClient.send(command);
//       console.log(response);
//       return response;
// }

async function addItem(NameTable, ID, message) {

    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const data = splitData(message);    //Data a Guardar
    const date = formatDate();
    const params = {
        TableName: NameTable,
        Key: { ID },
        UpdateExpression: "SET #values.#date = :data",
        ExpressionAttributeNames: { "#values": "values", "#date": date},
        ExpressionAttributeValues: { ":data": data }, 
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

function formatDate() {
    const date = new Date(); // Fecha y hora actual
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

function splitData(data) {
    const result = {};

    for (const key of Object.keys(data)) {
        if (!commands.hasOwnProperty(key)) {
            continue; // Ignorar llaves que no estén en `commands`
        }

        const values = data[key]
            .split(";") // Dividir los datos por ";"
            .filter(item => !(item.startsWith("[") || item.endsWith("]"))); // Eliminar las cabeceras

        // Mapear valores a las claves definidas en `commands[key]`
        result[key] = values.reduce((acc, value, index) => {
            const subkey = commands[key][index];
            if (subkey) {
                acc[subkey] = value;
            }
            return acc;
        }, {});
    }

    return result;
}


module.exports = { addItem };