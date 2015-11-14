# Nodevember 2015 Schedule Grid

I wanted to view the [Nodevember schedule](http://nodevember.org/schedule.html) in a grid format in order to more easily choose between concurrent sessions, so I made this.

## Setup

Retrieve and parse the schedule by scraping the `app.js` file from the Nodevember website:

```sh
node retrieve.js
```

Install bower dependencies:

```sh
bower install
```

Open `www/index.html` in your browser (either locally or through a web server). No server-side code required.

## Demo

http://jasontan.org/nodevember/
