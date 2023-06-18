/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(
  action: (...args: any[]) => void,
): (ms: number, ...args: any[]) => void {
  let timeout: NodeJS.Timeout;

  return (ms: number, ...args: any[]) => {
    clearTimeout(timeout);

    timeout = setTimeout((): void => {
      action(...args);
    }, ms);
  };
}
