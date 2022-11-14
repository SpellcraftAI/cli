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

When you have a program loaded, either by creating a new one or using `upg edit
<file>`, you can edit it by describing the changes that need to be made.

## Example: Terminal

By default, the language is set to an OS-specific shell: `zsh` for Mac, `bash`
for Linux, and `cmd` for Windows.

1. **Converting files with ffmpeg**

    This generates some `ffmpeg` spaghetti and converts a `.mov` file to `.mp4`.

    ```
    ✔ What language is this program written in? … zsh
    ✔ What will this program do? … convert demo.mov to demo.mp4 using ffmpeg
        
          1   #!/bin/zsh
          2   
          3   ffmpeg -i demo.mov -vcodec h264 -acodec aac -strict -2 demo.mp4
        
        
    ✔ What would you like to do? › Run
        
        ------------------------------
        Output
        ------------------------------
        
      
      $ zsh /var/folders/b0/rdq1ghc95sj4cm2qhvqmbrvh0000gn/T/0.eixwzktc9m.zsh
      
    ffmpeg version 5.1.2 Copyright (c) 2000-2022 the FFmpeg developers
      built with Apple clang version 14.0.0 (clang-1400.0.29.102)
      
    0kB time=00:00:02.01 bitrate=   0.2kbits/s dup=35 drop=0 frame=  216 fps= 70 q=31.0 size=       0kB time=00:00:02.61 bitrate=   0.1kbits/s dup=42 drop=0 frame=  252 fps= 70 q=31.0 size=       0kB 
    ...
    time=00:00:10.73 bitrate= 586.2kbits/s dup=138 drop=0frame=  719 fps= 65 q=-1.0 Lsize=     899kB time=00:00:11.93 bitrate= 617.4kbits/s dup=141 drop=0 speed=1.08x    
    video:890kB audio:0kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 1.041413%
    [libx264 @ 0x11d6050c0] frame I:3     Avg QP:17.90  size:169234
    ...
    [libx264 @ 0x11d6050c0] kb/s:608.02
        
        ------------------------------
        
        
        zsh exited with code 0.
        Execution time: 11374.89ms
    ```

## Example: Other programs

1. **Generate and demo the Y-combinator function**

    This conversationally generates the Y-combinator function, adds a demo, and
    executes using [TS Module](https://github.com/tsmodule/tsmodule) (similar to
    `ts-node`, but won't throw on account of type errors).

    ```
    ✔ What language is this program written in? … ts
    ✔ What will this program do? … define Y combinator function Y(f)
      
        1   var Y = function(f) {
        2     return (function(x) {
        3       return f(function(y) { return x(x)(y); });
        4     })(function(x) {
        5       return f(function(y) { return x(x)(y); });
        6     });
        7   };
      
      
    ✔ What would you like to do? › Edit
    ✔ How should this program should be changed? … add: demo Y(f) with console.log
      
      Edited.
      
      
          var Y = function(f) {
            return (function(x) {
              return f(function(y) { return x(x)(y); });
            })(function(x) {
              return f(function(y) { return x(x)(y); });
            });
          
        -  };
        +  };
        +  
        +  var factorial = Y(function(f) {
        +    return function(n) {
        +      return n <= 2 ? n : n * f(n - 1);
        +    };
        +  });
        +  
        +  console.log(factorial(5));
      
      
    ✔ What would you like to do? › Run
      
      ------------------------------
      Output
      ------------------------------
      

    $ tsmodule /var/folders/b0/rdq1ghc95sj4cm2qhvqmbrvh0000gn/T/0.brxmlniy2ln.ts


    $ node --no-warnings --loader file:///Users/lewis/.config/yarn/global/node_modules/@tsmodule/tsmodule/dist/loader/index.js /var/folders/b0/rdq1ghc95sj4cm2qhvqmbrvh0000gn/T/0.brxmlniy2ln.ts

    120
      
      ------------------------------
      
      
      tsmodule exited with code 0.
      Execution time: 197.37ms
    ```

2. **Convert programs between languages**

    This converts the Y combinator program above to Python.

    ```
    ✔ What would you like to do? › Edit
    ✔ How should this program should be changed? … refactor: convert to Python
  
    Edited.

  
    -  ...
    +  def Y(f):
    +      return (lambda x: f(lambda y: x(x)(y)))(lambda x: f(lambda y: x(x)(y)))
    +       
       
    -  ...
    +  def factorial(f):
    +      return lambda n: n if n <= 2 else n * f(n - 1)
    +       
       
    -  ...
    +  print(Y(factorial)(5))
    ```

## Known issues

  1. It is not possible yet to switch the language context for a translation,
      i.e. the CLI cannot know the above example to Python, and if you select
      **Run**, it will attempt to execute it as TS.
  
      This will be solved in future versions, but for now, use **Copy** or
      **Save** to get it out of the CLI and execute it manually.