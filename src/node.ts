import { parseArgs, ArgsT } from './ParseArgumentModule/parseArgs';
import { Handout } from '@/Handout';
import fs from 'fs';
import { PDFEmbeddedPicture } from '@/others/types'; // FIXME: Bad, but temporarly. Do not import types from inside the CreatePDFModule

function checkEquality(exts: string[]): (str: string) => boolean {
  return (str: string) => {
    for (let i = 0; i < exts.length; ++i) {
      if (str.slice(-4) == '.' + exts[i]) return true;
    }
    return false;
  };
}

function getFilePaths(path: string): (extensions: string[]) => string[] {
  if (path[-1] != '/') path = path + '/';

  return (extensions: string[]): string[] => {
    if (typeof window === 'undefined') {
      const result: string[] = fs
        .readdirSync(path)
        .filter(checkEquality(extensions))
        .map((name: string) => path + name);

      return result;
    }

    return [];
  };
}

function getAssets(paths: string[]) {
  // TODO: Create type for assets in the module folder
  const assets: {
    type: Extension;
    bytes: Buffer;
  }[] = [];

  for (const path of paths) {
    const ext = path.slice(-3);
    const buffer: Buffer = fs.readFileSync(path);

    if (ext == 'jpg' || ext == 'png' || ext == 'pdf')
      assets.push({ type: ext, bytes: buffer });
    else throw new Error('Wrong File in getAssets(paths: string[])');
  }

  return assets;
}

// TODO: CHECK IF CODE STILL WORKS. IF SO, FINISH ALL THE OTHER TODO LISTS IN THE TS FOLDERS AND START CLEANING UP

async function getHandout(pdfPath: string, picturePath: string, id: number) {
  const assets = getAssets(getFilePaths(picturePath)(['pdf', 'png', 'jpg']));
  const handout = new Handout();

  const handoutBytes = await handout.createHandout(assets, id);
  fs.writeFileSync(pdfPath, handoutBytes);
}

(() => {
  const data: ArgsT = parseArgs(process.argv);
  getHandout(data.output, data.input, data.id);
})();
