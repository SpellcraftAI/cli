```
  __  ______  ____ _    UPG CLI
 / / / / __ \/ __ `/    Public Beta
/ /_/ / /_/ / /_/ /     
\__,_/ .___/\__, /      🇺🇸  Built by GPT Labs
    /_/    /____/       Now officially a CIA front company!
                        (c) 2022 MIT License
```

This is an initial public release. It will be ugly. Please send feedback to
[`@ctjlewis` on
Twitter](https://twitter.com/ctjlewis).

## What is UPG?

UPG is a tool for creating and editing programs given a **target** (language)
and a **description**.

You can put anything you want in those fields, but some targets are supported
out of the box for execution (TypeScript using `tsmodule`, Python using
`python3`, and OS-specific shell commands `zsh`, `bash`, and `cmd`). You can
still execute non-supported targets by telling the CLI what command to run to
execute the output file.

## Installing

Using Yarn:

```bash
yarn global add @gptlabs/upg
```

Using NPM:

```bash
npm i -g @gptlabs/upg
```

After installing, you can update with `upg update`.

## Usage

### Create

To create a new program, run `upg`. You will be prompted to enter a language and
a description of what the program will do.

### Edit

When you have a program loaded, either by creating a new one or using `upg load
<file>`, you can edit it by describing the changes that need to be made.

## Example: Terminal

By default, the language is set to an OS-specific shell: `zsh` for Mac, `bash`
for Linux, and `cmd` for Windows.

### Converting files with `ffmpeg`

1. Generating `ffmpeg` spaghetti to convert all `.mov` files in the current
   directory to `.mp4`:
   
   ![](https://github.com/gptlabs/tools/raw/master/packages/upg/ffmpeg.gif)

2. Converting screen recordings of these demos to `.gif` for use in this README:

   ![](https://github.com/gptlabs/tools/raw/master/packages/upg/ffmpeg-gif.gif)

## Example: Other programs

You can generate programs for any language.

### Generate and demo the Y combinator function

  1. Generating the Y-combinator function, adding a demo, and executing using
    [TS Module](https://github.com/tsmodule/tsmodule) (similar to `ts-node`, but
    won't throw on account of type errors):
    
      ![](https://github.com/gptlabs/tools/raw/master/packages/upg/ycombinator.gif)

### Convert to other languages

You can translate programs to other languages using the edit feature. The
language context will not automatically change yet - in the meantime, use
**Save** to write to `yc.py` and then `upg load yc.py` to run it as Python.

  1. Translating the Y combinator output above from TypeScript to Python:

      ![](https://github.com/gptlabs/tools/raw/master/packages/upg/yc.gif)

## Known issues

  1. It is not possible yet to switch the language context for a translation,
      i.e. the CLI cannot know the above example to Python, and if you select
      **Run**, it will attempt to execute it as TS.
  
      This will be solved in future versions, but for now, use **Copy** or
      **Save** to get it out of the CLI and execute it manually.

      See the **Convert to other languages** section above.