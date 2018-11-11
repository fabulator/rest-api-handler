import { getDevelopConfig, getDirectoryConfig } from '@socifi/rollup-config';
import path from 'path';

//export default getDevelopConfig(path.resolve(__dirname, 'dev', 'index.ts'));
export default getDirectoryConfig(path.resolve(__dirname, 'src'));
