const {db} = require("./firebase.js");

const sendData = async (topic, message) => {  
    try {
      const data = JSON.parse(message.toString());

      if (!data.Date) {
        throw new Error("El mensaje no contiene el campo 'Date'.");
      }
      
      res = await db.collection('Guardianes').doc("Devices").collection(topic).doc(data.Date).set(data, {merge: true});
      console.log("Documento Guardado exitosamente");
        
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}

module.exports = {sendData};