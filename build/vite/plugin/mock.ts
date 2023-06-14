import { viteMockServe } from 'vite-plugin-mock';

export function configMockPlugin(isBuild: boolean, prodMock: boolean) {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild && prodMock,
    injectCode: `
       import { setupProdMockServer } from '../mock/_createProductionServer';
 
       setupProdMockServer();
       `,
  });
}
