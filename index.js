var http = require("http"),
        https = require("https"),
        spdy = require("spdy"),
        fs = require("fs"),
        url = require("url"),
        path = require("path"),
        mime = require("mime"),
        stream = fs.createWriteStream("/data/Relay/DisPub/log", {
                'flags': 'a'
        }),
        mstream = fs.createWriteStream("/data/Relay/DisPub/mlog", {
                'flags': 'a'
        }),
	zlib = require('zlib'),
	faye = require('faye'),
	w = require('wolfram'),
	wapi = w.createClient("Y5H46L-T7KT2YKV6K"),
	jsb = require("./beautify"),
	bayeux = new faye.NodeAdapter({mount: '/', timeout: 45});

fs.exists = fs.exists || require('path').exists;
fs.existsSync = fs.existsSync || require('path').existsSync;

var Config = {
        i: !1,
        inc: 0,
        gV: function (a, b) {
                for (var f = Config.gP(b).substr(1).split("&"), c = [], d = 0; d < f.length; ++d) {
                        var e = f[d].split("=");
                        if (e[0] == a) {
                                if (!1 === this.i) return !1 === this.i ? e[1] : !(this.i = !this.i);
                                c.push(e)
                        }
                }
                return c === [] ? !1 : c
        },
        gZ: function (a, b) {
                this.i = !1;
                return this.gV(a, b)
        },
        gVc: function (a, b) {
                this.i = !this.i;
                return this.gV(a, b)
        },
        gP: function (a) {
                return a.substr(a.indexOf("?"), a.length)
        },
        cH: function (a) {
                var b = "i";
                if (Config.gVc(b, a)) return b;
                b = "m";
                if (Config.gVc(b, a)) return b;
                b = "h";
                return Config.gVc(b, a) ? b : !1
        },
        gI: function () {
                return this.inc += 1
        }
};

b64d = function (z, xy) { //b64d+utf8
        if (xy != void 0 && !! xy) return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(z);
        var a;
        var b = z,
                c, d, e, f, g, h, i, j, k = 0,
                l = 0,
                m = "",
                n = [];
        if (b) {
                b += "";
                do f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(k++)), g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(k++)), h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(k++)), i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(k++)), j = f << 18 | g << 12 | h << 6 | i, c = j >> 16 & 255, d = j >> 8 & 255, e = j & 255, h == 64 ? n[l++] = String.fromCharCode(c) : i == 64 ? n[l++] = String.fromCharCode(c, d) : n[l++] = String.fromCharCode(c, d, e);
                while (k < b.length);
                var o = m = n.join(""),
                        p = [],
                        q = 0,
                        r = 0,
                        s = 0,
                        t = 0,
                        u = 0;
                for (o += ""; q < o.length;) s = o.charCodeAt(q), s < 128 ? (p[r++] = String.fromCharCode(s), q++) : s > 191 && s < 224 ? (t = o.charCodeAt(q + 1), p[r++] = String.fromCharCode((s & 31) << 6 | t & 63), q += 2) : (t = o.charCodeAt(q + 1), u = o.charCodeAt(q + 2), p[r++] = String.fromCharCode((s & 15) << 12 | (t & 63) << 6 | u & 63), q += 3);
                a = m = p.join("")
        } else a = b;
        return a;
};

/*global.getIP = function (req) {
        var ip_address = (req.connection.remoteAddress ? req.connection.remoteAddress : req.remoteAddress);
        //check for cloudflare if behind firewall or directly cloudflare'd
        try {
                if (req.headers['cf-connecting-ip']) {
                        var ipParts = ip_address.split(".");
                        var cloudFlare = false;
                        switch (parseInt(ipParts[0])) {
                        case 204:
                                //(204.93.177.0 - 204.93.177.255)
                                //(204.93.240.0 - 204.93.240.255)
                                if (parseInt(ipParts[1]) == 93 && (parseInt(ipParts[2]) == 240 || parseInt(ipParts[2]) == 177)) {
                                        cloudFlare = true;
                                }
                                break
                        case 199:
                                //(199.27.128.0 - 199.27.135.255)
                                if (parseInt(ipParts[1]) == 27 && (parseInt(ipParts[2]) < 136 || parseInt(ipParts[2]) > 127)) {
                                        cloudFlare = true;
                                }
                                break
                        case 173:
                                //(173.245.48.0 - 173.245.63.255)
                                if (parseInt(ipParts[1]) == 245 && (parseInt(ipParts[2]) < 64 || parseInt(ipParts[2]) > 47)) {
                                        cloudFlare = true;
                                }
                                break
                        }
                        if (cloudFlare) {
                                ip_address = req.headers['cf-connecting-ip'];
                        }
                }
        } catch (e) {}
        return ip_address;
}*/
// doesn't help it: Cloudflare proxy.
process.chdir("/data/Relay/DisPub/htdocs");

