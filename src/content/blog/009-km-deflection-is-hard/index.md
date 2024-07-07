---
title: Knowledge Article Deflection is suspect
description: Exploring the suspect KM Deflection metric
date: Apr 15 2024
tags:
  - support
draft: true
---
## Introduction - Knowledge Article Deflection

In the world of customer support, there is a concept of creating Knowledge Articles, publishing these articles and hoping that customers will read these instead of contacting your support department. The more customers who can read the articles by themselves, the less the customers will come to your support team looking for help. This certainly isn't the only reason to create and curate a knowledge base, but it is very much a selling point on the profitability agenda of most organisations. 

What's interesting is that many businesses really struggle to measure knowledge article deflection. I've come across many incomplete or honky-tonk inventions such as "implicit" and "explicit" deflection, customer and non-customer deflection, intentional and unintentional deflection and many statistical inventions by people meaning well, but their measurements fall apart when we explore the edge cases.

While I think the idea is good and the reasoning has the right mentality to it, we have be mindful of how this metric falls down and potentially all that is reported might not be believe(able).

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

### Implicit and Explicit Deflection
Some teams like to break down the deflection ratios into implicit and explicit deflection, whereby explicit deflection is where a customer didn't create a ticket because a knowledge article was shown to them. Implicit deflection is counting just the times an article was viewed, for brevity, I will focus on explicit deflection concerns here. 

- How sure are you that the customer didn't give up? What's your cooling-off period for a ticket? 
- What if the customer simply didn't know of any other way to access knowledge articles? Is your UX just very bad and that's why they are finding articles at the last moment?
- Did the article link really solve their problem. It's not unusual for technical problems to disappear when other steps are performed in the course of troubleshooting. 

### Customer and non-Customer Deflection

**Customer Deflection** refers to instances where an existing customer finds a solution to their issue through self-service options such as knowledge articles, FAQs, or automated assistants, thereby avoiding the need to create a support ticket. This can be explicitly measured when a customer accesses a solution and subsequently does not create a ticket within a defined cooling-off period.

**Non-Customer Deflection**, on the other hand, involves users who are not yet customers or were not authenticated, such as potential leads or general site visitors, finding the answers to their queries without needing to contact support. These users might be researching a product before purchase, looking for general information, or evaluating if the product meets their needs. They could even just be looking at your materials because the content answers a relevant question they have with a different technology or even your competitors products. 

## The solution

Of course, you could work your way thought the process of gold-plating your metrics and having the world's most complex dashboard on "deflection". You might get somewhere with it, but largely I don't see these things holding water to their claims of showcasing ROI. 

My current preference is to instead look at an engagement metric as a denominator, and use a customer contact rate as a nominator for a good ratio. 

For example: CONTACT RATE / ENGAGEMENT RATE.

An Engagement rate could be: 
- The number of searches on your site
- The number of authenticated article views
- The number of clicks on articles
- The number of thumbs up's on articles. 

What this achieves is a tracking against contact rate (what % of your customers are reaching out to customer support) vs. the number that engaged in your self service offering. If your contact rate is up, but your engagement is also up (or more up) maybe that's a sign that there is simply more activity in your product or service offering. However, if your contact rate goes down, but engagement rate tracks up, you can see that customers are in a sense being serviced by your self-service offering. 

