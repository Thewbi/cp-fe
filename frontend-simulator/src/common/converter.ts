export interface Converter<S, T> {
  convert(source: S, target: T): void;
}
