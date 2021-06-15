var util = require('util');
var fs = require('fs');
var sdk = require('bbcparse/nitroSdk.js');
var mkdirp = require('mkdirp');

var static = [
 'bbc_one_london',
 'bbc_two_england',
 'bbc_four',
 'bbc_news24',
 'cbbc',
 'cbeebies',
 'bbc_parliament',
 'bbc_radio_one',
 'bbc_1xtra',
 'bbc_radio_two',
 'bbc_6music',
 'bbc_radio_three',
 'bbc_radio_fourfm',
 'bbc_radio_four_extra',
 'bbc_radio_five_live',
 'bbc_radio_five_live_sports_extra',
 'bbc_asian_network',
 'bbc_alba',
 'bbc_radio_scotland_fm',
 'bbc_radio_ulster',
 'bbc_radio_foyle',
 'bbc_radio_wales_fm',
 'bbc_radio_cymru',
 'bbc_london',
 'bbc_radio_berkshire',
 'bbc_radio_bristol',
 'bbc_radio_cambridge',
 'bbc_radio_cornwall',
 'bbc_radio_coventry_warwickshire',
 'bbc_radio_cumbria',
 'bbc_radio_derby',
 'bbc_radio_devon',
 'bbc_radio_essex',
 'bbc_radio_gloucestershire',
 'bbc_radio_guernsey',
 'bbc_radio_hereford_worcester',
 'bbc_radio_humberside',
 'bbc_radio_jersey',
 'bbc_radio_kent',
 'bbc_radio_lancashire',
 'bbc_radio_leeds',
 'bbc_radio_leicester',
 'bbc_radio_lincolnshire',
 'bbc_radio_manchester',
 'bbc_radio_merseyside',
 'bbc_radio_newcastle',
 'bbc_radio_norfolk',
 'bbc_radio_northampton',
 'bbc_radio_nottingham',
 'bbc_radio_oxford',
 'bbc_radio_sheffield',
 'bbc_radio_shropshire',
 'bbc_radio_solent',
 'bbc_radio_somerset_sound',
 'bbc_radio_stoke',
 'bbc_radio_suffolk',
 //'bbc_radio_swindon',
 'bbc_radio_wiltshire',
 'bbc_radio_york',
 //'bbc_southern_counties_radio',
 //'bbc_tees',
 //'bbc_three_counties_radio',
 'bbc_wm',
 'bbc_world_service'
];

var dom = new Date().getDate();
if (dom<10) dom ='0'+dom;

function next(keys) {
	if (keys.length) {
		var key = keys.shift();
		var query = sdk.newQuery();
		query.add('serviceId',key);
		sdk.make_request('ess.api.bbci.co.uk','/schedules','',query,{},function(obj){
			mkdirp.mkdirp('./'+key,function(err){
				fs.writeFileSync('./'+key+'/'+dom+'.json',JSON.stringify(obj,null,2),'utf8');
			});
			next(keys);
		},function(err){
			console.error(key);
			console.log('  Something went wrong');
			console.log(util.inspect(err));
			next(keys);
		});
	}
	else {
	}
}

next(static);

