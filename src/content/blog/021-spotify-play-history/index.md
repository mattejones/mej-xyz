---
title: "Spotify Play History"
description: "Overcoming the 50 song limit on Spotify play history"
date: May 21 2026
tags: ["tech", "java", "spotify", "micronaut"]

---


Have you ever wanted to see more of your spotify play history? No? Well, unlike you, I like knowing what I am actually listening to more than once a year. 

In order to do workaround the limit that Spotify needlessly imposes on me (come-on, I am sure they are recording all this data....) I have created a small server application that runs on a VPC I have living in the cloud. 

The service basically gets an auth token, and pings spotify's API every 5 minutes, and then dumps any recent history into an SQLite database for later analysis. I chose to use Micronaut for this solution because it provides scheduled tasks, a great interface for building APIs, a great way to build out the DAOs. It's basically Spring's less ugly cousin. I find it way easier to work with once dependencies are ironed out. 

This code has been living locally forever and I have decided to clean it up (it still has some unused PKCE bits and bobs that I bailed on). I also added some slight reliability improvements. 

I switched the service off on my vpc about a year ago and never turned it back on (not sure whY!!)

Here's a report from a year a go, I just cut a random number of songs and totally didn't stop when I hit something super cringe. (no judgement!)


| Track | Artists | Album | Duration (ms) | Plays |
|---|---|---|---|---|
| Celestial Spaghetti Machine | Camel Power Club, Just Jack | Can I Tell You a Secret | 257142 | 14 |
| Back On 74 | Jungle | Volcano | 209482 | 10 |
| Walking On A Dream | Empire Of The Sun | Walking On A Dream (10th Anniversary Edition) | 198440 | 10 |
| Wake Me Up | Avicii | True | 247426 | 10 |
| Fisher | Camel Power Club | Sputnik II | 324546 | 10 |
| Wicked Games (feat. Anna Naklab) - Radio Edit | Anna Naklab, Parra for Cuva | Wicked Games (feat. Anna Naklab) [Radio Edit] | 195210 | 9 |
| Feel It Still | Portugal. The Man | Woodstock | 163253 | 9 |
| She Moves In Her Own Way | The Kooks | Inside In / Inside Out | 169306 | 9 |
| Valerie (feat. Amy Winehouse) - Version Revisited | Amy Winehouse, Mark Ronson | Version | 219413 | 9 |
| Inner Smile | Texas | The Greatest Hits | 230640 | 9 |
| Everywhere - 2017 Remaster | Fleetwood Mac | Tango In the Night (Deluxe Edition) | 226653 | 9 |
| Have A Nice Day | Stereophonics | Just Enough Education To Perform | 205066 | 9 |
| Higher Love | Kygo, Whitney Houston | Golden Hour | 228267 | 8 |
| feelslikeimfallinginlove - Zerb x Coldplay | Coldplay, Zerb | feelslikeimfallinginlove (Zerb x Coldplay) | 236612 | 8 |
| Stumblin' In | CYRIL | Stumblin' In | 213363 | 8 |
| You've Got The Love | Florence + The Machine | Lungs (Deluxe Version) | 168666 | 8 |
| Ho Hey | The Lumineers | The Lumineers | 163133 | 8 |
| Teardrops | NEIL FRANCES | Teardrops | 198331 | 8 |
| Lovely Day | Bill Withers | Menagerie | 254560 | 8 |
| I Wanna Dance with Somebody (Who Loves Me) | Whitney Houston | Whitney | 291293 | 8 |
| Because You Move Me | Helsloot, Tinlicker | Because You Move Me | 196375 | 8 |
| Midas | Holly Walker, Maribou State | Portraits | 218357 | 8 |
| Stuck In The Middle With You | Stealers Wheel | Stealers Wheel | 208946 | 7 |
| More Than A Woman - SG's Paradise Edit | Bee Gees, SG Lewis | More Than A Woman (SG's Paradise Edit) | 357936 | 7 |
| You Make My Dreams (Come True) | Daryl Hall & John Oates | Voices | 190626 | 7 |
| Don't Know Why | Norah Jones | Come Away With Me (Super Deluxe Edition) | 186251 | 7 |
| Catch & Release - Deepend Remix | Deepend, Matt Simons | When The Lights Go Down | 195173 | 7 |
| New Slang - 2021 Remaster | The Shins | Oh, Inverted World (20th Anniversary Remaster) | 230866 | 7 |
| Beautiful Day | U2 | All That You Can't Leave Behind | 248400 | 7 |
| Black Friday (pretty like the sun) | Lost Frequencies, Tom Odell | Black Friday (pretty like the sun) | 145599 | 7 |
| Candle Flame | Erick the Architect, Jungle | Volcano | 174020 | 7 |
| Back To You | Elley Duhé, Lost Frequencies, X Ambassadors | All Stand Together | 156546 | 7 |
| Carry You Home | Alex Warren | You'll Be Alright, Kid (Chapter 1) | 166880 | 7 |
| Looking For the Answer | Camel Power Club | Can I Tell You a Secret | 302939 | 7 |
| Shalalala Etc. | Camel Power Club | Can I Tell You a Secret | 197609 | 7 |
| All I Do Is Dreaming | Camel Power Club | Can I Tell You a Secret | 273842 | 7 |
| Slow It Down | Benson Boone | Fireworks & Rollerblades | 161831 | 6 |
| Teardrop | Elizabeth Fraser, Massive Attack | Mezzanine | 330773 | 6 |
| Keeping Your Head Up | Birdy | Beautiful Lies (Deluxe) | 208395 | 6 |
| Dancing in the Moonlight | Toploader | Onka's Big Moka | 232693 | 6 |
| Natural Blues | Moby | Play | 253773 | 6 |



