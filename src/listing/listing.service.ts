import fs from 'node:fs';
import { access, opendir, stat } from 'node:fs/promises';
import path from 'node:path';
import { ListingEntry } from './listing.model';
import { ErrInvalidArgument } from '../errors/errors';

export const getFiles = async (pathToScan: string, offset: number, limit: number): Promise<ListingEntry[]> => {
  // validate the path exists
  try {
    // eslint-disable-next-line no-bitwise
    await access(pathToScan, fs.constants.R_OK);
  } catch (err) {
    console.error(`stat(${pathToScan}) err: ${err}`);
    throw new ErrInvalidArgument('Cannot get to path: ${pathToScan}');
  }

  // read asynchronously an entry at a time (it is actually buffered.  see opendir spec for details)
  try {
    const listing: ListingEntry[] = [];

    const dir: fs.Dir = await opendir(pathToScan);

    // When using the async iterator, the fs.Dir object will be automatically closed after the iterator exits.
    for await (const dirent of dir) {
      // skip to offset
      if (offset-- > 0) {
        continue;
      }

      // get file information
      const fullPath = path.join(dirent.path, dirent.name);
      const fileInfo = await stat(fullPath);

      const entry: ListingEntry = {
        fullPath,
        name: dirent.name,
        size: fileInfo.size,
        attributes: fileInfo.mode,
        isFile: dirent.isFile(),
      };
      listing.push(entry);

      // quit if we reached the limit
      if (--limit === 0) {
        break;
      }
    }
    return listing;
  } catch (err) {
    console.error(`getFiles failed. err: ${err}`);
    throw err;
  }
};
