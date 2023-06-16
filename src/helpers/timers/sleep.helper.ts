export async function sleep(
  ms: number,
  cancellationToken?: { cancel?: () => void },
): Promise<void> {
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, ms);

    if (cancellationToken) {
      cancellationToken.cancel = (): void => {
        clearTimeout(timeout);
        resolve();
      };
    }
  });
}
