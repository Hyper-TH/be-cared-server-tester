import { pushFakeDoc } from './testMethods/pushFakeDoc.js'
import { updateSubscriber } from './testMethods/updateSubscriber.js';
import { checkUserDoc } from './testMethods/checkUserDoc.js'


test('asyncFunctionUnderTest returns true', async () => {
    await updateSubscriber();
    await expect(checkUserDoc()).resolves.toBe(true);
}, 10000); // Timeout value in milliseconds, e.g., 10000ms = 10 seconds