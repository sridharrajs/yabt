# MyReader
-------------------------------------------------
MyReader is an free open source alternative to read it later services like [Pocket](https://getpocket.com/) that gives you, control over your data. 

Why myReader   
* It is self hosted  
* It respects your *privacy* and never shows ads ever  
* It is simple, fast, and never reloads your page for anything

## Requirements
1. `NodeJS v4.4.5` or later
2. `Mongodb 2.4.10` or later

## Installation guide
1. Install the required dependencies    
```npm & bower install```
2. Build the client package  
```gulp install```
3. Update admin user email & password in `bin/install.js`  
```node bin/install.js```
4. Start the server  
```npm start```
 
## Developer Installation  
Running a local instances involves two phase.

1. **Building the client**  
The entire client side is written using ES6, we need to transcompile it to ES5 for the browsers that don't support ES6 yet.  
``` gulp stream```  
This will watch the `client/` folder for changes and will transpile them into `dist/` as it happens.

2. **Starting the API server**  
Start the stateless API server  
```npm start```


## License

MyReader is a free software released under [GPL V2](http://www.gnu.org/licenses/old-licenses/gpl-2.0.html)