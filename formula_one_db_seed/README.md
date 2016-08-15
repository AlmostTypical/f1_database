## Formula one DB seed

#### Seeding your database:

Install dependencies
```
$ npm install
```

Run a local mongo db instance on port 27017
```
$ mongod
```

Run the seed file with node
```
$ node db_seeds.js
```

The process can take up to a couple of minutes to complete as there is a lot of data.
Once the process is complete you will see the log line 'Database Seeded' and the process will exit
