---
title: "Astro wouldn't start"
description: "When running Astro on Linux, I couldn't get it to start. Here is how I fixed that"
date: "Apr 02 2024"
---

### Issue

When trying to get Astro to run with the command `npm dev build` I ran into an error like this on my linux machine. 

```text
0 info it worked if it ends with ok
1 verbose cli [ '/usr/bin/node',
1 verbose cli   '/usr/bin/npm',
1 verbose cli   'run',
1 verbose cli   'build',
1 verbose cli   '--loglevel',
1 verbose cli   'silly' ]
2 info using npm@6.14.11
3 info using node@v10.24.0
4 verbose run-script [ 'prebuild', 'build', 'postbuild' ]
5 info lifecycle astro-nano@1.0.0~prebuild: astro-nano@1.0.0
6 info lifecycle astro-nano@1.0.0~build: astro-nano@1.0.0
7 verbose lifecycle astro-nano@1.0.0~build: unsafe-perm in lifecycle true
8 verbose lifecycle astro-nano@1.0.0~build: PATH: /usr/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/home/removed/removed/astro-nano/node_modules/.bin:/home/mattjones/.local/bin:/home/mattjones/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin
9 verbose lifecycle astro-nano@1.0.0~build: CWD: /home/removed/removed/astro-nano
10 silly lifecycle astro-nano@1.0.0~build: Args: [ '-c', 'astro check && astro build' ]
11 silly lifecycle astro-nano@1.0.0~build: Returned: code: 1  signal: null
12 info lifecycle astro-nano@1.0.0~build: Failed to exec build script
13 verbose stack Error: astro-nano@1.0.0 build: `astro check && astro build`
13 verbose stack Exit status 1
13 verbose stack     at EventEmitter.<anonymous> (/usr/lib/node_modules/npm/node_modules/npm-lifecycle/index.js:332:16)
13 verbose stack     at EventEmitter.emit (events.js:198:13)
13 verbose stack     at ChildProcess.<anonymous> (/usr/lib/node_modules/npm/node_modules/npm-lifecycle/lib/spawn.js:55:14)
13 verbose stack     at ChildProcess.emit (events.js:198:13)
13 verbose stack     at maybeClose (internal/child_process.js:982:16)
13 verbose stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:259:5)
14 verbose pkgid astro-nano@1.0.0
15 verbose cwd /home/removed/removed/astro-nano
16 verbose Linux 4.18.0-372.9.1.el8.x86_64
17 verbose argv "/usr/bin/node" "/usr/bin/npm" "run" "build" "--loglevel" "silly"
18 verbose node v10.24.0
19 verbose npm  v6.14.11
20 error code ELIFECYCLE
21 error errno 1
22 error astro-nano@1.0.0 build: `astro check && astro build`
22 error Exit status 1
23 error Failed at the astro-nano@1.0.0 build script.
23 error This is probably not a problem with npm. There is likely additional logging output above.
24 verbose exit [ 1, true ]
```

### Investigation

1. I tried adding verbose logging and silly logging, but I didn't get any more searchable clues. 
2. I then turned my attention to playing around with versions based on this [StackOverflow post](https://stackoverflow.com/questions/49446277/failed-to-exec-start-script-eventemitter-anonymous-usr-local-lib-node-modu)
3. The steps posted were not very helpful for my environment, other than the normal clues to work from a clean set of modules. 

### Solution

In order to solve this, I removed my npm and node installed versions that shipped with Rocky Linux, and installed version 18 like this: 

Check what nodejs versions were available: 
```shell
dnf module list nodejs
```

Removed my old node install 
```shell
sudo yum remove nodejs
```

Reset nodejs module
```shell
sudo dnf module reset nodejs
```

Installed a new nodejs:18
```shell
sudo dnf module install nodejs:18
```

After this, things built correctly! Hurrah! 

### Final comments
I probably want to look into node version managers. I am aware of others for Maven and Java which are pretty handy at times.
