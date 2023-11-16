export type ListingEntry = {
  name: string;
  fullPath: string;
  size: number;
  attributes: number;
  isFile: boolean;
};

export type ListingDto = {
  entries: ListingEntry[];
};
