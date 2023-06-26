export enum TradePathsSortBy {
  Item = 'item',
  Wish = 'wish',
  TradeCount = 'tradeCount',
}

export interface FindTradePathsDto {
  userItemIds?: string[];
  userWishIds?: string[];
}
