import {exec, ExecOptions} from 'child_process';

export async function execAsync(
  command: string,
  options: ExecOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout) => {
      if (error) {
        return reject(error);
      }

      resolve(stdout);
    });
  });
}
