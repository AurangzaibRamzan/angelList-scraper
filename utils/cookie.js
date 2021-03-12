var request = require('request');
var ip2location = require('ip-to-location');


function getTimeZone(ip) {
  return new Promise((resp, rej) => {
    ip2location.fetch(ip, function (err, res) {
      if (err) rej(err)
      resp(res.time_zone);
    });
  })
}

async function getCookie(ip, userAgent, callBack) {
  const timezone = ip ? await getTimeZone(ip) : 'Asia/Delhi';
  var options = {
    'method': 'POST',
    'url': 'https://api-js.datadome.co/js/',
    'headers': {
      'Connection': 'keep-alive',
      'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
      'DNT': '1',
      'sec-ch-ua-mobile': '?0',
      'User-Agent': userAgent,
      'Content-type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Origin': 'https://angel.co',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://angel.co/',
      'Accept-Language': 'en-GB,en;q=0.9'
    },
    form: {
      'jsData': `{"ttst":21.899999999732245,"ifov":false,"wdifts":true,"wdifrm":false,"wdif":false,"br_h":863,"br_w":974,"br_oh":863,"br_ow":974,"nddc":1,"rs_h":863,"rs_w":974,"rs_cd":24,"phe":false,"nm":false,"jsf":false,"ua":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Mobile Safari/537.36","lg":"en-US","pr":2,"hc":8,"ars_h":863,"ars_w":974,"tz":-300,"str_ss":true,"str_ls":true,"str_idb":true,"str_odb":true,"plgod":false,"plg":0,"plgne":"NA","plgre":"NA","plgof":"NA","plggt":"NA","pltod":false,"lb":false,"eva":33,"lo":false,"ts_mtp":1,"ts_tec":true,"ts_tsa":true,"vnd":"Google Inc.","bid":"NA","mmt":"empty","plu":"empty","hdn":false,"awe":false,"geb":false,"dat":false,"med":"defined","aco":"probably","acots":false,"acmp":"probably","acmpts":true,"acw":"probably","acwts":false,"acma":"maybe","acmats":false,"acaa":"probably","acaats":true,"ac3":"","ac3ts":false,"acf":"probably","acfts":false,"acmp4":"maybe","acmp4ts":false,"acmp3":"probably","acmp3ts":false,"acwm":"maybe","acwmts":false,"ocpt":false,"vco":"probably","vcots":false,"vch":"probably","vchts":true,"vcw":"probably","vcwts":true,"vc3":"","vc3ts":false,"vcmp":"","vcmpts":false,"vcq":"","vcqts":false,"vc1":"probably","vc1ts":false,"dvm":8,"sqt":false,"so":"landscape-primary","wbd":false,"wbdm":false,"wdw":true,"cokys":"bG9hZFRpbWVzY3NpYXBwd2Vic3RvcmVydW50aW1lL=","ecpc":false,"lgs":true,"lgsod":false,"bcda":false,"idn":false,"capi":false,"svde":true,"vpbq":false,"xr":false,"bgav":false,"rri":false,"idfr":false,"ancs":false,"inlc":false,"cgca":false,"inlf":false,"tecd":false,"sbct":true,"aflt":true,"rgp":true,"bint":true,"spwn":false,"emt":false,"bfr":false,"dbov":false}`,
      'events': '[]',
      'eventCounters': '[]',
      'jsType': 'ch',
      'cid': 'null',
      'ddk': 'BA3EB296E8BE96A496929870E20CD4',
      // 'Referer': 'https%3A%2F%2Fan gel.co%2Fcompanies%2Fhover',
      // 'request': '%2Fcompanies%2Fhover',
      'responsePage': 'origin',
      'ddv': '4.1.37'
    }
  };

  return new Promise((res, rej) => {
    request(options, function (error, response) {
      if (error) rej(error);
      callBack(response.body);
    });
  })


}


module.exports = getCookie;
