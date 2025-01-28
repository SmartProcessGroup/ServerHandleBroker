// const mqtt = require('mqtt');
// const { sendData } = require('../Firebase/addData');
// const { getTopcis } = require('../Firebase/getTopics');

// // Conexión al cliente MQTT
// const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
//   // username: 'admin',
//   // password: 'admin',
//   // reconnectPeriod: 5000
// });

// const startSubscribe = async () => {
//   try {
//     const topics = await getTopcis(); // Obtener los tópicos

//     if (!client.connected) {
//       console.error("El cliente MQTT no está conectado");
//       return;
//     }
//     await Promise.all(topics.map(topic => { 
//       new Promise((resolve, reject) => {  
//         client.subscribe(topic, (err) => {
//           if (err) {
//             console.error(`Error al suscribirse al tópico: ${topic}`, err);
//           } else {
//             console.log(`Suscrito al tópico: ${topic}`);
//           }
//         });
//       });
//     }));

//   } catch (error) {
//     console.error("Error al iniciar la suscripción:", error);
//   }
// };

// // Manejo de eventos del cliente MQTT}
// client.on("message", (topic, message) => {
//   try {
//     sendData(topic, message);
//   } catch (error) {
//     console.error(`Error al procesar el mensaje del tópico: ${topic}`, error);
//   }
// });

// client.on("connect", () => {
//   console.log("Cliente MQTT conectado exitosamente.");
// });

// client.on("error", (err) => {
//   console.error("Error en el cliente MQTT:", err);
// });

// client.on("close", () => {
//   console.warn("Conexión MQTT cerrada.");
//   client.end;
//   client.disconnected = true;
// });

// // Exporta la función
// module.exports = { startSubscribe };
