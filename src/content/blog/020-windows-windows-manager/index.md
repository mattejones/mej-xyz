---
title: "Windows Window Manager"
description: "Notes on getting started with komorebi - a tiling window manager"
date: Feb 16 2026
tags: ["tech", "windows", "productivity"]

draft: True
---

I've been using a tiling window manager for many years, but never on my Windows laptop. A tiling window manager allows you to have a pretty, defined layout where all your application windows are allowed to be. Windows 11 has some basic options, but being able to customise and implement keyboard shortcuts to move windows around automatically helps drive a productive experience. 

## My setup
I have 2 4K monitors attached to my laptop, and don't use the laptop screen at all. My primay screen is directly infront of me in landscape (standard) arrangement. My second screen is in portrait orientation. I previously had my screens both in landscape, but I was finding the viewing experience too wide. 

### Main screen

I've set up a 60% main panel window - this is where I keep the app I am actively working on centered. As I type this, it's Visual studio code. to the right, I have stacked windows. These windows are in rows. 2-3 is comfortable, 1 is normally when I am doing some type of work on a web component, or comparing results, etc. 

### Info screen

My info screen is layed out in one column of applications in rows. On the bottom, I keep my terminal with tabs, which is comfortable, around the middle is "active" area of whatever I might be working on, and apps that find themselves up the top are normally not in use. I tend to keep a notepad open so I can dump and quickly edit text. 

## Configuration

You need to set up this tool with JSON. There is no GUI editor. When you get the application, you also need to pull an applications.json which describes a lot of comon applications and provides important information to the window manager about these apps. 

## Additional configurations

