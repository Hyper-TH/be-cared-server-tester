
// TODO: READ FLAW HERE 
/* 
    In the case scenario where there is no cached document,
    and there is an updated document, there is (as of this moment)
    no way of telling if it has been "seen" before or not.

    Additionally, if the new document is new and not cachable,
    the server will mark this as uncachable, and therefore 
    the user side will still stay on the outdated document.
*/

import { firestore } from '../config/config.js';
import { 
    equalPath, unequalDocuments, uncachedPath, 
    unequalPaths, outdatedCache, unavailableMed 
} from './conditions.js';
import { getNewMedsData } from './util/firestoreUtils.js';
import { compareBuffer } from './util/compareBuffer.js';

// Method to cache PIL every week
export const weeklyCachePIL = async () => {
    
    console.log("Job started");
    console.trace('Trace at cron job execution');

    const path = "pilPath";

    try {
        const querySnapshot = await firestore.collection("medicines").get();

        if (querySnapshot.empty) {
            console.log('No documents found.');
            return;
        }

        // Iterate over each document in the collection
        // Use a for...of loop to handle async operations
        for (const doc of querySnapshot.docs) {
            const cachedPath = doc.data().pilPath;
            const medicineID = doc.id;
            const medicineName = doc.data().name;
            let newPath;

            console.log(`\nProcessing document with medName: ${medicineName} id: ${medicineID}`);

            try {
                const [ found, medsData ] = await getNewMedsData(medicineID, medicineName);

                if (medsData.pils[0]) {

                    newPath = medsData.pils[0].activePil.file.name;

                    if (decodeURIComponent(cachedPath) === newPath) {
                        let [ newPILDoc, cachedDoc ] = await equalPath(cachedPath, newPath);
                        
                        if (cachedDoc) {
                            let isEqual = compareBuffer(newPILDoc, cachedDoc.doc);
                            
                            if (isEqual) { 
                                console.log(`No new updates`); 
                            } else {
                                await unequalDocuments(cachedPath, newPath, newPILDoc);
                            }
    
                        } else { 
                            await uncachedPath(newPILDoc, newPath); 
                        }                     

                    } else {
                        await unequalPaths(cachedPath, newPath, medicineID, path);
                    }
                } else {
                    await outdatedCache(medicineID, cachedPath, path);
                }
                
                if (!found) {
                    await unavailableMed(medicineID);

                    console.log(`No match found for medicine ID: ${medicineID}`);
                }

            } catch (error) {
                console.error(`An error occurred while processing medicine ID: ${medicineID}:`, error);
                return false;
            }
        };

    } catch (error) {
        console.error(`Error fetching documents: ${error}`);
        return false;
    }
    
    console.log("Job Ended");
    return true;
};  

// Method to cache PIL every week
export const weeklyCacheSPC = async () => {
    console.log("Job started");
    const path = "spcPath";

    try {
        const querySnapshot = await firestore.collection("medicines").get();

        if (querySnapshot.empty) {
            console.log('No documents found.');
            return;
        }

        // Iterate over each document in the collection
        // Use a for...of loop to handle async operations
        for (const doc of querySnapshot.docs) {
            const cachedPath = doc.data().spcPath;
            const medicineID = doc.id;
            const medicineName = doc.data().name;
            let newPath;

            console.log(`\nProcessing document with medName: ${medicineName} id: ${medicineID}`);

            try {
                const [ found, medsData ] = await getNewMedsData(medicineID, medicineName);

                if (medsData.activeSPC.file) {

                    newPath = medsData.activeSPC.file.name;

                    if (decodeURIComponent(cachedPath) === newPath) {
                        let [ newSPCDoc, cachedDoc ] = await equalPath(cachedPath, newPath);
                        
                        if (cachedDoc) {
                            let isEqual = compareBuffer(newSPCDoc, cachedDoc.doc);
                            
                            if (isEqual) { 
                                console.log(`No new updates`); 
                            } else {
                                await unequalDocuments(cachedPath, newPath, newSPCDoc);
                            }
    
                        } else { 
                            await uncachedPath(newSPCDoc, newPath, path); 
                        }                     

                    } else {
                        await unequalPaths(cachedPath, newPath, medicineID, path);
                    }
                } else {
                    await outdatedCache(medicineID, cachedPath);
                }
                
                if (!found) {
                    await unavailableMed(medicineID);

                    console.log(`No match found for medicine ID: ${medicineID}`);
                }
                
            } catch (error) {
                console.error(`An error occurred while processing medicine ID: ${medicineID}:`, error);
            }
        };

    } catch (error) {
        console.error(`Error fetching documents: ${error}`);
        return false;
    }
    
    console.log("Job Ended");
    return true;
};  

/*
    subscriptions: [
        {
            medicineID,
            medicineName,
            company,
            activeIngredient,
            pil: {
                path,
                doc: _bytestring,
                available: BOOL
            },
            spc: {
                path,
                doc: _bytestring,
                available: BOOL
            }
        },
        {

        }
    ]
*/

// Method to check if user is up to date
// Derived from notifications()
export const notifications = async () => {
    const userDoc  = await firestore.collection("users").doc("test2@123.com").get();
    const documentData = userDoc.data();
    const medicines = documentData.medicines;
    const medicineEntries = Object.entries(medicines)

    // Iterate through each medicine object
    for (const [id, medicineData] of medicineEntries) {

        if (id === '32665') {
            console.log(`Processing: ${id}`);
            const cachedMedicine = await firestore.collection("medicines").doc(id).get();
            const cachedMedData = cachedMedicine.data();
            
            // CONDITION: If there is a PIL path from medicines collection
            if (cachedMedData.spcPath !== '') {
                console.log(`Pil path found: `, cachedMedData.spcPath);
                const cachedFiles = await firestore.collection("files").doc(cachedMedData.spcPath).get();
                const cachedDoc = cachedFiles.data();
                
                console.log(cachedDoc);
    
                // CONDITION: If user has a PIL
                if (medicineData.spc.doc !== '') {
                    console.log(`User has cached PIL`);
    
                    let isEqual = compareBuffer(medicineData.spc.doc, cachedDoc.doc);
                            
                    if (isEqual) { 
                        console.log(`No new updates`);
    
                        return false;
    
                    } else {
                        console.log(`New update for PIL`);
    
                        return true;
    
                    }
                } 
    
                // CONDITION : If user has no PIL 
                else {
                    console.log(`User has no cached PIL`);
    
                    return false;
    
                }
            } 
        }
        
    };
};