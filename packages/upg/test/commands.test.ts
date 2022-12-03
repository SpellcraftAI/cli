import test from "ava";
import { createShell } from "universal-shell";
import { sleep } from "./lib";

/**
 * Wait for the API to start up.
 */
await sleep(1000);

const shell = createShell();

test.serial("zsh", async (t) => {
  if (process.env.CI) return t.pass();

  const { stdout } = await shell.run(
    "./dist/bin.js -n zsh \"print the first 30 Mersenne primes\""
  );

  t.snapshot(stdout);
});

test.serial("python", async (t) => {
  if (process.env.CI) return t.pass();

  const { stdout } = await shell.run(
    "./dist/bin.js -n python \"load the ticker history from tickers.csv, calculate the cumulative returns of tickers by price_close over time, and plot using ggplot and pandas\""
  );

  t.snapshot(stdout);
});

test.serial("typescript", async (t) => {
  if (process.env.CI) return t.pass();

  const { stdout } = await shell.run(
    "./dist/bin.js -n typescript \"define Y combinator function Y(f) and demo using console.log\""
  );

  t.snapshot(stdout);
});

test.serial("mandelbrot", async (t) => {
  if (process.env.CI) return t.pass();

  const { stdout } = await shell.run(
    "./dist/bin.js -n python \"plot the Mandelbrot set\""
  );

  t.snapshot(stdout);
});

test.serial("Next.js page", async (t) => {
  if (process.env.CI) return t.pass();

  const { stdout } = await shell.run(
    "./dist/bin.js -n typescript \"export a Next.js page called CounterPage which renders a header saying Hello World, and a counter which is incremented by a blue button labeled Press Me\""
  );

  t.snapshot(stdout);
});