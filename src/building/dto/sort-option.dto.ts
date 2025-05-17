export enum SortOption {
  DEFAULT = 'Mặc định',
  PRICE_LOW_TO_HIGH = 'Giá: Thấp đến cao',
  PRICE_HIGH_TO_LOW = 'Giá: Cao đến thấp',
  HIGHEST_RATED = 'Đánh giá cao nhất',
  NEWEST = 'Mới nhất'
}

export const getSortParams = (sortOption: string) => {
  switch (sortOption) {
    case SortOption.PRICE_LOW_TO_HIGH:
      return { orderBy: { price: 'asc' } };
    case SortOption.PRICE_HIGH_TO_LOW:
      return { orderBy: { price: 'desc' } };
    case SortOption.HIGHEST_RATED:
      return { orderBy: { averageRating: 'desc' } };
    case SortOption.NEWEST:
      return { orderBy: { createAt: 'desc' } };
    default:
      return {};
  }
};
