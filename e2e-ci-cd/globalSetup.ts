import extract from 'extract-zip';
import path from 'path';

async function unpackMetamaskExtension(): Promise<void> {
  const source = path.join(__dirname, './dist/metamask-chrome-10.19.0.zip');
  const target = path.join(__dirname, './dist/metamask');

  return extract(source, { dir: target });
}

async function globalSetup() {
  await unpackMetamaskExtension();
}

export default globalSetup;
