import test from "ava";
import { createShell } from "universal-shell";
import { sleep } from "./lib";

/**
 * Wait for the API to start up.
 */
await sleep(1000);

test.serial("zsh", async (t) => {
  if (process.env.CI) return t.pass();

  const shell = createShell();
  const { stdout } = await shell.run(
    "upg -n zsh \"save the last year of stock ticker data for Google, Amazon, and Apple to CSVs from Yahoo Finance\""
  );

  t.snapshot(stdout);
});

test.serial("python", async (t) => {
  if (process.env.CI) return t.pass();

  const shell = createShell();
  const { stdout } = await shell.run(
    "upg -n python \"load the ticker history from tickers.csv, calculate the cumulative returns of tickers by price_close over time, and plot using ggplot and pandas\""
  );

  t.snapshot(stdout);
});

test.serial("typescript", async (t) => {
  if (process.env.CI) return t.pass();

  const shell = createShell();
  const { stdout } = await shell.run(
    "upg -n typescript \"define Y combinator function Y(f) and demo using console.log\""
  );

  t.snapshot(stdout);
});