export interface Page<T, A> {
  avg: A;
  data: Array<T>;
  count: number;
  total: number;
}
