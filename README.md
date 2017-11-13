# vector-power-defense

Server and client code for the epic CS 252 tower defense project.

---

## Overview

* 4 Defenders
* 1 Attacker
* Arranged in square

### Buildings

* Power Node
* Basic Tower
* Fast Tower
* Splash Tower
* Tank Tower
* Ultimate Tower
* Upgrades within tower's respective stats

### Units

* Basic
* Fast
* Swarm
* Massive (health)
* Fat (health + damage)
* Boss (slow spawn rate)
* Upgrades within unit's respective stats, increases investment

### Defender

* Power node, invest by upgrading

### Attacker

* Split attacker building space into quadrants,
    send units to quadrant's respective lane
* Pause button
* Building spawners is an investment
* Global timer, staggered release for buildings

### Game ends when

* Attacker kills all Defenders _OR_
* Defenders pool money to orbital blast Attacker

### Architecture

* Client:
    * Handle interrupts
    * Game update
    * Render
* Server:
    * Handle interrupts
    * Game update

### Low Priority Goals

* Prioritization of attack by spawners
* Repairing buildings
* Sources:
    * Power - Corners, edges
    * Ether - Center, lanes
* Random unit bonuses for quadrants (incentive)

---

## Setup

### Required programs

* npm 5.5.1+
* node 8.6.0+

```
npm install
```

## Options

```
export PORT=3000
```

## Common Errors

Error

```
Error: listen EADDRINUSE :::3000
```

Solution

```
$ sudo lsof -i | grep 3000
node       <pid> <user>   12u  IPv6 456384      0t0  TCP *:3000 (LISTEN)
$ kill <pid>
```
