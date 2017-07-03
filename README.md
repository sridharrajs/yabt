# YABT
-------------------------------------------------
YABT(Yet another bookmarking tool) is a free, minimalistic, open sourced bookmarking app. Unlike [Pocket](https://getpocket.com/), It won't store page's content.

**Why**      
* It is a *free*, *open source* and *self hosted* app. It gives you complete control over your data.     
* Read what you want, without compromising on your *[privacy](./PRIVACY.md)*  
* No Ads ever. Read what you've saved. No pestering of sponsored content, Best Of, Recommended.      

## Requirements
1. `NodeJS v4.4.5`
2. `Mongodb 2.4.10`

## Installation guide
1. Set the environment variables using [this guide](https://github.com/sridharrajs/yabt/wiki/How-to-setup-environment-variables)
2. Install all the required dependencies  
	```npm  install```  
	```bower install```
3. Create an admin user, by editing the default email & password in `bin/install.js` and run  
    ```node bin/install.js```
    Once it runs, you will see `Admin created` in green text  
    
    ![success message](https://github.com/sridharrajs/yabt/blob/master/imgs/installation-complete.png)
4. Build the html-css-js client package for the browser consumption  
	```gulp install```
5. Start the server  
	```npm start```
	
If you're a developer, check the [installation wiki](https://github.com/sridharrajs/yabt/wiki/How-to-set-your-local-environment-for-development) for the details on how to set your local environment for the development.
	
If you want to try the stable branch, head over to [tags](https://github.com/sridharrajs/yabt/tags)  

## Clients

There are few clients build for adding links to the application.

* An alpha version of iPhone app is available at [yabt-iphone-app](https://github.com/sridharrajs/yabt-iphone-app) repo. 
* An alpha version of Firefox add on is avaiable at [yabt-firefox-ext](https://github.com/sridharrajs/yabt-firefox-ext) repo.

Contributions are welcome.
	
## License

YABT is a free software released under [GPL V2](http://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
