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
1. Set the environment variables using [this guide](https://github.com/sridharrajs/ynbt/wiki/How-to-setup-environment-variables)
2. Install all the required dependencies  
	```npm  install```  
	```bower install```
3. Create an admin user, by editing the default email & password in `bin/install.js` and run  
    ```node bin/install.js```
4. Build the html-css-js client package for the browser consumption  
	```gulp install```
5. Start the server  
	```npm start```
	
If you're developer check [installation wiki](https://github.com/sridharrajs/ynbt/wiki/How-to-set-your-local-environment-for-development) for the details on how to set your local environment for development

## License

YNBT is a free software released under [GPL V2](http://www.gnu.org/licenses/old-licenses/gpl-2.0.html)