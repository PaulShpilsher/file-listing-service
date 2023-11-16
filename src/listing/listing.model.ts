export type ListingEntry = {
  name: string;
  size: number;
};

export type ListingDto = {
  path: string;
  entries: ListingEntry[];
};
