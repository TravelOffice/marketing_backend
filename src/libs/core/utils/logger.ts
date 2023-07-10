export default class Logger {
  log(...args: any) {
    let prefix = '';
    const stackTrace = new Error().stack;
    if (stackTrace) {
      const stackLines = stackTrace.split('\n');
      if (stackLines.length > 2) {
        const split = stackLines[2].trim().split(/\s+/);
        const caller = split[split.length - 1].replace(/[()]/g, '');
        prefix = `[${caller.replace(`${process.cwd()}/`, '')}]:`;
      }
    }
    // eslint-disable-next-line no-console
    console.log(prefix, ...args);
  }
}
