import { firestore } from '../config/config.js';
import { compareBuffer } from '../cacheMethods/util/compareBuffer.js';

export const updateSubscriber = async () => {
    const user = "test2@123.com"
    const id = "32665";
    const type = "spc";

    console.log(`User ${user} now checking for medicine ${id}`);
    const path = type + "Path";

    console.log(`Path:`, path);

    const userDocRef = firestore.collection("users").doc(user);
    const userDoc = await firestore.collection("users").doc(user).get();
    const userData = userDoc.data();
    const userMedicines = userData.medicines || {};

    console.log("User medicines", userMedicines);
    const medicineExists = userMedicines.hasOwnProperty(id);

    // If medicine is indeed subscribed by user
    if (medicineExists) {
        console.log(`Found user's medicine to check for updates`);
        
        // Get the path in the medicines collection using ID
        const medsDoc = await firestore.collection("medicines").doc(id).get();
        const medsData = medsDoc.data();

        const cachedPath = medsData[type + "Path"];

        console.log(`Cached path:`, cachedPath);

        // Get the cached doc using that path
        const filesDoc = await firestore.collection("files").doc(cachedPath).get();
        const filesData = filesDoc.data();

        // If there is a cached doc within the files collection
        if (filesData) {
            const cachedDoc = filesData.doc;

            console.log(`Got cached doc...`);

            // Grab the document from the user's side
            const medData = userData.medicines;
            
            // If user has a cached doc:
            if (medData[id][type].doc) {
                
                const isEqual = compareBuffer(medData[id][type].doc, cachedDoc);
    
                // If they're not equal, update the user's
                if (!isEqual) {
    
                    const docPath = `medicines.${id}.${type}.doc`;

                    const updateObject = {};
                    updateObject[docPath] = cachedDoc; // Use computed property names to set the dynamic key
                    
                    await userDocRef.update(updateObject)
                        .then(() => console.log("Document successfully updated"))
                        .catch((error) => console.error("Error updating document: ", error));

                    console.log(`User's ${type} doc has been updated`);

                } else {
                    console.log(`No new updates for user's ${type} doc`);
                }
            } 
            
            // If user has no cached doc
            else {
                const updatedMedicines = [...userData.medicines];
    
                if (updatedMedicines[index][type]) {
                    updatedMedicines[index][type].doc = cachedDoc;
                } else {
                    // Handle case where pil object might not exist
                    updatedMedicines[index][type] = { doc: cachedDoc };
                }
                
                // Prepare the update object for Firestore
                const updateObject = {};
                updateObject[`medicines.${index}.pil.doc`] = cachedDoc;
                
                // Update the document in Firestore
                await firestore.collection("users").doc(user).update(updateObject);
    
                console.log(`User's ${type} doc has been updated`);
            }
        } else {
            console.log(`No found cached file`);
        }
        

    } else {
        console.log(`Medicine not found`);
        return false;
    }
}
