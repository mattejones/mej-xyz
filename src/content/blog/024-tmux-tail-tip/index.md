---
title: tmux tail tip
description: An easy script for tail with tmux
date: October 4 2026
tags:
  - Linux
  - Homelab
  - tmux
---

Every so often I print off a tmux cheat-sheet and stick it to my monitor. I'm a casual tmux user. Normally when I have a specific need, realise the power and then continue to use it. 

One use-case for tmux that I leverage is having something run in the corner of my screen without a new terminal. For instance, seeing application traffic or a docker build completing.

Here's a simple command I found myself cludging together (really, compiling from scrolling through my command history until I got a near enough command I could modify):

```
tmux split-window -v -l 30% "ssh -t -i ~/.ssh/k8s_homelab mattjones@data.srv.home.wheeliecheesy.com 'tail -F /data/dss/run/build-base-image.log'"`
```

That's nearly as long as an old-school twitter post. Yikes. Time to clean this up a little. 

To be fair everything was useful: 
- `tmux split-window -v -l 30%` - opens a new pane underneath, at 30% of the height.
- `ssh -t` gives the remote command a proper terminal, so Ctrl+C actually stops it.
- `-i ~/.ssh/k8s_homelab` picks the right key, because... (I'll get to this later)
- `mattjones@data.srv.home.wheeliecheesy.com` is me, on a machine whose name I chose and now regret the length of.
- `tail -F` follows the file, even if it gets replaced.

## step one of two
So, first was to actually fix my SSH a little so I don't have to mention keys and fqdn's in `~/.ssh/config`. This isn't really the focus of the article. That was on me, I was just recycling my command history up until this point. 

```
# --- homelab ---
Host data k8s-01 k8s-02 k8s-03 edge filer dns01 dns02
    HostName %h.srv.home.wheeliecheesy.com

Host *.srv.home.wheeliecheesy.com data k8s-01 k8s-02 k8s-03 edge filer dns01 dns02
    User mattjones
    IdentityFile ~/.ssh/k8s_homelab
    IdentitiesOnly yes
```
now ssh data just works. wonderful. 


## step two of two

with ssh finally setup in a reasonable way. I then added a simple shell function in `~/.bashrc`


```
tmuxtail() {
  local host file pane
  case $# in
    1) file=$1 ;;
    2) host=$1; file=$2 ;;
    *) echo "usage: tmuxtail [host] file" >&2; return 2 ;;
  esac
  [ -n "$TMUX" ] || { echo "tmuxtail: not inside tmux" >&2; return 1; }
  if [ -n "$host" ]; then
    pane=$(tmux split-window -v -l 30% -P -F '#{pane_id}' ssh -t "$host" "tail -F $(printf %q "$file")")
  else
    pane=$(tmux split-window -v -l 30% -c "$PWD" -P -F '#{pane_id}' tail -F "$file")
  fi
  tmux set-option -p -t "$pane" remain-on-exit failed
}
```

this resulted in my earlier tweet lenth command becoming this: 

```
tmuxtail data /data/dss/run/build-base-image.log
```

and it can be recycled for other log watching on other machines as well as local log observations, which I think is pretty dandy. 
