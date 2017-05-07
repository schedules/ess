'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');

var readfiles = require('node-readfiles');

var radio = '';
var tv = '';
var tvIndex = 1;
var radioIndex = 10000;
var tvProgs = 0;
var radioProgs = 0;
const now = new Date()/1000;
const aMonth = 30*24*60*60;

var heading = '#index|type|name|pid|available|expires|episode|seriesnum|episodenum|versions|duration|desc|channel|categories|thumbnail|timeadded|guidance|web';

tv += heading + '\n';
radio += heading + '\n';

function processSchedule(filename) {
	if (filename.indexOf('package.json')<0) {
		var scheduleTxt = fs.readFileSync(filename,'utf8');
		var schedule = JSON.parse(scheduleTxt);
		for (let item of schedule.items) {
			var s = '';
			if (schedule.service.type == 'TV') {
				s += (tvIndex++)+'|tv|';
				tvProgs++;
			}
			else {
				s += (radioIndex++) + '|radio|';
				radioProgs++;
			}
			s += item.brand.title + '|';
			s += item.episode.id + '|';
			s += item.published_time.end + '|';
			s += (new Date(item.published_time.end)/1000)+aMonth + '|';
			s += item.episode.title + '|';
			s += '1|';
			s += '1|';
			s += 'original|';
			s += '0|';
			s += '|';
			s += item.service.id + '|';
			s += '|';
			s += '|';
			s += now + '|';
			s += '|';
			s += 'http://bbc.co.uk/programmes/'+item.episode.id + '|';
			s += '\n';
			if (schedule.service.type == 'TV') {
				tv += s;
			}
			else {
				radio += s;
			}
		}
	}
}

var pathspec = path.resolve('./');
readfiles(pathspec, {readContents: false, filenameFormat: readfiles.FULL_PATH}, function (err) {
	if (err) console.log(util.inspect(err));
	})
.then(files => {
	files = files.sort(function(a,b){
		if (a<b) return +1;
		if (a>b) return -1;
		return 0;
	});
	for (var file of files) {
		if ((file.indexOf('.json')>0) && (file.indexOf('node_modules')<0)) {
			//console.log(file);
			processSchedule(file);
		}
	}
	console.log('Radio programmes '+radioProgs);
	console.log('TV programmes '+tvProgs);
	fs.writeFileSync('./radio.cache',radio,'utf8');
	fs.writeFileSync('./tv.cache',tv,'utf8');
})
.catch(err => {
	console.log(util.inspect(err));
});
