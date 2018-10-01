export interface OverviewPage {
  orders: OverviewPageItem;
  gain: OverviewPageItem;
};

export interface OverviewPageItem {
  percent: number;
  compare: number;
  yesterday: number;
  isHigher: boolean;
}
