---
title: Researching Old Switches
description: Because I can't afford a new one
date: Apr 21 2024
tags:
  - homelab
draft: true
---
## Requirements

Firstly let's squibble down the basic requirements: 

Needs:
1. Budget: Less than £120. 
2. The switch needs to be quiet
3. The switch needs serve 24-48 ports
4. The switch to be rackable

Wants: 
1. A management interface would be desirable, but nothing that requires an ongoing subscription. 
2. Some from of 10Gb channel would be interesting
3. A well known brand
4. No scratches

## Options Explored

D-Link DGS-1210-52

Dell Powerconnect series


NETGEAR ProSafe GS752TP
NETGEAR PROSAFE GS748T (£35) https://www.ebay.co.uk/itm/256418045537?mkcid=16&mkevt=1&mkrid=711-127632-2357-0&ssspo=YbM3cNQISre&sssrc=2047675&ssuid=&widget_ver=artemis&media=COPY


Zyxel GS1920-24v2 https://www.ebay.co.uk/itm/395253093771?mkcid=16&mkevt=1&mkrid=711-127632-2357-0&ssspo=qgsuzpSzRR2&sssrc=2047675&ssuid=&widget_ver=artemis&media=COPY really good option (125)



## Research notes

Apparently Dell switches don't need a subscription: https://www.dell.com/community/en/conversations/networking-general/licensing-for-network-switches/647f89a7f4ccf8a8de94d43b unless it is the n-series. 

https://www.dell.com/support/home/en-uk/product-support/product/powerconnect-7048 the dell power connect came out in 2012. 

https://www.dell.com/support/home/en-uk/product-support/product/powerconnect-6248/docs Dell power connect 6248 - came out 2011. 



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
