var http = require('http');
var fs = require('fs');

http.get('http://nodevember.org/js/app.js', function(res) {
  var contents = '';
  res.on('data', function(chunk) {
    contents += chunk;
  });
  res.on('end', function() {
    contents = contents.replace(/(\n\r?)+/g, ' ');
    var match = contents.match(/"schedule":\s*(\[\{.*?\}\]\s*\}\])\s*\};/);
    if (match) {
      var json = 'schedule = ' + match[1] + ';';
      fs.writeFile('www/schedule.js', json, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('www/schedule.js written');
        }
      });
    } else {
      console.log('Failed to extract schedule array from app.js');
    }
  });
}).on('error', function(err) {
  console.log(err);
});
