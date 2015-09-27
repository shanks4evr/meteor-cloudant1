# Simple Todo List

The Meteor Tutorial "simple-todos" app, with one commit per tutorial step so that you can follow along. http://www.meteor.com/try .

Use it to share a single todo list with your friends. The list updates on everyone's screen in real time, and you can make tasks private if you don't want others to see them.


#### This repo shows you how use the app with CouchDB/Cloudant.

You can follow the original tutorial if you are a meteor newbie and then apply the [changes](https://github.com/mariobriggs/simple-todos/commit/5bb7764f1f4da9de3488f213ff950c776a7fd49f?diff=split) required for CouchDb/Cloudant 
```  
//Assuming you followed the tutorial completely and are in the tutorial app
// folder

// clone this repo in a folder outside of the tutorial folder
$ cd ..
$ git clone https://github.com/mariobriggs/simple-todos.git repo
$ cd simple-todos

// copy over the changes for couchdb
$ cp -rf ../repo/ .

// install couchdb meteor module
$ meteor add cloudant:couchdb

// point to your couchdb server
$ export COUCHDB_URL=https://username:password@server:port

// run the app
$ meteor run 

```  


OR  directly use the source of this repo.
``` 
// clone this repo
$ git clone https://github.com/mariobriggs/simple-todos.git 

// move into the app folder
$ cd simple-todos

// install couchdb meteor module
$ meteor add cloudant:couchdb

// point to your couchdb server
$ export COUCHDB_URL=https://username:password@server:port

// run the app 
$ meteor run 
``` 


![screenshot](screenshot.png)
