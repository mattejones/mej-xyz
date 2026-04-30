---
title: Some notes on how my website works
description: Documenting current and future website setup
date: Apr 04 2024
tags:
  - tech
---

This is how my website (mej.xyz) works and some planned improvements I want to make. 

### Git
My entire website is set up in a git repository. This provides me with the ability to make changes to the CMS that I am using (Astro), configuration of said CMS and also the content. My site is essentially a clone of the Astro Nano configuration. I use gitlab to store my website for free in a private repo. 

Basically, what I do is update the files and push them to my git repo. The actual workflow is described later on. 

Future improvements I want to explore: 
1. It's been a long time since I have developed from a Windows machine. I am currently using git shell for all git commands, but I feel this could be enhanced with setting up WebStorm, Obsidian and Visual Studio Code.
2. I want to improve my use of branches and better unlock the capabilities of Git
3. Explore splitting out the content and infrastructure of my website into different repositories. 

### Hosting
Currently I am hosting my website on Nonic Cloud, it was a fairly affordable VPS that is essentially my cloud facing server. This service has been very reliable. I use this sever for all sorts of other things that need to be exposed to the web. 

Future Improvements: 
1. I might switch this to a dedicated server just for my website if I keep the maintenance of this blog.
2. Add performance monitoring.
3. Set up some form of High Availability. (I know this is just a personal website, but the fun is in the process!)

### SSL
I am simply using lets encrypt for SSL right now. 

Future Improvements: 
1. Explore a more complex setup for education purposes. 

### Workflow
When I want to update my blog

I follow a pretty standard workflow on git, but I only work out of 1 branch right now (if I was to do some sort of major web redesign or something, I would use a special branch for that): 
1. `git pull` to get the latest copy of my blog, locally. 
2. ...produce content...
3. `git --add` 
4. `git commit -m "a description"`
5. `git push`

As for publication I have a deploy script that: 
1. `git pull` - Get the latest blog version
2. `npm run build` - Build the site and create static elements
3. scp the files to the webserver.

Future improvements: 
1. Have some testing in the process (for example a spellchecker, deadlinks checking)
2. Create a release process and automate deployments off a specific release branch. 

### Design
As you can see the site's design is pretty boilerplate at the moment and lacks inspiration. I like the clean and simple approach. 

Future Improvements: 
1. Implement a Rainbow mode colour scheme (in addition to light and dark). 
2. Add a couple of graphics to the homepage (a picture of myself)

### Function
There is not a great deal of function on this website, intentionally.

Future Improvements: 
1. Simple tracking of page views with a self-hosted (or even self-developed) tool, just to get an idea of site traffic. 
2. Implement tagging on the site.
3. Build a digital business card page. 



