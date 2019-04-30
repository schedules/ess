'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');

var readfiles = require('node-readfiles');

var radio = {service:{type:'Radio'},items:{}};
var tv = {service:{type:'TV'},items:{}};
var tvIndex = 1;
var radioIndex = 30000;
var tvProgs = 0;
var radioProgs = 0;
const now = Math.floor(new Date()/1000);
const aMonth = 30*24*60*60;

var heading = '#index|type|name|pid|available|expires|episode|seriesnum|episodenum|versions|duration|desc|channel|categories|thumbnail|timeadded|guidance|web';

function output(obj,filename) {
	var s = heading + '\n';
	for (var pid in obj.items) {
		var item = obj.items[pid];
		if (obj.service.type == 'TV') {
			s += (tvIndex++)+'|tv|';
			tvProgs++;
		}
		else {
			s += (radioIndex++) + '|radio|';
			radioProgs++;
		}
		s += (item.brand.title ? item.brand.title : item.episode.title.split(' - ')[0].split(':')[0]) + '|';
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
	}
	fs.writeFile(filename,s,'utf8');
}

function processSchedule(filename) {
	var scheduleTxt = fs.readFileSync(filename,'utf8');
	var schedule = JSON.parse(scheduleTxt);
	if (schedule.items.length) {
	for (let item of schedule.items) {
		var target = (schedule.service.type == 'TV' ? tv : radio);
		if (target.items[item.episode.id]) {
			if (new Date(item.published_time.start) < new Date(target.items[item.episode.id].published_time.start)) {
				target.items[item.episode.id].published_time.start = item.published_time.start;
			}
			if (new Date(item.published_time.end) > new Date(target.items[item.episode.id].published_time.end)) {
				target.items[item.episode.id].published_time.end = item.published_time.end;
			}
		}
		else {
			target.items[item.episode.id] = item;
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
		if ((file.indexOf('.json')>0) && (file.indexOf('package.json')<0) && (file.indexOf('node_modules')<0)) {
			processSchedule(file);
		}
	}

	output(radio,'./radio.cache');
	output(tv,'./tv.cache');
	console.log('Radio programmes '+radioProgs);
	console.log('TV programmes '+tvProgs);
})
.catch(err => {
	console.log(util.inspect(err));
});
