import 'tsarch/dist/jest';
import { filesOfProject } from 'tsarch';

describe('architecture', () => {
  it('data acess should not depend on the presentation', async () => {
    const rule = filesOfProject().inFolder('data-access').shouldNot().dependOnFiles().inFolder('router');

    await expect(rule).toPassAsync();
  });

  it('business layer should not depend on the presentation', async () => {
    const rule = filesOfProject().inFolder('service').shouldNot().dependOnFiles().inFolder('router');

    await expect(rule).toPassAsync();
  });

  it('service layer should not depend on the data access', async () => {
    const rule = filesOfProject().inFolder('service').shouldNot().dependOnFiles().inFolder('data-access');

    await expect(rule).toPassAsync();
  });
});
