import createRetryFetch from 'fetch-retry';
import isSDK from './isSDK';
import {isAndroid, isWeb, isIOS} from './common';

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#examples */
export function getCircularReplacer() {
  const ancestors = [];
  return function (key, value) {
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(value)) {
      return '[Circular]';
    }
    ancestors.push(value);
    return value;
  };
}

const fetchRetry = createRetryFetch(fetch, {
  retries: 23,
  retryDelay: function (attempt) {
    return Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
  },
  retryOn: function (attempt, error, response) {
    // retry on any network error, or 4xx or 5xx status codes
    if (error !== null || response.status > 400) {
      return true;
    }
  },
});

const sendLogs = (p: any[]) => {
  fetchRetry(
    'https://axiom-queue.appbuilder.workers.dev?dataset=app-builder-core',
    // "&strategy=queue", // to send logs to a specific dataset [default: queue]
    {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(p, getCircularReplacer()),
    },
  );
};

export const createAxiomLogger = () => {
  const queue: any[] = [];
  let batchId = 0;
  let timeout: number | null = null;

  const sendInterval = 45000; // 45s

  const flush = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (queue.length === 0) return;
    sendLogs(queue);
    queue.length = 0;
    batchId = batchId + 1;
  };

  const log = (logContent: {[key: string]: any}) => {
    logContent.batchId = batchId;
    queue.push(logContent);
    if (queue.length >= 1000) {
      flush();
    } else {
      if (timeout === null) {
        // @ts-ignore
        timeout = setTimeout(() => {
          flush();
        }, sendInterval);
      }
    }
  };

  return [log, flush] as const;
};

export const setupLogger = () => {
  const [log, flush] = createAxiomLogger();

  const _console_log = console.log;

  console.log = (...args: any[]) => {
    log({
      data: args,
      _time: Date.now(),
      projectId: $config.APP_ID,
      service: 'app-builder-core',
      env: isSDK()
        ? 'SDK'
        : isWeb()
        ? 'Web'
        : isAndroid()
        ? 'Android'
        : isIOS()
        ? 'Ios'
        : 'Electron',
    });

    isWeb() &&
      window.addEventListener('beforeunload', () => {
        flush();
      });

    _console_log(...args);
  };
};
