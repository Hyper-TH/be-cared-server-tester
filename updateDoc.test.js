import { pushFakeUserDoc } from './testMethods/pushFakeUserDoc.js'
import { updateSubscriber } from './testMethods/updateSubscriber.js';
import { checkUserDoc } from './testMethods/checkUserDoc.js'
import { notifications, weeklyCachePIL, weeklyCacheSPC } from './cacheMethods/cacheMethods.js';

// Describe a test suite for your document update flow
// npm test > logs.txt or npm test >> logs.txt for appending
describe('Document Update Flow', () => {

    // Test case: Push a different doc to a user's cached SPC
    // ID: 32665 fake doc pushed to SPC
    test('Successfully push a fake document to user', async () => {
        try {
            
            // Step 1: Push fake document to set up the test environment
            await pushFakeUserDoc();

            // Step 2: Run notifications() and check for update
            const notificationResult = await notifications();
            expect(notificationResult).toBe(true);

        } catch {
            // Optionally log the error or perform additional error handling
            throw new Error(`Test failed with error: ${error.message}`);
        }
    }, 10000);

    // Test case: Check if the document update flow behaves as expected
    test('Successfully updates and verifies the user document', async () => {
        try {
            // Step 3: Update the subscriber based on the fake document
            await updateSubscriber();

            // Step 4: Verify the document update was successful
            const checkResult = await checkUserDoc();
            expect(checkResult).toBe(true);
            
        } catch (error) {
            // Optionally log the error or perform additional error handling
            throw new Error(`Test failed with error: ${error.message}`);
        }
    }, 10000); // Set a timeout of 10 seconds for this test


    // Test case: Weekly caching of PIL
    test('Successfully update and verify cached PIL documents', done => {
        weeklyCachePIL().then(result => {
            expect(result).toBe(true);
            done(); // Call done() when the promise resolves to signal Jest that the test is complete.
        }).catch(err => {
            done(err); // Pass any error to done to signal the test failed.
        });
    }, 200000); // Increase timeout as needed
   
    
    // TODO: Push a fake doc into one of the PIL documents 
    // then run the WeeklyCache again (except only log if its updated)
    // test('Successfully push a fake PIL and update it', done => {
        

    // }, 200000)
});