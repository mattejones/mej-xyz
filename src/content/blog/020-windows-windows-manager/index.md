---
title: "Windows Window Manager"
description: "Notes on getting started with komorebi - a tiling window manager"
date: May 19 2026
tags: ["tech", "windows", "productivity"]

---

I'm experimenting with [komorebi](https://github.com/LGUG2Z/komorebi). It's a tiling window manager that makes it easier to work with larger screen real-estates. 

I've been using a tiling window manager for many years, but never on my Windows laptop. A tiling window manager allows you to have a pretty, defined layout where all your application windows are allowed to be. Windows 11 has some basic options, but being able to customise and implement keyboard shortcuts to move windows around automatically helps drive a productive experience. 

## My setup
I have two 4K monitors attached to my laptop, and don't use the laptop screen at all. My primary screen is directly in front of me in landscape (standard) arrangement. My second screen is in portrait orientation. I previously had both screens in landscape, but was finding the viewing experience too wide.


### Main screen

I've set up a 60% main panel window - this is where I keep the app I am actively working on centered. As I type this, it's Visual studio code. to the right, I have stacked windows. These windows are in rows. 2-3 is comfortable, 1 is normally when I am doing some type of work on a web component, or comparing results, etc. 

```
┌──────────────────────────┬──────────────┐
│                          │              │
│                          │   Window B   │
│                          │              │
│       Main Window        ├──────────────┤
│          (60%)           │              │
│                          │   Window C   │
│                          │              │
└──────────────────────────┴──────────────┘
           60%                   40%
```


### Info screen

My info screen is laid out in one column of applications in rows. On the bottom, I keep my terminal with tabs, which is comfortable, around the middle is "active" area of whatever I might be working on, and apps that find themselves up the top are normally not in use. I tend to keep a notepad open so I can dump and quickly edit text. 

```
┌──────────────────┐
│                  │
│   Less Active    │  ← e.g. Todoist
│                  │
├──────────────────┤
│                  │
│  Notes / Active  │  ← Sublime Text, current context
│                  │
├──────────────────┤
│                  │
│     Terminal     │  ← Windows Terminal (tabbed)
│                  │
└──────────────────┘
```

## Configuration

You need to set up this tool with JSON. There is no GUI editor. When you get the application, you also need to pull an applications.json which describes a lot of common applications and provides important information to the window manager about these apps. 

The basic premise of the main configuration file is all outlined in [komorebi configuration](https://lgug2z.github.io/komorebi/example-configurations.html).

I want to call out specific attention to the apps behaving badly section: 

>There is a [community-maintained repository](https://github.com/LGUG2Z/komorebi-application-specific-configuration) of "apps behaving badly" that do not conform to Windows application development guidelines and behave erratically when used with komorebi without additional configuration.

This is a special configuration file which you can pull the latest version. `komorebic fetch-asc` is the command. 

One application that wasn't listed in the ASC (applications.json) file was Claude Desktop. In order to have that handled correctly, I added this configuration to my komorebi.json file. This is because some electron apps seem to have problems being picked up by the tool. 

```
 "manage_rules": [
  { "id": "claude.exe", "kind": "Exe", "matching_strategy": "Equals" }
],
"slow_application_identifiers": [
  { "id": "claude.exe", "kind": "Exe", "matching_strategy": "Equals" }
]
```

## Productivity gains

Having a neat and tidy work surface means that you know where every tool is, and you aren't naturally opening more text editors, tabs or windows, only to later scroll through these later, looking for the right item. It also means that you gain keyboard control over window management (you can shift a window from one section of the screen to another, way beyond the typical `Win + left` / `Win + right`).

having a very quick way to land at an ergonomic workspace with sane layouts means less dead-space. At the time of writing, I can see my todo list, email, git client, cmd line, editor and site preview. This can rapidly be switched over as I move onto different tasks. 

I'm still experimenting with the tool, and seeing if I can get good value out of it, but over the last 48 hours, it's been pretty good and I would recommend everyone gives it a go! (One more thing to get my Windows laptop feeling a bit more like Linux.)
