# Graphe

A micro blogging platform created to run my website. Created on Express and Mongoose.

 - About Graphe
 - Getting Started
 - License

## About JorgeValle.com

This repository holds the Node.js application Graphe that manages the content for my personal site [Jorge Valle](https://jorgevalle.com). It's built with [Mongoose](https://mongoosejs.com/) and [Express](https://expressjs.com/).

The backend admin is styled with Bootstrap.

## Getting started

Getting the application running locally is a two step process. First, you must set an environment variable with the database connection string.

If you are on Windows, this can be done on the command line with the following.

```
set MONGOLAB_URI=YourMongoDatabaseConnectionString
```

For more information on the schema needed, check out the model files in the /api directory.

Then run the app locally by navigating to the root, and running the following from the command line.

```
node app.js
```

App can then be found in http://localhost:3000

## Security

[![Known Vulnerabilities](https://snyk.io/test/github/JorgeValle/jorge-valle/badge.svg)](https://snyk.io/test/github/JorgeValle/jorge-valle)

## License

Copyright 2018 - 2020 Jorge Valle

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
