import { firestore } from '../config/config.js';
import { compareBuffer } from '../cacheMethods/util/compareBuffer.js';

export const checkUserDoc = async () => {
    const user = "test2@123.com"
    const id = "32665";
    const type = "spc";

    console.log(`User ${user} now checking for medicine ${id}`);
    const path = type + "Path";

    console.log(`Path:`, path);

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
            const cachedDoc = filesData.doc;

        console.log(`Got cached doc...`);

        // Grab the document from the user's side
        const medData = userData.medicines;
        
        // If user has a cached doc:
        if (medData[id][type].doc) {
            
            const isEqual = compareBuffer(medData[id][type].doc, cachedDoc);

            if (isEqual) {

                console.log(`Documents are equal`);
                return true;

            } else {
                console.log(`Documents are not equal`);
                return false;
            }
            
        } else {
            console.log(`Document not found`);

            return false;
        }

    } else {
        console.log(`Medicine not found in user database`);
    }
}