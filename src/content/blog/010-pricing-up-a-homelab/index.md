---
title: Pricing up a more serious homelab
description: Just some notes and ideas on a homelab
date: Apr 20 2024
tags:
  - tech
draft: true
---
## 

Currently, my homelab consists of just one single Z440 HP Workstation. It's carrying 64GB of ram, and 2 paltry 240GB SSDs. This is augmented with my cloud servers which I pay a monthly fee for. 

My Z440, consumes about 60-70 watts and runs at fairly low resource utilizations most of the time. (There is only so much homelabbing a Dad with a full time job and a wide range of interests can do).

Using the current 24.50 pence per KWh, this is costing me about £14.00 per month or £167.71 per year. For a similar spec'ed cloud based device on Hetzner's Server Auctions is about £32.00 per month (or £384 per year). This works out to be a £217 difference. 

The Z440 cost me about £650. I bought it during Covid when entertainment options were limited, and my bank balance was benefiting from the lack of things myself or my family could actually do. It's been about 4 years, and it's still ticking along. So we are in the break even zone, and I have hardware I could sell on eBay should I choose to do so. (I could take into account my office is warmer with the device, so I use less central heating as well).

I'm about to have a bit more space owing to a home renovation I have been working on, and it occurred to me, that I could possibly use some of this house for a larger space heater.


Requirements

Networking
Since I am renovating, it makes sense to set up a an ethernet network. Todayy I use Linksys Velops, which does an OK job in my 3-story Victorian semi with a mix of single and double bricked internal walls, but sometimes experiences brief lags. I get 120Mbps - 160Mbps over wifi. 

My plan is to deploy a 1GB home wired network for now as most of my home devices do not support a faster connection than this. Regardless I will use Cat6a or Cat7 for the cabling so that I can move to a 10GB connection in the future. 

For this effort, I think it would just be sensible to go with a 48 port switch. This will mean that I can scatter wired connections throughout the house slowly, and keep them patched directly to the switch, making it easier for my family to use the network without manually patching things in.

Rack Costs
- Rack: £300
- Power distribution: £100
- UPS: £600 (1U)
- Racking for Z440's: £100 
- Shelving: £200
- Rack Airflow: £200 fans 
- KVM Draw (1U): I'll probably just get a draw and chuck a crap laptop in it.
Total: £1,800 


Networking 
- Cable: £200-£300 (I'll probably start with networking the main workspaces + media spaces and continue to network more spaces as part of renovations)
- Faceplates and backboxes: £100 or so to start with. 
- Patch panel: 2X 24 1U Patch panels: £100
- 48-port switch: £300 (this is for a new basic L2 netgear one, I may buy a refurbed switch instead)
- Odds and ends: £200
- Labour: Free (I will do this myself unless my electrician is already droping cable or something.)

Estimated Total Networking: £850 


Computing
- Additional z440: I like the format and they are getting cheap now. (£500)
- 2U Server (Storage): I'd love to also get a proper 2U server, with the explicit purpose of Storage. (£650)
- 2U Server (Networking): I would also love to have an appliance dedicated to networking functions (Firewall, DNS, Load balancing)


Now let's think about the order of things in terms of priority: 


Round 1 (Things that don't need a rack to be successful)
- Z440
- Switch
- SFF PC with network cards to replace router

Round 2 (Rack Day):
- Rack
- Z440 Shelving
- Patch Panel

Round 3 (UPS):
- UPS
- PDU
- Fans

Round 4 (Real Server Day):
- 2U Server!
- Patch Panel

Round 5 (Rack improvements):
- Shelving
- Fans

Round 6 (Pi)


Round 1: 
- Rack (£300) 
- Switch (£100) (Secondhand)
- Z440 Shelving (£100)
- 1 Patch Panel
Cost: £750 

Round 2: 
- Additional Patch Panel (£50)
- UPS (£600)
- Shelf
Cost: £750


Round 3: 
- 2U Server
- 

Rack Space: 
1U Switch
2U UPS
2U Patch
2U Shelf
4U z440 - utilities
4U z440 - utilities
2U Server - Storage
2U server - Networking
2U KVM Draw
1U 10gb Switch
2U Junk shelf.






Of course, my Z440 had a hardware outlay 



## The culprits 

### Basic Deflection
The very oblivious happy measure I have seen is a time series ratio that looks like this: 
total number of article views that didn't result in a ticket created in period / number of tickets created in a period.

So you probably have some ideas on how this can go wrong, but lets explore it. 
- Your product is unlikely to live in a bubble and their are probably knowledge articles that are useful to people who are not your customer. 
- Can all users who access knowledge articles create tickets or requests to the support team
- Are you accurately measuring the number of article views that were provided by a support person after a ticket was created? What if the ticket was forwarded to another person, how are you measuring this effect?
- Do customers always have the intent to create a support ticket, or were they only looking for a knowledge article in the first place?
- How sure are you that your UI support flows make sense to your customers? Are they leveraging the ticket reporting mechinism to find the information they are looking for?

### Implict and Explicit Deflection
Some teams like to break down the deflection ratios into impicit and explict deflection, whereby explicit deflection is where a customer didn't create a ticket because a knowledge article was shown to them. Impicit deflection is counting just the times an article was viewed, for beverety, I will focus on explicit deflection concerns here. 

- How sure are you that the customer didn't give up? What's your cooling-off period for a ticket? 
- What if the customer simply didn't know of any other way to access knowledge articles? Is your UX just very bad and that's why they are finding articles at the last moment?
- Did the article link really solve their problem. It's not unusual for technical problems to disappear when other steps are performed in the course of troubleshooting. 

### Customer and non-Customer Deflection





## The solutions

Of course, you could work your way thought the process of gold-plating your metrics and having the world's mo
