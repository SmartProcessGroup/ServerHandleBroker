const express = require('express');
const app = express();
const PORT = 3000;

const {subscribeToTopics} = require('./AWS/SubscribeAWS.js');
const {connectAWS} = require('./AWS/ConnectAWS.js');
const {getTopicsAWS} = require('./AWS/DynamoDb/GetTopicsAWS.js');
const dynamoDBClient = require('./AWS/DynamoDb/ClientDynamoDB.js');
const {setFlagUploadLocation} = require('./AWS/DynamoDb/AddItems.js');

var ConnectionAWS;
var Topics = [];

app.use(express.json()); // Middleware necesario para procesar JSON

//Volver a suscribirse
app.get('/subscribe', async function (req, res){
	if(!ConnectionAWS){
		ConnectionAWS = await connectAWS();
	}

	Topics = await getTopicsAWS(dynamoDBClient);
	
	if (Topics.length > 0){
		subscribeToTopics(ConnectionAWS, Topics);   
		console.log("Resubscribed to topics");
		res.send("Resubscribed to topics");
	}else{
		console.log("No hay topics para suscribirse");
		res.send("No hay topics para suscribirse");
	}
 });

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.listen(PORT, async (error) =>{
	if(!error){
		console.log("Server is Successfully Running, and App is listening on port "+ PORT);
		
		//Conectarse al Broker AWS IOT
		ConnectionAWS = await connectAWS(); 
		//Obtener los Topic de Dynamo DB
		Topics = await getTopicsAWS(dynamoDBClient); 
		if (Topics.length > 0){
			subscribeToTopics(ConnectionAWS, Topics);   
		}else{
			console.log("No hay topics para suscribirse");
		}
	}else  console.log("Error occurred, server can't start", error);
	
	// setInterval(() => { }, 90 * 1000);
	}
);