Welcome to Food Truck API!
===================

This API provide following functionalities:

 - Signin and Signup for the users.
 - Token based API authentication.
 - Logs of server activity.
 - Integration with Food truck data:[DataSF](http://www.datasf.org/): [Food Trucks](https://data.sfgov.org/Permitting/Mobile-Food-Facility-Permit/rqzj-sfat)
 - Store user password in mongoDB in encrypted form.
 - Expire user session after predefine time mention in config.
 - Food truck data only accessible to authorized user. 
 
----------

How to Deploy
----

You need to have Node, NPM(Node Package Manager) and MongoDb installed on your machine. If you don't have it the please run following commands:

**For Node and NPM**: Check this [link](https://docs.npmjs.com/getting-started/installing-node)

**For MongoDb**: Check this [link](https://docs.mongodb.com/manual/administration/install-community/)

--------------------
**Deploy in Production**:
```sh
$ npm install --only=production
$ NODE_ENV=production nodemon bin/www
```

--------------------
**Deploy in Development**:

```sh
$ npm install
$ NODE_ENV=development nodemon bin/www
```

API will be running on the port **3001** by default.

--------------------
**Adding Node Enviroment**:

1.  Creating an environment variable named NODE_ENV, and setting it to 'development'.
2.  export NODE_ENV=development
 OR
3.  run the node app with following command
    ```NODE_ENV=development nodemon bin/www```
OR
4.  add to environment variable(For linux users)
    >* login as super user
        ```
        $ sudo -i
        $ gedit /etc/bash.bashrc
        ```
    >* write at the end of file
        ```
        NODE_ENV=development
        ```
    >* save file and close it


-----------
We have used the jsdoc plugin of grunt for that you need to install [grunt](https://gruntjs.com/configuring-tasks) dev dependencies.

Just run the following command after installing grunt dependencies
```sh
$ grunt jsdoc
```

Please check the [postman collection](https://www.getpostman.com/collections/7652c23d0f8b7d8bd739) of API service.