//////////////////


global.x = "";

function die(a) {
        console.log("Uh oh: " + a);
        process.exit(1)
}
global.log = console.log;
global.www = [];
global.incradd = function (a) {
        void 0 == www[a] ? www[a] = 1 : ++www[a];
}

// Feature breakdown: this is remote!
global.cx = {};

/////////////////
stream.once('open', function (fd) {
	
	// setup listener
	
	bayeux.listen(643, {
		//ca: "/data/Relay/DisPub/tls/ca.pem",
		key: "/data/Relay/DisPub/tls/www.sly.mn.key",
		cert: "/data/Relay/DisPub/tls/certificate.pem"
	});
	
	channels = {
		"/app/general": "187afc0111a7b8ad0396364d82ebbd216ef639120182740ac6b9570a698d58ec",
		"/app/retrieve":"4d14d61ab8b4bdce4d0df66659948595f7279e581dd7a22935c3e668f7b888cc"
	};
	
	var sA = {
		incoming: function (a, b) {
			if ("/meta/subscribe" !== a.channel) return b(a);
			var c = a.subscription, d = a.ext && a.ext.authToken;
			return channels[c] !== d && (a.error = "Access denied."), b(a);
		}
	};
	
	bayeux.addExtension(sA);
	
	pub = function (v) {
		return bayeux.getClient().publish('/app', {
			text: v
		});
	}
	
	_fs = {};
	
	_init = function () {
		spdy.createServer({
			ca: fs.readFileSync("/data/Relay/DisPub/tls/ca.pem"),
			key: fs.readFileSync("/data/Relay/DisPub/tls/www.sly.mn.key"),
			cert: fs.readFileSync("/data/Relay/DisPub/tls/certificate.pem")
		}, function (request, response) {
			responsed = response;
			var uri = url.parse(request.url).pathname,
				fn = path.join(process.cwd(), uri);
			logs = "";
			
	
			//console.log("Request from: " + (request.headers['x-forwarded-for'] || request.connection.remoteAddress));
			if ("/data" == uri) return "" == global.x ? response.end(Config.gV("jsonp", request.url) + '({pages:[{stats:{people:500},title:"Loading..."}]});') : response.end(Config.gV("jsonp", request.url) + "(" + global.x + ");")
	
			if ("/log" == uri) return b64d(y = decodeURIComponent(Config.gV("info", request.url)), !0) ? (console.log(b64d(y)), v = !mstream.write(b64d(y) + " (" + (request.headers["x-forwarded-for"] || request.connection.remoteAddress) + ")\n"))
					: (console.log(y, b64d(y), b64d(y, !0)), v = !1), response.writeHead(v ? 200 : 428, { "Content-Type": "text/plain" }), response.end(v ? "200 OK" : "428 Precondition Required\n"), pub("log");
					
			//!response._hasBody ? pub("headless") : pub("visitor");
			!response._hasBody && response.end();
			
			//if ("/reboot" == uri) return response.writeHead(200, { "Content-Type": "text/plain" }), response.end("Rebooting, execute twice for immediate effect. (System will go down in 1000ms)"), process.exit(console.log("System is going down!"));
			
			try {
				if (fs.statSync(fn).isDirectory()) fn += 'index.html';
			} catch (e) {}
			
			//console.log(request.headers);
			
			// Compression Module
			i=1;
			
			//if ( request.headers["accept-encoding"] != "" && console.log(1++) && !!request.headers["accept-encoding"] )
			//	if(request.headers["accept-encoding"].split(",").length > 1)
			//		encodsing = request.headers["accept-encoding"].split(",")[0];
			
			e = !!request.headers["accept-encoding"] ? request.headers["accept-encoding"].split(",")[0] == "deflate" ? 1 : request.headers["accept-encoding"].split(",")[0] == "gzip" ? 2 : 0 : 0; 
			
			
			//console.log("Request: "+uri+" (" + (request.headers['x-forwarded-for'] || request.connection.remoteAddress) + ")");
			
			/*if (global.cx[fn] == void 0 || global.cx[fn] === -2)*/ /*return fs.exists(fn, function (exists) {
				// REV AX-01
				if (!exists)
					if ( uri[uri.length-1] == "/" )
						return response.writeHead(404, {
							"Content-Type": "text/plain"
						}), response.end("404 Not Found\n");
					else
						return response.writeHead(302, {
							"Location": uri + "/"
						}), response.end("Please upgrade your browser as it fails to fulfil a header-redirect.");
				//if (!exists) return response.writeHead(302, {
					//'Location': 'https://sly.mn' + request.url
				//}), response.end();
				return fs.readFile(fn, "binary", function (err, file) {
					if (err) return response.writeHead(500, {
						"Content-Type": "text/plain,charset=utf-8",
						"Cache-control": "max-age=604800",
						"Expire": new Date() + ""
					}), response.end(err + "\n");
					return response.writeHead(200, {
						"Content-Type": mime.lookup(fn),
						"Cache-control": "max-age=604800",
						"Expire": new Date() + ""
					}), response.end(file, "binary");
				});
			});*/
			
			try {
				if ( "/w/" == uri.substring( 0, 3 ) ) {
					query = uri.substring( 3, uri.length );
					query = decodeURIComponent(query);
					
					return wapi.query( query, function ( a, b ) { // err, data
	                                	res = JSON.stringify(b);
	                                	
	                                	res = jsb.js_beautify(res, {
	                                		indent_size: 1,
	                                		ident_char: "\t",
	                                		indent_level: 1
	                                	});

	                                	return response.writeHead(200, {
	                                        	"Content-Type": "text/plain"
	                               		}), response.end( !a ? res : query/*b*/ );
					});
				}
			} catch (e) { // convenience: please do not fuck with the UX.
				return console.log("Convenience catch: WAPI.");
			}
			
			if ( "/r/" == uri.substring( 0, 3 ) ) {
				rows = 1, columns = 1, data = "";
				
				dS = (uri.substring(uri.length - 1, uri.length) == "/") ? uri.substring(1, uri.length - 1).split("/") : uri.substring(1, uri.length).split("/");
				
				if ( uri.substring(uri.length - 1, uri.length) == "/" ) {
					x = uri.substring(1, uri.length - 1).split("/");
					if ( x.length > 1 ) {
						if ( x.length < 3 ) {
							!isNaN(parseInt(x[1], 10)) && ( rows = parseInt(x[1], 10) );
						} else {
							!isNaN(parseInt(x[1], 10)) && ( rows = parseInt(x[1], 10) );
							!isNaN(parseInt(x[2], 10)) && ( columns = parseInt(x[2], 10) );
						}
					}
				} else {
					x = uri.substring(1, uri.length).split("/");
					if ( uri.substring(1, uri.length).split("/").length ) {
						if ( x.length > 1 ) {
							if ( x.length < 3 ) {
								!isNaN(parseInt(x[1], 10)) && ( rows = parseInt(x[1], 10) );
							} else {
								!isNaN(parseInt(x[1], 10)) && ( rows = parseInt(x[1], 10) );
								!isNaN(parseInt(x[2], 10)) && ( columns = parseInt(x[2], 10) );
							}
						}
					}
				}
				
				mF = function () {
					q = 1E3 * Math.random();
					(dS.indexOf("i") != -1) && ( ( q *= Math.pow( 10, 14 ) ), ( q = Math.round( q ) ) )
						
					return 17 > (q + "").length ? mF() : ( dS.indexOf("h") != -1 ? q.toString(16) : ( dS.indexOf("o") != -1 ? q.toString(8) : q ) );
				};
				
				for (i = 0; i <= rows - 1; ++i)
					for (j = 0; j <= columns - 1; ++j)
						data += mF(), data = j == ( columns - 1 ) ? data + "\n" : data + "\t";
				
				return response.writeHead(200, {
					"Content-Type": "text/plain"
				}), response.end(data);
			}
			
			// REWRITE: _XFS _ASYNC_STREAM. v1 10/14/2012 1:28 AM
			
			cancel = function () {
				return response.writeHead(404, {
					"Content-Type": "text/plain"
				}), response.end("404 Not Found\n");
			}
			
			//>>////////////////////////////SECURITY////////////CHECKS//////////////>>
			
			if ( /\.\.\/\.\./.test(uri) || /\.\/\.\./.test(uri) ) // we're blocking ../**../**../ => /*/.length less than current directory && not ../.. allowing <domain>/fun/../ to be routed to <domain>/fun/
				return cancel();
			
			if ( fn.length < (process.cwd()).length )
				return cancel();
			
			if ( uri.substring(0, 4) == "/../" )
				return cancel();
			
				/* Blocked:
				 *	*../..*
				 *	length(parsedURL) < length(pathToHTDOCS) (for instance https://<domain>/bla/.././.././../bla/ => ../../../ ~ when htdocs is in /data/Relay/htdocs/, len of URL maybe less if trying to access /data/Relay or above.)
				 *	/../*
				 * Allowed:
				 * 	/path/../up/ => easing the routing of paths, cannot result in deeper access: as to access a path, at least two "../" are required, and it can happen at least at the second argument, the up-routing would always concur with a previously set down-path.
				 * 			-> /path/../path/ => /path/
				 * 			-> /../ => FAIL
				 * 			-> /path/../path/../path/../ => /
				 * 			-> /path/../path/../../ => FAIL
				 */
			
			//<<////////////////////////////SECURITY////////////CHECKS//////////////<<
			
			if ( !(fn in _fs) )
				if ( fs.existsSync(fn) ) {
					_fs [ fn ] = 1;
				} else {
					if ( uri[uri.length-1] == "/" )
						return response.writeHead(404, {
							"Content-Type": "text/plain"
						}), response.end("404 Not Found\n");
					else
						return response.writeHead(302, {
							"Location": uri + "/"
						}), response.end();
				}
			
			var s = fs.createReadStream(fn);
			
			response.writeHead(200, {
				"Content-Type": mime.lookup(fn),
				"Cache-control": "max-age=604800",
				"Expire": new Date() + ""
			});
			
			s.on('error', function () {
				return response.writeHead(404, {
					"Content-Type": "text/plain"
				}), response.end("404 Not Found\n");
			})
			
			s.once('end', function () {
				//console.log(fn, mime.lookup(fn))
			});
			
			return s.pipe(response);
		
		}).listen(443, "87.106.69.16");
	
		http.createServer(function (request, response) {
			var uri = url.parse(request.url).pathname,
				fn = path.join(process.cwd(), uri);
	
			console.log(uri, "=>", fn, "(" + (request.headers["x-forwarded-for"] || request.connection.remoteAddress) + ")");
			
			if ("/test" == uri) return response.writeHead(200, { "Content-Type": "text/plain" }), response.end(test);
			
			console.log("HTTP -> HTTPS (" + (request.headers['x-forwarded-for'] || request.connection.remoteAddress) + ")");
			return response.writeHead(302, {
				'Location': 'https://sly.mn' + request.url
			}), response.end();
		}).listen(80, "87.106.69.16");
		
		//// Doesn't work? hm.
		//httpProxy.createServer(function (request, response, proxy) {
		//	var uri = url.parse(request.url).pathname,
		//		filename = path.join(process.cwd(), uri);
		//	
		//	console.log("Proxy", request.headers);
		//	return proxy.proxyRequest(request, response, {
		//		host: 's15408570.onlinehome-server.info',
		//		port: 80
		//	});
		//	
		//}).listen(13265, "localhost");
		//
		//httpProxy.createServer(13265, "localhost", {
		//	https: {
		//		ca: fs.readFileSync("/data/Relay/DisPub/tls/ca.pem"),
		//		key: fs.readFileSync("/data/Relay/DisPub/tls/www.sly.mn.key"),
		//		cert: fs.readFileSync("/data/Relay/DisPub/tls/certificate.pem")
		//	}
		//}).listen(2443, "localhost");
		
		//var client = new faye.Client('https://sly.mn:643/app');
		//client.subscribe('/app', function(message) {
		//	console.log(".... :()");
		//});
		/*xlen = JSON.stringify(global.cx).length;
			y = JSON.stringify(global.cx).length - xlen;
		setInterval(function(){
			fs.writeFileSync("dump", JSON.stringify(global.cx))
			y = JSON.stringify(global.cx).length - xlen;
			//console.log(fs.realpathSync("./dump"));
		}, 10000);*/
	};
	
	x = +new Date;
	
	//fs.existsSync("dump") ? (global.cx = JSON.parse(fs.readFileSync("dump")), console.log("It took " + (+new Date - x) + "ms to prepare the dataset."), _init()) : _init();
	
	_init();
	
	//console.log(global.cx);
});

/*
	REV AX-01 {
		Proxy of 404 => root-server
	}

*/