Here's some log entries from the application to give you a sense of how it works: 

```
PS C:\Users\narki\src\spotify-playhistory-tool> java -jar .\target\spotify-playhistory-tool-0.1.jar
 __  __ _                                  _
|  \/  (_) ___ _ __ ___  _ __   __ _ _   _| |_
| |\/| | |/ __| '__/ _ \| '_ \ / _` | | | | __|
| |  | | | (__| | | (_) | | | | (_| | |_| | |_
|_|  |_|_|\___|_|  \___/|_| |_|\__,_|\__,_|\__|
12:49:18.712 [main] INFO  x.mej.apps.service.DatabaseService - Schema initialized
12:49:18.722 [main] INFO  x.mej.apps.service.DatabaseService - Initialized processing state for play_history with timestamp 2026-05-20T11:49:18.714310200Z
12:49:18.741 [main] INFO  x.m.a.r.SQLiteTokenRepository - Token table initialized successfully
12:49:19.051 [scheduled-executor-thread-1] INFO  xyz.mej.apps.job.CollectHistoryJob - Starting Spotify Play History Collection
12:49:19.058 [scheduled-executor-thread-1] WARN  x.m.apps.service.PlayHistoryTracker - System is 769min behind real-time - activating catchup mode
12:49:19.059 [scheduled-executor-thread-1] INFO  xyz.mej.apps.job.CollectHistoryJob - CATCHUP MODE ACTIVATED: fetching tracks since 2026-05-20T22:44:54Z
12:49:19.062 [scheduled-executor-thread-1] INFO  x.m.apps.service.SpotifyAuthService - Persisted token is expired, refreshing with stored refresh token
12:49:19.483 [scheduled-executor-thread-1] INFO  x.m.apps.service.SpotifyAuthService - Token refreshed and persisted, expires 2026-05-21T13:49:19.478125800
12:49:19.488 [scheduled-executor-thread-1] INFO  x.m.apps.service.PlayHistoryService - Fetching play history after: 2026-05-20T22:44:54Z
12:49:20.157 [scheduled-executor-thread-1] INFO  x.m.apps.service.PlayHistoryService - Retrieved 50 tracks from Spotify API
12:49:20.157 [scheduled-executor-thread-1] INFO  xyz.mej.apps.job.CollectHistoryJob - Fetched 50 tracks from Spotify API (duplicates will be skipped)
12:49:20.203 [scheduled-executor-thread-1] INFO  x.mej.apps.service.DatabaseService - Processed 20 new play history items out of 20 in batch
12:49:20.204 [scheduled-executor-thread-1] INFO  x.m.a.service.PlayHistoryProcessor - Successfully processed batch of 20 records
12:49:20.232 [scheduled-executor-thread-1] INFO  x.mej.apps.service.DatabaseService - Processed 20 new play history items out of 20 in batch
12:49:20.233 [scheduled-executor-thread-1] INFO  x.m.a.service.PlayHistoryProcessor - Successfully processed batch of 20 records
12:49:20.250 [scheduled-executor-thread-1] INFO  x.mej.apps.service.DatabaseService - Processed 10 new play history items out of 10 in batch
12:49:20.251 [scheduled-executor-thread-1] INFO  x.m.a.service.PlayHistoryProcessor - Successfully processed batch of 10 records
12:49:20.255 [scheduled-executor-thread-1] INFO  x.m.apps.service.PlayHistoryTracker - Updated last processed timestamp to: 2026-05-21T11:48:07Z (processed 50 items)
12:49:20.255 [scheduled-executor-thread-1] INFO  xyz.mej.apps.job.CollectHistoryJob - Catchup complete: returning to normal operation mode
12:54:20.258 [scheduled-executor-thread-1] INFO  xyz.mej.apps.job.CollectHistoryJob - Starting Spotify Play History Collection
12:54:20.259 [scheduled-executor-thread-1] INFO  xyz.mej.apps.job.CollectHistoryJob - Normal collection: fetching tracks since 2026-05-21T11:33:07Z (includes overlap window)

```

As you can see - it has a catch-up mechanic in-case it falls over and just fetches recently played music. 

If you are interested in this sort of thing, please check out the project link. If you have any ideas on how to make it better, I am all ears. My contact details are on this site or raise a PR!

