import test from "ava";
import { sleep } from "./lib";
import { programSnapshot, testSourceCode } from "./lib/runtimeSnapshot";

/**
 * Wait for the API to start up.
 */
await sleep(1000);

test.serial("zsh", async (t) => {
  await programSnapshot(t, "zsh", "print the first 30 Mersenne primes");
});

test.serial("python", async (t) => {
  await programSnapshot(
    t,
    "python",
    "load the ticker history from tickers.csv, calculate the cumulative returns of tickers by price_close over time, and plot using ggplot and pandas"
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

test.serial("Next.js page", async (t) => {
  await testSourceCode(
    t,
    "typescript",
    "export a Next.js page called CounterPage which renders a header saying Hello World, and a counter which is incremented by a blue button labeled Press Me"
  );
});
