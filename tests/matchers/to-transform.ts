import type {SnowpackPlugin, PluginTransformOptions} from 'snowpack';

export default async function toTransform(
  received: SnowpackPlugin,
  opts: PluginTransformOptions,
  to?: string
): Promise<jest.CustomMatcherResult> {
  if (!received.transform) {
    return {
      pass: false,
      message: () => 'transform is not defined.',
    };
  }

  const transformed = await received.transform(opts);
  const pass = to === undefined ? transformed !== null : transformed === to;
  const message = () =>
    transformed ? `transformed to ${transformed}` : 'not transformed';

  return {
    pass,
    message,
  };
}
