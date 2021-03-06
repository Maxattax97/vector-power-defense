# vector-power-defense

Server and client code for the epic CS 252 tower defense project.

## Implemente

The idea for this game is a tower defense game where one person places spawning buildings and the other person places shooter buildings, like a multi-player tower defense game. We were able to implement the login system and game-syncing system, but not much of the game itself.

## Instructions

Video help: https://youtu.be/N0kckz1gJCk

 1. Create an account or login using Username: a, Password: a.
 2. Create another window and bring up the game in another window (the link should be https://maxocull.com:2701/game)
 3. At the bottom, the words "Game has started" should appear.
 4. Use the controls listed below to place towers.


Resources accumulate over time. With sufficient resources, you can:


Hold 1 and click: Build normal tower

Hold 2 and click: Build rapid shooting tower/ fast enemy spawner

Hold 3 and click: Build splash damage tower/ swarm enemy spawner

Hold 4 and click: Build high damage tower/ strong enemy spawner

Hold 5 and click: Build best tower/ strongest enemy spawner

Hold S and click: Sell tower clicked

Hold U and click: Upgrade tower clicked

Hold P and click: Promote spawner clicked to boss spawner


## Setup

### Required programs

* npm 5.5.1+
* node 8.6.0+
* mongodb 3.4.10+

```
npm install
```

install mongodb

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

oneline: `kill $(lsof -i | grep 3000 | awk '{print $2}')`

Error: Gulp crashes with an `ENOSPC` error.

Solution: [Increase OS's maximum file watchers](https://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc)

## Database

### Start

```
$ sudo systemctl start mongod
$ sudo systemctl status mongod
```

### Check accounts

```
$ mongo
> use vpd
> db.accounts.find().pretty()
```


## Websocket

Test websocket

```
ws = new WebSocket('wss://maxocull.com:2701/'); ws.onopen = console.log; ws;
```
