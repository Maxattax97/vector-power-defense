# vector-power-defense

Server and client code for the epic CS 252 tower defense project.

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
