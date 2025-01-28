const iotsdk = require('aws-iot-device-sdk-v2');
const mqtt = iotsdk.mqtt;
const TextDecoder = require('util').TextDecoder;
const common_args = require('./utilsAWS.js');
const dynamoDBClient  = require('./DynamoDb/ClientDynamoDB.js');
const { exit } = require('process');
const { getTopicsAWS } = require('./DynamoDb/GetTopicsAWS.js');
const { updateItem } = require('./DynamoDb/UpdateItems.js');
const { addItem } = require('./DynamoDb/AddItems.js');

require('dotenv').config();



/**
 * Maneja mensajes recibidos desde MQTT y realiza acciones según el topic.
 * @param {string} topic - El topic MQTT.
 * @param {object} message - El mensaje recibido.
 */

async function handleMessages(topic, message){
	try {
		var tableName = "";
		const ID = topic.split("/")[0];

		if (topic.endsWith("setting")) {
			tableName = "DevicesSettings";
			const response = await updateItem(tableName, ID, message);

			if (response.$metadata.httpStatusCode === 200) {
				console.log("Actualización exitosa.");
			} else {
				console.error(
					`Error al actualizar el item. Código HTTP: ${response.$metadata.httpStatusCode}`
				);
			}
		}else if(topic.endsWith("data")){
			tableName = "DevicesData";
			await addItem(tableName, ID, message);
		}

	} catch (error) {
		console.error("Error al procesar el mensaje:", error);
	}
}

/**
	* Suscribe a topics MQTT relacionados con los dispositivos.
	* @param {object} connection - Conexión MQTT.
	* @param {Array<string>} topics - Topics a susctibirse.
*/
async function subscribeToTopics(connection, topics) {
	const decoder = new TextDecoder("utf8");

	const on_publish = async (topic, payload) => {
		try {
			const json = decoder.decode(payload);
			console.log(`Mensaje recibido en el tema "${topic}":`);
			console.log(json);

			const message = JSON.parse(json);
			await handleMessages(topic, message);
		} catch (error) {
				console.warn("Advertencia: No se pudo parsear el mensaje como JSON.");
		}
	};
	
	for (const topic of topics) {
		const settingsTopic = `${topic}/setting`;
		const dataTopic = `${topic}/data`;

		await connection.subscribe(settingsTopic, mqtt.QoS.AtLeastOnce, on_publish);
		console.log(`Suscrito al tema: ${settingsTopic}`);

		await connection.subscribe(dataTopic, mqtt.QoS.AtLeastOnce, on_publish);
		console.log(`Suscrito al tema: ${dataTopic}`);
	}   
}

async function SubscribeAWS() {
	// try {
  //   const connection = common_args.buildMqttConnection(process.env);

  //   console.log("Obteniendo los temas desde DynamoDB...");
	// 	const topics = await getTopicsAWS(dynamoDBClient);

  //   if (!topics || topics.length === 0) {
  //     console.warn("No se encontraron temas para suscribir.");
  //     return;
  //   }

	// 	console.log("Conectando al broker MQTT...");
  //   await connection.connect().catch((error) => { console.log("Connect error: " + error); exit(-1) });

	// 	console.log("Suscribiéndose a los temas...");
  //   await subscribeToTopics(connection, topics).catch((error) => { console.log("Session error: " + error); exit(-1) });
    
	// 	setInterval(() => { }, 90 * 1000);
	// }catch (error) {
	// 	console.error("Error en SubscribeAWS:", error);
  //   exit(-1);
	// }
}

module.exports = { SubscribeAWS, subscribeToTopics };