import { pushFakeUserDoc } from './testMethods/pushFakeUserDoc.js'
import { updateSubscriber } from './testMethods/updateSubscriber.js';
import { checkUserDoc } from './testMethods/checkUserDoc.js'
import { weeklyCachePIL, weeklyCacheSPC } from './cacheMethods/cacheMethods.js';

// Describe a test suite for your document update flow
// npm test > logs.txt or npm test >> logs.txt for appending
describe('Document Update Flow', () => {

    // Test case: Check if the document update flow behaves as expected
    test('Successfully updates and verifies the user document', async () => {
        // Step 1: Push a fake document to set up the test environment
        await pushFakeUserDoc();
        
        // TODO: Step 2: Run notifications() and see if it got updated (resolves.toBe(true))

        // Step 3: Update the subscriber based on the fake document
        await updateSubscriber();


        // Step 4: Verify the document update was successful
        // The checkUserDoc function should return a Promise that resolves to true if the document state is as expected
        await expect(checkUserDoc()).resolves.toBe(true);
    }, 10000); // Set a timeout of 10 seconds for this test


    test('Successfully update and verify cached PIL documents', done => {
        weeklyCachePIL().then(result => {
            expect(result).toBe(true);
            done(); // Call done() when the promise resolves to signal Jest that the test is complete.
        }).catch(err => {
            done(err); // Pass any error to done to signal the test failed.
        });
    }, 200000); // Increase timeout as needed
   
    
    // TODO: Push a fake doc into one of the PIL documents then run the test
    test('Successfully push a fake PIL and update it', done => {
        

    }, 200000)
});