## What is UPG?

UPG is a tool for creating and editing programs given a **target** (language)
and a **description**.

You can put anything you want in those fields, but some targets are supported
out of the box for execution (TypeScript using `tsmodule`, Python using
`python`, and OS-specific shell commands `zsh`, `bash`, and `cmd`). You can
still execute non-supported targets by telling the CLI what command to run to
execute the output file.

## Installing

Using Yarn:

```bash
yarn global add @spellcraft/upg
```

Using NPM:

```bash
npm i -g @spellcraft/upg
```

After installing, you can update with `upg update`.

## Usage

### Create

To create a new program, run `upg`. You will be prompted to enter a language and
a description of what the program will do.

### Edit

When you have a program loaded, either by creating a new one or using `upg load
<file>`, you can edit it by describing the changes that need to be made.

### Explain

When you have a program loaded, you can ask UPG to explain it using the
**Explain** command. We attempt to generate the most useful, detailed
explanation possible.

## Example: Terminal

By default, the language is set to an OS-specific shell: `zsh` for Mac, `bash`
for Linux, and `cmd` for Windows.

### Converting files with `ffmpeg`

1. Generating `ffmpeg` spaghetti to convert all `.mov` files in the current
   directory to `.mp4`:
   
   ![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/ffmpeg.gif)

2. Converting screen recordings of these demos to `.gif` for use in this README:

   ![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/ffmpeg-gif.gif)

## Example: Other programs

You can generate programs for any language.

### Plotting the Mandelbrot set with Python

An oldie but a goodie.

![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/mandelbrot.gif)

### Generating and demonstrating the Y combinator function

Also adds a demo, and executes using [TS
Module](https://github.com/tsmodule/tsmodule)¹.

![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/ycombinator.gif)

<sub>¹ Similar to `ts-node`, but won't throw on account of type errors.
You'll need to install `@tsmodule/tsmodule` for now to run TS.</sub>

### Solving nontrivial problems using an edit loop

UPG did not generate a solution to [the minimum edit distance
problem](https://leetcode.com/problems/edit-distance/) immediately. It
initially contained errors and would not run.

First, errors were fixed using **Edit** to tell it: `fix errors: [pasted
errors]`. If you are able to identify the error logically and say it
conversationally rather than paste an error, that is better. (The person
who generated this solution was flying completely blind, could not solve
this problem if they wanted to, and had never written C.)

Then, failed cases were fixed using the following **Edit** pattern:
`functionName(input) should equal A, got B`. This was sufficient through
trial and error to fix the output for certain cases, until it passed for
all tests.

Finally, once it converged on a working solution, it was asked to optimize
performance using the **Edit** command: `refactor: make it faster`. (For
some reason, that spell works very well for performance optimization.)

![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/min-edit.png)

### Converting to other languages

You can translate programs to other languages using the edit feature. The
language context will not automatically change yet - in the meantime, use
**Save** to write to `yc.py` and then `upg load yc.py` to run it as Python.

#### Translating from TypeScript to Python

Translates the Y combinator output above.

![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/yc.gif)


#### Translating comments

UPG can translate comments and languages extremely reliably, for basically
any language you could name. It speaks English, Chinese, and Japanese very
fluently. See examples below for even harder language targets.

**Difficulty: EASY**

Translates the comments in the generated minimum edit distance
solution to English.

![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/translate.png)

**Difficulty: HARD**

Translates the comments in the same solution to Latin. 

Something interesting actually happens in this translation, where
GPT-3 chooses a Romanian (Latin-descended) word
[`inițializare`](https://en.wiktionary.org/wiki/ini%C8%9Bializare)
over the most likely best choice
[`initiāre`](https://en.wiktionary.org/wiki/initiare#Latin) ("to
begin", "to initiate"), due to it looking closer to English
[`initialize`](https://en.wiktionary.org/wiki/initialize). But it
remains a reliable transation more or less.

![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/latin.png)

**Difficulty: SUICIDE**

Translates the comments in the same solution to Māori, an Eastern Polynesian
language with approximately 180,000 native speakers.

It seems to drop the macrons (e.g. ā) due to code comments almost
always being ASCII only. 

![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/maori.png)

## Example: Explanations

Use the **Explain** command after loading a program to generate a detailed
explanation of what it does.

### Explaining the UPG-generated solution to the minimum edit distance problem

The following explanation was generated:

> The program is a solution to the Levenshtein Distance problem, which is the
> minimum number of edits (insertions, deletions, or substitutions) needed to
> transform one string into another. The program uses a dynamic programming
> approach to solving the problem.

![](https://github.com/SpellcraftAI/tools/raw/master/packages/upg/assets/explain.png)

## Known issues

  1. It is not possible yet to switch the language context for a translation,
      i.e. the CLI cannot know the above example was translated to Python, and
      if you select **Run**, it will attempt to execute it as TS.
  
      This will be solved in future versions, but for now, use **Copy** or
      **Save** to get it out of the CLI and execute it manually, or load it with
      `upg load [new-file]` and then **Run**.

      See the **Convert to other languages** section above .

## Developing

In the monorepo top-level directory `.`:

```shell
# install workspace dependencies
yarn

# enter UPG workspace
cd packages/upg
```

You can start development mode and build the production bundle using:

```shell
# develop
yarn dev

# build
yarn build
```

You can run the built program by executing `./dist/bin.js`, either manually or
by using the linked Yarn binary (linked automatically by `yarn build`):

```shell
# using yarn
yarn upg login
yarn upg load file.ts

# or
./dist/bin.js login
./dist/bin.js load file.ts
```