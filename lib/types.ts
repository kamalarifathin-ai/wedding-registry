export type WishlistItem = {
  id: string;
  name: string;
  description: string | null;
  target_price: number;
  photo_url: string | null;
  current_total: number;
  progress_percent: number;
};

export type ContributionInput = {
  item_id: string;
  contributor_name: string;
  amount: number;
};
