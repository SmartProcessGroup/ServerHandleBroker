const common_args = require('./utilsAWS.js');
const { exit } = require('process');
require('dotenv').config();	

async function connectAWS() {
	try {
		const connection = common_args.buildMqttConnection(process.env);

		console.log("Conectando al broker MQTT...");
		await connection.connect().catch((error) => { console.log("Connect error: " + error); exit(-1) });

		return connection;
	}catch (error) {
		console.error("Error en SubscribeAWS:", error);
    exit(-1);
	}
}

module.exports = { connectAWS };    