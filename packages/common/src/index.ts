export const APP_NAME = 'Solicitor';

export function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${String(value)}`);
}
