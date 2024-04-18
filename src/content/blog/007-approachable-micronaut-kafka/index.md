---
title: Approachable Micronauts Kafka Example
description: Writing a more approachable Kafka example
date: Apr 06 2024
tags:
  - tech
  - dev
draft: true
---
## Backstory - Not the tutorial
I am teaching myself the[ Micronaut Framework](https://micronaut.io/) at the moment. This is a full-stack framework for building microservices and serverless applications. I have a few little integrations I'd like to do in my homelab, plus I am fiddling around with Kubernetes and it just makes a nice fit. 

One thing I am quite fond of is messaging between applications. I think this was built into my toolkit since working with Sun Java CAPS (an old SOA platform). Kafka is the coolest kid in this neighborhood.  

So, I went about looking for some tutorials on this topic and realised that there wasn't a really barebones tutorial that is focused. The Micronaut's tutorials are OK, but I feel they are part sales-pitch, part convention (Books example) and less learner orientated. 

Therefore I have set about writing my very own, back to basics tutorial, that will hopefully allow you to get something up and running with Micronaut + Kafka. 
## Tutorial - Sending Messages with Kafka

### Overview
In this tutorial, you will learn how to create an application, using the micronaut framework that will send messages to a Kafka topic. To be successful with this tutorial, you will need to have set up micronauts, have a working kafka installation and have some knoweldge of Java (but an advanced knowledge would make this tutorial more accessible and valuable.) 







This is just a ramble.

I have been working on my homelab recently, which means more Kubernetes installs. In this process I discovered that google has deprecated their RPM packages. You can read about this [here](https://kubernetes.io/blog/2023/08/31/legacy-package-repository-deprecation/). 

What is interesting is I came across a load of sites that carry basic instructions on how to install Kubernetes (essentially just summarizing the documentation) that have not been updated to reflect this change, announced in August, 2023. 

So the new version looks like this:  
```
[kubernetes] 
name=Kubernetes 
baseurl=https://pkgs.k8s.io/core:/stable:/v1.29/rpm/
enabled=1 
gpgcheck=1 gpgkey=https://pkgs.k8s.io/core:/stable:/v1.29/rpm/repodata/repomd.xml.key 
```

I did some research to better understand the approach with the static version numbers. As you might have clocked, this will prevent an automatic update to K8s without making a manual change. [There is an article dedicated to this topic. ](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/change-package-repository/)

some important points are quoted: 

> Unlike the legacy package repositories, the community-owned package repositories are structured in a way that there's a dedicated package repository for each Kubernetes minor version.

and...

> **Note:** This step is only needed upon upgrading a cluster to another **minor** release. If you're upgrading to another patch release within the same minor release (e.g. v1.29.5 to v1.29.7), you don't need to follow this guide.

and...

> This document assumes that you're already using the community-owned package repositories (`pkgs.k8s.io`). If that's not the case, it's strongly recommended to migrate to the community-owned package repositories as described in the [official announcement](https://kubernetes.io/blog/2023/08/15/pkgs-k8s-io-introduction/).

This is a nice way to keep serious enterprise software on the right major versions while continuing to offer minor updates across the whole supported codebase. 

Perhaps some minor updates on third-party documentation is in order too! 
