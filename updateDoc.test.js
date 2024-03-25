import { pushFakeDoc } from './testMethods/pushFakeDoc.js'
import { updateSubscriber } from './testMethods/updateSubscriber.js';

test('adds 1 + 2 to equal 3', async () => {
    await pushFakeDoc();
    const result = expect(await updateSubscriber());
    expect(result).toBe(true);
});
