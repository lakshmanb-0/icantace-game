export enum SchemaType {
  TAG = 'tag',
  GENRE = 'genre',
  PLATFORM = 'platform',
  DEVELOPER = 'developer',
  PUBLISHER = 'publisher',
  ESRB_RATING = 'esrb_rating',
  CREATOR = 'creator',
}

export const EntityType: Record<SchemaType, string> = {
  [SchemaType.TAG]: 'tags',
  [SchemaType.GENRE]: 'genres',
  [SchemaType.PLATFORM]: 'platforms',
  [SchemaType.DEVELOPER]: 'developers',
  [SchemaType.PUBLISHER]: 'publishers',
  [SchemaType.ESRB_RATING]: 'esrb_ratings',
  [SchemaType.CREATOR]: 'creators',
};
