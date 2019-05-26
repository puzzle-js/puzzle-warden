import {performance, PerformanceObserver} from "perf_hooks";

type TestRunner = () => Promise<void>;

type Test = {
  fn: TestRunner;
  name: string;
  warmUpAmount: number;
  stats: {
    runs: number;
    success: number;
    errors: number;
    duration: number;
  };
};

type TestSettings = {
  parallelism: number;
  amount: number;
  test: Test;
};

class Benchmarker {
  private tests: {
    [key: string]: Test
  } = {};
  private parallelRunners = 0;
  private iterationCount = 0;

  register(name: string, fn: TestRunner, warmUpAmount: number) {
    this.tests[name] = {
      fn,
      name,
      warmUpAmount,
      stats: {
        runs: 0,
        success: 0,
        errors: 0,
        duration: 0
      }
    };
  }

  run(amount: number, parallelism: number) {
    const testSettings = Object.values(this.tests).map((test: Test) => ({
      test,
      amount,
      parallelism
    }));
    this.testRunnerController(testSettings);

    const obs = new PerformanceObserver((items) => {
      items.getEntries().forEach((item) => {
        this.tests[item.name].stats.duration = item.duration;
      });
    });
    obs.observe({entryTypes: ['measure']});
  }

  private refreshTestSuite(test?: Test) {
    this.parallelRunners = 0;
    this.iterationCount = 0;

    if (test) {
      test.stats = {
        runs: 0,
        success: 0,
        errors: 0,
        duration: 0
      };
    }
  }

  private testRunnerController(tests: TestSettings[]) {
    const firstTest = tests[0];

    if (firstTest) {
      console.log(`${firstTest.test.name} warming up for ${firstTest.test.warmUpAmount} times`);
      this.runner(firstTest.test, firstTest.test.warmUpAmount, firstTest.parallelism, false, () => {
        this.refreshTestSuite(firstTest.test);
        console.log(`${firstTest.test.name} warming ended`);
        console.log(`${firstTest.test.name} started`);
        performance.mark(firstTest.test.name + 'start');
        this.runner(firstTest.test, firstTest.amount, firstTest.parallelism, false, () => {
          performance.mark(firstTest.test.name + 'done');
          performance.measure(firstTest.test.name, firstTest.test.name + 'start', firstTest.test.name + 'done');
          console.log(`${firstTest.test.name} ended`);
          this.refreshTestSuite();
          this.testRunnerController(tests.splice(1));
        });
      });
    } else {
      console.log(JSON.stringify(Object.values(this.tests).map(test => ({
        name: test.name,
        stats: test.stats
      })), null, 4));
    }
  }

  private runner(test: Test, amount: number, parallelism: number, recurse: boolean, cb: Function) {
    if (recurse) {
      test.fn().then(() => {
        test.stats.success++;
      }).catch(() => {
        test.stats.errors++;
      }).finally(() => {
        test.stats.runs++;
        if (test.stats.runs === amount && this.parallelRunners === 1 && this.iterationCount === amount) {
          return cb();
        } else {
          if (this.iterationCount < amount) {
            this.iterationCount++;
            this.runner(test, amount, parallelism, true, cb);
          } else {
            this.parallelRunners--;
          }
        }
      });
    } else {
      const igniteAmount = Math.min(parallelism, amount);
      if (igniteAmount > this.parallelRunners) {
        this.iterationCount = igniteAmount;
        this.parallelRunners = igniteAmount;
        for (let i = 0; i < igniteAmount; i++) {
          this.runner(test, amount, parallelism, true, cb);
        }
      }
    }

  }
}

// Usage

// const test = new Benchmarker();
//
// test.register('test', () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(reject, 19);
//   });
// }, 10);
//
// test.register('test2', () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(reject, 20);
//   });
// }, 10);
//
// test.run(10000, 50);


export {
  Benchmarker
};
