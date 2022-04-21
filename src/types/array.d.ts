/**
 * Array.isArray が ReadonlyArray の場合に正しく型がつかない問題があるので、型を拡張する。
 *
 * @see https://github.com/microsoft/TypeScript/issues/17002#issuecomment-494937708
 */
interface ArrayConstructor {
  isArray(arg: ReadonlyArray<unknown> | unknown): arg is ReadonlyArray<unknown> | Array<unknown>
}
