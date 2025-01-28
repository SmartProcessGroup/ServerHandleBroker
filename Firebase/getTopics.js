const {db} = require("./firebase.js");

const getTopcis = async () => {  
    try {
        const res = (await db.collection('Guardianes').doc("Topics").get()).data();
        let topics = Object.keys(res);
        // console.log(res);
        
        return topics;

    } catch (e) {
      console.error("Error fetching document: ", e);
    }
}

module.exports = {getTopcis};