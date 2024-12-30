import { getRollupOptions } from '@nrwl/node/plugins/rollup';

export default function (config) {
  const options = getRollupOptions({
    config,
    context: 'this', // Para asegurar que 'this' está definido correctamente
  });

  // Deshabilitar tree shaking
  options.treeshake = false;

  // Otras configuraciones personalizadas si es necesario

  return options;
}
