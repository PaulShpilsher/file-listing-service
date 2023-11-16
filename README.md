# file-listing-service

Node.js REST API Service for listing files from local file system.

This service can handle directories containg huge number of files with a small memory footprint.

Disclamer: Here I wanted to try something new for me - instead of express.js or koa.js I decided to give fastify a try.  So, for now there is no configuration, middleware, cors, or whatever.. just a simple /listing endpoint listening on port 3000.

Note: important to remember the service accesses the file system under the credentials (i.e. access rights) of the current user.  So, if there are issues with not having access rights to read the file system - run the server under the user with proper (or elevated) privileges.


## Approach

In a nutshell instead of reading all of the contents of a directory with ```fs.readdir``` we open directory with ```fs.opendir``` and then enumerate directory conents with async iterator.

Secondly, the client gets the contents of the directory in blocks (or pages).  This is very typical pattern when reading large amount of data.  The client, along the path to scan, controls paging with ```offset``` and ```limit``` query parameters.  


## API 

```
GET: /listing?path={local file path}&limit={limit number of files to be returned}&offset={number of entries to skip}
```


## Usage

First install and run the server by executing the following commands: 

```sh
git clone git@github.com:PaulShpilsher/file-listing-service.git
cd file-listing-service
npm ci
npm run start
```

To exercise the service, in another terminal window run:

```sh
curl 'http://localhost:3000/listing?path=/somedir&limit=100&offset=0'
```
Note: replace ```/somedir``` with whatever directory you want to scan.


----------------------------------------------------------------

Thats all folks.


P.S. There is a lot of possible TODOs.  Please feel free to send me comments on what can be done better or whatever comes to mind.

