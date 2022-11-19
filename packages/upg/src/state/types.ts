import { Change } from "diff";

export type State = {
  code: string;
  target?: string;
  file?: string;
  diff?: Change[];
  explanation?: string;
  lastRun?: {
    exitCode: number | null;
    stdout: string;
    stderr: string;
  };
};

export type NextState = {
  next: State | null;
  done: boolean;
  undo: boolean;
};