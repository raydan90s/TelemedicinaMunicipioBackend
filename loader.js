import { pathToFileURL } from 'url';
import { resolve as resolvePath } from 'path';

const aliases = {
  '@controllers': './src/controllers',
  '@models': './src/models',
  '@routes': './src/routes',
  '@services': './src/services',
  '@config': './src/config',
  '@middlewares': './src/middlewares',
  '@utils': './src/utils'
};

export async function resolve(specifier, context, nextResolve) {
  for (const [alias, path] of Object.entries(aliases)) {
    if (specifier.startsWith(alias)) {
      const aliasPath = specifier.replace(alias, path);
      const resolvedPath = resolvePath(aliasPath);
      return {
        url: pathToFileURL(resolvedPath).href,
        shortCircuit: true
      };
    }
  }
  return nextResolve(specifier, context);
}