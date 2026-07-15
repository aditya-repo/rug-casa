export type ArtistCollectionItem = {
  id: string;
  slug: string;
  name: string;
  material: string;
  dimensions: string;
  /** Formatted price without currency symbol. */
  price: string;
  imageSrc: string;
  imageAlt: string;
};
