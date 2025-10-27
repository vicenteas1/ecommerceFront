export type HistoricalGraphProps<T = unknown> = {
  data: T;
  title?: string;
  height?: number;    
  yLabel?: string;   
  className?: string;
};