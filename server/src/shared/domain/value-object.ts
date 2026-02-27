export abstract class ValueObject<Props extends object> {
  protected constructor(protected readonly props: Props) {}

  equals(vo?: ValueObject<Props>): boolean {
    if (!vo) return false;
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
