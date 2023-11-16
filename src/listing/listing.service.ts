import { opendir, stat } from 'node:fs/promises';
import path from 'node:path';
import { ListingEntry } from './listing.model';
import { ErrInvalidArgument } from '../errors/errors';

export const getFiles = async (pathToScan: string, offset: number, limit: number): Promise<ListingEntry[]> => {
  // validate the path exists
  try {
    await stat(pathToScan);
  } catch (err) {
    console.error(`stat(${pathToScan}) err: ${err}`);
    throw new ErrInvalidArgument('Cannot get to path: ${pathToScan}');
  }

  // read asynchronously an entry at a time (it is actually buffered.  see opendir spec for details)
  try {
    const listing: ListingEntry[] = [];

    const dir = await opendir(pathToScan);
    for await (const dirent of dir) {
      // skip entries that are not a file or subdirectory
      if (!dirent.isFile()) {
        continue;
      }
      // skip to offset
      if (offset-- > 0) {
        continue;
      }

      const entry: ListingEntry = {
        name: dirent.name,
        size: (await stat(path.join(dirent.path, dirent.name))).size,
      };
      listing.push(entry);

      // quit if we reeached the limit
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
