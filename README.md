# JorgeValle.com

A simple CMS for blogging, running on Node.js.

 - About JorgeValle.com
 - Getting Started
 - License

## About JorgeValle.com

This repository holds the Node.js application that powers my personal site. It's built with [Mongoose](https://mongoosejs.com/), [Express](https://expressjs.com/) and [Pug](https://pugjs.org/api/getting-started.html).

Its made up of a front end that's currently designed with CSS grid, and a backend admin that's styled with Bootstrap.

It can be seen at [jorgevalle.com](https://jorgevalle.com)

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

## License

Copyright 2018 Jorge Valle

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.