import { firestore } from '../config/config.js';
import { getNewDocument } from '../cacheMethods/util/httpUtils.js';


export const pushFakeDoc = async () => {
    console.log("Initiating test function 'pushFakeDoc'...");

    const id = "32665";
    const pilDocument = await getNewDocument("62eba39dadab2.pdf");  // PIL path

    try {
        console.log(`Fetching docRef...`);

        const collectionName = "files";
        const documentID = "62eba3c3150c0.pdf"; // path of SPC
    
        const docRef = firestore.collection(collectionName).doc(documentID);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {

            // let data = {
            //     doc: pilDocument
            // };

            await docRef.update({
                doc: pilDocument // Update the specific medicine by its ID
            });
    
            console.log(`Document with ID: ${documentID} uploaded to Firestore.`);
            console.log("Exiting test function 'pushFakeDoc'...")

            return true;
        } else {
            console.log("Document not found.");
            console.log("Exiting test function 'pushFakeDoc'...")

            return false;
        }

    } catch (error) {
        console.error(`Error uploading document to Firestore: ${error}`);

        return false;
    }
};