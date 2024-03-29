import { firestore } from '../config/config.js';
import admin from 'firebase-admin';
import { getNewDocument } from '../cacheMethods/util/getNewDocument.js';

export const pushFakeUserDoc = async () => {
    console.log("Initiating test function 'pushFakeDoc'...");

    const id = "32665";
    const pilDocument = await getNewDocument("62eba39dadab2.pdf");
    const spcDocument = await getNewDocument("62eba39dadab2.pdf");

    try {
        console.log(`Fetching docRef...`);

        const collectionName = "users";
        const documentID = "test2@123.com"
    
        const docRef = firestore.collection(collectionName).doc(documentID);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {

            const newPIL = { doc: pilDocument, cachable: true };
            const newSPC = { doc: spcDocument, cachable: false };

            const activeIngredients = {
                0: "Paracetamol"
            }

            let data = {
                [id]: {
                    name: 'Lemsip Max Cold & Flu Blackcurrant 1000mg Powder for Oral Solution',
                    activeIngredients: activeIngredients,
                    pil: newPIL,
                    spc: newSPC
                }
            };

            await docRef.update({
                [`medicines.${id}`]: data[id] // Update the specific medicine by its ID
            });
    
            console.log(`Document with ID: ${documentID} uploaded to Firestore.`);
        } else {
            console.log("Document not found.");
        }

    } catch (error) {
        console.error(`Error uploading document to Firestore: ${error}`);
    }

    console.log("Exiting test function 'pushFakeDoc'...")
};

await pushFakeDoc();