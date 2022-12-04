import test from "ava";
import { sleep } from "./lib";
import { programSnapshot, testSourceCode } from "./lib/runtimeSnapshot";

/**
 * Wait for the API to start up.
 */
await sleep(1000);

test.serial("zsh", async (t) => {
  await programSnapshot(t, "zsh", "find the first 5 Mersenne primes without third party libraries");
});

test.serial("python", async (t) => {
  await programSnapshot(
    t,
    "python",
    "load the ticker history from tickers.csv, and plot the total return over time using ggplot and pandas"
  );
});

test.serial("typescript", async (t) => {
  await programSnapshot(
    t,
    "typescript",
    "define Y combinator function Y(f) and demo using console.log"
  );
});

test.serial("mandelbrot", async (t) => {
  await programSnapshot(
    t,
    "python",
    "plot the Mandelbrot set"
  );
});

/**
 * Source code only tests:
 */

test.serial("Next.js page", async (t) => {
  await testSourceCode(
    t,
    "typescript",
    "export a Next.js page called CounterPage which renders a header saying Hello World, and a counter which is incremented by a blue button labeled Press Me"
  );
});

test.serial("gene splicing", async (t) => {
  await testSourceCode(
    t,
    "python",
    "clusters time-series gene expression signatures using smoothing spline clustering"
  );
});