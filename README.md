# YNBT
-------------------------------------------------
Ynbt(Yet another bookmarking tool) is an free open source alternative to read it later services like [Pocket](https://getpocket.com/)

**Why**      
* It is a *free*, *open source* and *self hosted* app. It gives you complete control over your data.     
* Read what you want, without compromising on your *[privacy](./PRIVACY.md)*  
* No Ads ever. Read what you've saved. No pestering of sponsored content, Best Of, Recommended.      

## Requirements
1. `NodeJS v4.4.5`
2. `Mongodb 2.4.10`

## Installation guide
1. Install all the required dependencies  
	```npm  install```
	```bower install```
2. Create an admin user, by editing the default email & password in `bin/install.js` and run  
    ```node bin/install.js```
3. Build the html-css-js client package for the browser consumption  
	```gulp install```
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
```npm run dev```


## License

ynbt is a free software released under [GPL V2](http://www.gnu.org/licenses/old-licenses/gpl-2.0.html)