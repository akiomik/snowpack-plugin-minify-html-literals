import {execAsync} from './helper';

describe('execAsync', () => {
  describe('when a command failed', () => {
    test('rejects', async () => {
      const command = `ls -1 ${__dirname} | grep no-file.ts`;
      expect(execAsync(command)).rejects.toThrow();
    });
  });

  describe('when a command succeeded', () => {
    test('returns stdout', async () => {
      const command = `ls -1 ${__dirname} | grep helper.ts`;
      await expect(execAsync(command)).resolves.toEqual('helper.ts\n');
    });
  });

  describe('when options are specified', () => {
    test('works with options', async () => {
      const command = 'ls -1 | grep helper.ts';
      const actual = await execAsync(command, {cwd: __dirname});
      expect(actual).toEqual('helper.ts\n');
    });
  });
});
