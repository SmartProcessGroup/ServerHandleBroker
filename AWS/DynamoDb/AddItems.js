const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient  = require("./ClientDynamoDB.js");
const commands = require("../../Utils/Commands.js");

function setParams(NameTable,ID,Fecha,Type,Data){
	return {
		TableName: NameTable,
		Item:{
			ID: ID,
			Fecha: Fecha,
			type: Type,
			Data: Data
		}
	}

}

async function addItem(NameTable, ID, message) {
    const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    const data = splitData(message);    //Data a Guardar
    const date = Math.floor(Date.now() / 1000)//.toString(); //Fecha de la data

		try {
			await docClient.send(new PutCommand(setParams(NameTable,ID,date,"data",data)))
			// await docClient.send(new PutCommand(setParams(NameTable,ID,date,"location",message.pos)))
			console.log("Valores Actualizados");
			
			
		} catch (error) {
			console.error("Error al añadir el elemento:", error.message);
        throw error;
		}
		
    // try {
		// 		//Send Data
    //     var response = await docClient.send(new UpdateCommand(params));
		// 		//Send Location
		// 		type = "location"
		// 		data = message.pos
		// 		params.UpdateExpression = "SET #date = :date, #type = :type, #values = :data";
    //     response = await docClient.send(new UpdateCommand(params));
    //     console.log("Elemento actualizado");
    //     return response.Attributes;
        
    // } catch (error) {
    //     console.error("Error al añadir el elemento:", error.message);
    //     throw error;
    // }
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