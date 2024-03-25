import { pushFakeDoc } from './testMethods/pushFakeDoc.js'
import { updateSubscriber } from './testMethods/updateSubscriber.js';

test('Update subscriber doc', async () => {
    await pushFakeDoc();
    const result = expect(await updateSubscriber());
    expect(result).toBe(true);
});
