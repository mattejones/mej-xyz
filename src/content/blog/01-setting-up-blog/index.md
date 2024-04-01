---
title: "Setting up my blog"
description: "some notes on setting up my blog"
date: "Apr 01 2024"
draft: true
---

Today, I am setting up my blog and personal website. I have aimed for something quite simple to manage but 
also technically interesting to work on, allowing me to continue to get experience in some areas. 

### Basic Tech details
The basic requirements I had for the site.
1. **Markdown Support**, so I can contribute to my blog in a wide range of locations and using pretty standard tools. 
2. **Self-Hostable**, I want to be able to self-host this site so I can be in charge and make technical decisions. 
3. **Simple design**, The design needs to be simple, so I can update it from time to time and refine it.

What I have settled on: 
1. My site is stored in a private gitlab repo. The basis of my site is the [Astro Nano](https://github.com/markhorn-dev/astro-nano) theme, which I added as an upstream remote repository. 
2. I have a staging environment for my site that is running on my local homelab. 
3. I am working to script the deployment of the "dist" directory with npm to push static content up to my web server. 
4. My web server runs nginx, which is a cloud VPS service at the moment. 

### Some problems encountered so far

I might write about these challenges in the future, but so far my biggest hurdle was fixing the versioning of npm and my OS. Without this
I was facing an error, so I had to make some changes. 

Working across a few different operating systems and platforms is a great exercise. I am using Windows for my desktop PC and my web server is OpenSuse. 
