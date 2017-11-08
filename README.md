# vector-power-defense
Server and client code for the epic CS 252 tower defense project.

# contribute

## setup

 * npm 5.5.1+
 * node 8.6.0+

```
npm install
```

## error

Error:

```
Error: listen EADDRINUSE :::3000
```

Solution:

```
$ sudo lsof -i | grep 3000
node       <pid> <user>   12u  IPv6 456384      0t0  TCP *:3000 (LISTEN)
$ kill <pid>
```
