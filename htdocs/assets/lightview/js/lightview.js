/*  Lightview 2.8.0 - 28-10-2011
 *  Copyright (c) 2008-2011 Nick Stakenburg (http://www.nickstakenburg.com)
 *
 *  Licensed under a Creative Commons Attribution-Noncommercial-No Derivative Works 3.0 Unported License
 *  http://creativecommons.org/licenses/by-nc-nd/3.0/
 *
 *  More information on this project:
 *  http://www.nickstakenburg.com/projects/lightview/
 *  
 */
;
var Lightview = {
        Version: '2.8.0',

        // Configuration
        options: {
                backgroundColor: '#ffffff',
                // Background color of the view
                border: 12,
                // Size of the border
                buttons: {
                        opacity: { // Opacity of inner buttons
                                disabled: 0.4,
                                normal: 0.75,
                                hover: 1
                        },
                        side: {
                                display: true
                        },
                        // Toggle side buttons
                        innerPreviousNext: {
                                display: true
                        },
                        // Toggle the inner previous and next button
                        slideshow: {
                                display: true
                        },
                        // Toggle slideshow button
                        topclose: {
                                side: 'right'
                        } // 'right' or 'left'                    
                },
                controller: { // The controller is used on sets
                        backgroundColor: '#4d4d4d',
                        border: 6,
                        buttons: {
                                innerPreviousNext: true,
                                side: false
                        },
                        margin: 18,
                        opacity: 0.7,
                        radius: 6,
                        setNumberTemplate: '#{position} / #{total}'
                },
                cyclic: false,
                // Makes galleries cyclic, no end/begin
                effectDurations: {
                        resize: .45,
                        sideButtons: {
                                show: .2,
                                hide: .2
                        },
                        content: {
                                appear: .2,
                                fade: .2
                        }
                },
                images: '../images/lightview/',
                // The directory of the images, from this file
                imgNumberTemplate: '#{position} / #{total}',
                keyboard: true,
                // Toggle keyboard buttons
                menubarPadding: 6,
                // Space between menubar and content in px
                overlay: { // Overlay
                        background: '#000',
                        // Background color, Mac Firefox & Mac Safari use overlay.png
                        close: true,
                        opacity: 0.75,
                        display: true
                },
                preloadHover: false,
                // Preload images on mouseover
                radius: 12,
                // Corner radius of the border
                removeTitles: true,
                // Set to false if you want to keep title attributes intact
                slideshowDelay: 5,
                // Delay in seconds before showing the next slide
                titleSplit: '::',
                // The characters you want to split title with
                transition: function (pos) { // Or your own transition
                        return ((pos /= 0.5) < 1 ? 0.5 * Math.pow(pos, 4) : -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2));
                },
                viewport: true,
                // Stay within the viewport, true is recommended
                zIndex: 5000,
                // zIndex of #lightview, #overlay is this -1
                startDimensions: { // Dimensions Lightview starts at
                        width: 100,
                        height: 100
                },
                closeDimensions: { // Modify if you've changed the close button images
                        large: {
                                width: 77,
                                height: 22
                        },
                        small: {
                                width: 25,
                                height: 22
                        }
                },
                sideDimensions: { // Modify if you've changed the side button images
                        width: 16,
                        height: 22
                },

                defaultOptions: { // Default options for each type of view
                        image: {
                                menubar: 'bottom',
                                closeButton: 'large'
                        },
                        gallery: {
                                menubar: 'bottom',
                                closeButton: 'large'
                        },
                        ajax: {
                                width: 400,
                                height: 300,
                                menubar: 'top',
                                closeButton: 'small',
                                overflow: 'auto'
                        },
                        iframe: {
                                width: 400,
                                height: 300,
                                menubar: 'top',
                                scrolling: true,
                                closeButton: 'small'
                        },
                        inline: {
                                width: 400,
                                height: 300,
                                menubar: 'top',
                                closeButton: 'small',
                                overflow: 'auto'
                        },
                        flash: {
                                width: 400,
                                height: 300,
                                menubar: 'bottom',
                                closeButton: 'large'
                        },
                        quicktime: {
                                width: 480,
                                height: 220,
                                autoplay: true,
                                controls: true,
                                closeButton: 'large'
                        }
                }
        },
        classids: {
                quicktime: 'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B',
                flash: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'
        },
        codebases: {
                quicktime: 'http://www.apple.com/qtactivex/qtplugin.cab',
                flash: 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,115,0'
        },
        errors: {
                requiresPlugin: "<div class='message'>The content your are attempting to view requires the <span class='type'>#{type}</span> plugin.</div><div class='pluginspage'><p>Please download and install the required plugin from:</p><a href='#{pluginspage}' target='_blank'>#{pluginspage}</a></div>"
        },
        mimetypes: {
                quicktime: 'video/quicktime',
                flash: 'application/x-shockwave-flash'
        },
        pluginspages: {
                quicktime: 'http://www.apple.com/quicktime/download',
                flash: 'http://www.adobe.com/go/getflashplayer'
        },
        // used with auto detection
        typeExtensions: {
                flash: 'swf',
                image: 'bmp gif jpeg jpg png',
                iframe: 'asp aspx cgi cfm htm html jsp php pl php3 php4 php5 phtml rb rhtml shtml txt',
                quicktime: 'avi mov mpg mpeg movie'
        }
};

(function () {
        function p(a, b) {
                ("" + b).length == 1 && (b = "0" + b);
                var c = ("" + a).length,
                        d = ("" + b).length;
                return c < d && (a = "0".times(d - c) + a), {
                        position: a,
                        total: b
                }
        }

        function h(a) {
                var b = {};
                return Object.keys(a).each(function (c) {
                        b[c] = a[c] + "px"
                }), b
        }
        var n = !! document.createElement("canvas").getContext,
                k = Prototype.Browser.IE &&
        function (a) {
                return (a = /MSIE ([\d.]+)/.exec(a)) ? parseFloat(a[1]) : -1
        }(navigator.userAgent) < 7, l = Prototype.Browser.WebKit && !document.evaluate, m = Prototype.Browser.Gecko &&
        function () {
                var a = navigator.userAgent.match(/rv\:(\d+)/);
                return a && parseFloat(a[1]) < 2
        }(navigator.userAgent), o = !! navigator.userAgent.match(/mac/i) && (l || m);
        Object.extend(Lightview.options.effectDurations, {
                topclose: {
                        show: .15,
                        delay: .15
                }
        }), Object.extend(Lightview, {
                REQUIRED_Prototype: "1.7",
                REQUIRED_Scriptaculous: "1.8.3",
                queue: {
                        position: "end",
                        scope: "lightview"
                },
                require: function (a) {
                        (typeof window[a] == "undefined" || this.convertVersionString(window[a].Version) < this.convertVersionString(this["REQUIRED_" + a])) && alert("Lightview requires " + a + " >= " + this["REQUIRED_" + a])
                },
                convertVersionString: function (a) {
                        var b = a.replace(/_.*|\./g, ""),
                                b = parseInt(b + "0".times(4 - b.length));
                        return a.indexOf("_") > -1 ? b - 1 : b
                },
                load: function () {
                        this.require("Prototype"), window.jQuery && window.$ && window.$ == window.jQuery && confirm("Lightview detected jQuery on the page without jQuery.noConflict enabled, it has to be enabled for Lightview to work.\n\nDocumentation on enabling jQuery.noConflict is available on the jQuery website, want to go there now?") && (window.location.href = "http://api.jquery.com/jQuery.noConflict/"), window.Effect && !window.Scriptaculous && this.require("Scriptaculous");
                        if (/^(https?:\/\/|\/)/.test(this.options.images)) this.images = this.options.images;
                        else {
                                var a = /lightview(?:-[\w\d.]+)?\.js(.*)/;
                                this.images = (($$("script[src]").find(function (b) {
                                        return b.src.match(a)
                                }) || {}).src || "").replace(a, "") + this.options.images
                        }
                        n || (document.documentMode >= 8 && !document.namespaces.ns_vml ? document.namespaces.add("ns_vml", "urn:schemas-microsoft-com:vml", "#default#VML") : document.observe("dom:loaded", function () {
                                document.createStyleSheet().cssText = "ns_vml\\:*{behavior:url(#default#VML)}"
                        }))
                },
                start: function () {
                        this.radius = this.options.radius, this.border = this.radius > this.options.border ? this.radius : this.options.border, this.closeDimensions = this.options.closeDimensions, this.sideDimensions = this.options.sideDimensions, this.build()
                }
        }), Object.extend(Lightview, {
                _lightviewLoadedEvents: 14,
                _lightviewLoadedEvent: function () {
                        var a = arguments.callee;
                        a.counter++, a.counter == this._lightviewLoadedEvents && Event.fire.defer(document.body, "lightview:loaded")
                }
        }), Lightview._lightviewLoadedEvent.counter = 0, Object.extend(Lightview, {
                build: function () {
                        this.lightview = new Element("div", {
                                id: "lightview"
                        });
                        var a, b, c = h(this.sideDimensions);
                        l && (this.lightview.hide = function () {
                                return this.setStyle("left:-9500px;top:-9500px;visibility:hidden;"), this
                        }, this.lightview.show = function () {
                                return this.setStyle("visibility:visible"), this
                        }, this.lightview.visible = function () {
                                return this.getStyle("visibility") == "visible" && parseFloat(this.getStyle("top").replace("px", "")) > -9500
                        }), $(document.body).insert(this.overlay = (new Element("div", {
                                id: "lv_overlay"
                        })).setStyle({
                                zIndex: this.options.zIndex - 1,
                                position: !m && !k ? "fixed" : "absolute",
                                background: o ? "url(" + this.images + "overlay.png) top left repeat" : this.options.overlay.background
                        }).setOpacity(o ? 1 : this.options.overlay.opacity).hide()).insert(this.lightview.setStyle({
                                zIndex: this.options.zIndex,
                                top: "-9500px",
                                left: "-9500px"
                        }).setOpacity(0).insert(this.container = (new Element("div", {
                                className: "lv_Container"
                        })).insert(this.sideButtons = (new Element("div", {
                                className: "lv_Sides"
                        })).insert(this.prevSide = (new Element("div", {
                                className: "lv_PrevSide"
                        })).setStyle(b = Object.extend({
                                marginLeft: -1 * this.sideDimensions.width + "px"
                        }, c)).insert(this.prevButtonImage = (new Element("div", {
                                className: "lv_Wrapper"
                        })).setStyle(Object.extend({
                                marginLeft: this.sideDimensions.width + "px"
                        }, c)).insert(new Element("div", {
                                className: "lv_Button"
                        })))).insert(this.nextSide = (new Element("div", {
                                className: "lv_NextSide"
                        })).setStyle(Object.extend({
                                marginRight: -1 * this.sideDimensions.width + "px"
                        }, c)).insert(this.nextButtonImage = (new Element("div", {
                                className: "lv_Wrapper"
                        })).setStyle(b).insert(new Element("div", {
                                className: "lv_Button"
                        }))))).insert(this.topButtons = (new Element("div", {
                                className: "lv_topButtons"
                        })).insert(this.topcloseButtonImage = (new Element("div", {
                                className: "lv_Wrapper lv_topcloseButtonImage"
                        })).insert(this.topcloseButton = new Element("div", {
                                className: "lv_Button"
                        })))).insert((new Element("div", {
                                className: "lv_Frames"
                        })).insert((new Element("div", {
                                className: "lv_Frame lv_FrameTop"
                        })).insert(a = (new Element("div", {
                                className: "lv_Liquid"
                        })).setStyle({
                                height: this.border + "px"
                        }).insert((new Element("div", {
                                className: "lv_Half lv_HalfLeft"
                        })).insert((new Element("div", {
                                className: "lv_CornerWrapper"
                        })).insert(new Element("div", {
                                className: "lv_Corner"
                        })).insert((new Element("div", {
                                className: "lv_Fill"
                        })).setStyle({
                                left: this.border + "px"
                        })))).insert(new Element("div", {
                                className: "lv_Filler"
                        })).insert((new Element("div", {
                                className: "lv_Half lv_HalfRight"
                        })).insert((new Element("div", {
                                className: "lv_CornerWrapper"
                        })).setStyle("margin-top: " + -1 * this.border + "px").insert(new Element("div", {
                                className: "lv_Corner"
                        })).insert((new Element("div", {
                                className: "lv_Fill"
                        })).setStyle("left: " + -1 * this.border + "px")))))).insert(this.resizeCenter = (new Element("div", {
                                className: "lv_Center"
                        })).setStyle("height: " + (150 - this.border) + "px").insert((new Element("div", {
                                className: "lv_WrapUp"
                        })).insert((new Element("div", {
                                className: "lv_WrapDown"
                        })).setStyle("margin-top: " + this.border + "px").insert(this.center = (new Element("div", {
                                className: "lv_WrapCenter"
                        })).setOpacity(0).setStyle("padding: 0 " + this.border + "px").insert(this.contentTop = new Element("div", {
                                className: "lv_contentTop lv_Fill"
                        })).insert(this.menubar = (new Element("div", {
                                className: "lv_MenuBar clearfix"
                        })).insert(this.closeButton = (new Element("div", {
                                className: "lv_Button lv_Close"
                        })).setStyle(h(this.options.closeDimensions.large)).setStyle({
                                background: this.options.backgroundColor
                        }).setOpacity(this.options.buttons.opacity.normal)).insert(this.data = (new Element("div", {
                                className: "lv_Data"
                        })).insert(this.dataText = (new Element("div", {
                                className: "lv_DataText"
                        })).insert(this.title = new Element("div", {
                                className: "lv_Title"
                        })).insert(this.caption = new Element("div", {
                                className: "lv_Caption"
                        }))).insert(this.innerController = (new Element("div", {
                                className: "lv_innerController"
                        })).insert(this.innerPrevNext = (new Element("div", {
                                className: "lv_innerPrevNext"
                        })).insert(this.innerPrevButton = (new Element("div", {
                                className: "lv_Button lv_innerPrevButton"
                        })).setOpacity(this.options.buttons.opacity.normal).setStyle({
                                backgroundColor: this.options.backgroundColor
                        }).setPngBackground(this.images + "inner_prev.png", {
                                backgroundColor: this.options.backgroundColor
                        })).insert(this.imgNumber = new Element("div", {
                                className: "lv_ImgNumber"
                        })).insert(this.innerNextButton = (new Element("div", {
                                className: "lv_Button lv_innerNextButton"
                        })).setOpacity(this.options.buttons.opacity.normal).setStyle({
                                backgroundColor: this.options.backgroundColor
                        }).setPngBackground(this.images + "inner_next.png", {
                                backgroundColor: this.options.backgroundColor
                        }))).insert(this.slideshow = (new Element("div", {
                                className: "lv_Slideshow"
                        })).insert(this.slideshowButton = (new Element("div", {
                                className: "lv_Button"
                        })).setOpacity(this.options.buttons.opacity.normal).setStyle({
                                backgroundColor: this.options.backgroundColor
                        }).setPngBackground(this.images + "inner_slideshow_play.png", {
                                backgroundColor: this.options.backgroundColor
                        })))))).insert(this.contentBottom = new Element("div", {
                                className: "lv_contentBottom "
                        }))))).insert(this.loading = (new Element("div", {
                                className: "lv_Loading"
                        })).insert(this.loadingButton = (new Element("div", {
                                className: "lv_Button"
                        })).setStyle("background: url(" + this.images + "loading.gif) top left no-repeat")))).insert((new Element("div", {
                                className: "lv_Frame lv_FrameBottom"
                        })).insert(a.cloneNode(!0))).insert(this.prevnext = (new Element("d", {
                                className: "lv_PrevNext"
                        })).hide().setStyle("margin-top: " + this.border + "px; background: url(" + this.images + "blank.gif) top left repeat"))))).insert((new Element("div", {
                                id: "lightviewError"
                        })).hide());
                        var d = new Image;
                        d.onload = function () {
                                d.onload = Prototype.emptyFunction, this.sideDimensions = {
                                        width: d.width,
                                        height: d.height
                                };
                                var a = h(this.sideDimensions),
                                        b;
                                this.sideButtons.setStyle({
                                        marginTop: 0 - (d.height / 2).round() + "px",
                                        height: d.height + "px"
                                }), this.prevSide.setStyle(b = Object.extend({
                                        marginLeft: -1 * this.sideDimensions.width + "px"
                                }, a)), this.prevButtonImage.setStyle(Object.extend({
                                        marginLeft: a.width
                                }, a)), this.nextSide.setStyle(Object.extend({
                                        marginRight: -1 * this.sideDimensions.width + "px"
                                }, a)), this.nextButtonImage.setStyle(b), this._lightviewLoadedEvent()
                        }.bind(this), d.src = this.images + "prev.png", $w("center title caption imgNumber")._each(function (a) {
                                this[a].setStyle({
                                        backgroundColor: this.options.backgroundColor
                                })
                        }.bind(this));
                        var e = this.container.select(".lv_Corner");
                        $w("tl tr bl br").each(function (a, b) {
                                this.radius > 0 ? this.createCorner(e[b], a) : e[b].insert(new Element("div", {
                                        className: "lv_Fill"
                                })), e[b].setStyle({
                                        width: this.border + "px",
                                        height: this.border + "px"
                                }).addClassName("lv_Corner" + a.capitalize()), this._lightviewLoadedEvent()
                        }.bind(this)), this.lightview.select(".lv_Filler", ".lv_Fill", ".lv_WrapDown").invoke("setStyle", {
                                backgroundColor: this.options.backgroundColor
                        });
                        var f = {};
                        $w("prev next topclose").each(function (a) {
                                this[a + "ButtonImage"].side = a;
                                var b = this.images + a + ".png";
                                a == "topclose" ? (f[a] = new Image, f[a].onload = function () {
                                        f[a].onload = Prototype.emptyFunction, this.closeDimensions[a] = {
                                                width: f[a].width,
                                                height: f[a].height
                                        };
                                        var c = this.options.buttons.topclose.side,
                                                d = Object.extend({
                                                        "float": c,
                                                        marginTop: this.closeDimensions[a].height + "px"
                                                }, h(this.closeDimensions[a]));
                                        d["padding" + c.capitalize()] = this.border + "px", this[a + "ButtonImage"].setStyle(d), this.topButtons.setStyle({
                                                height: f[a].height + "px",
                                                top: -1 * this.closeDimensions[a].height + "px"
                                        }), this[a + "ButtonImage"].down().setPngBackground(b).setStyle(h(this.closeDimensions[a])), this._lightviewLoadedEvent()
                                }.bind(this), f[a].src = this.images + a + ".png") : this[a + "ButtonImage"].setPngBackground(b)
                        }, this);
                        var g = {};
                        $w("large small").each(function (a) {
                                g[a] = new Image, g[a].onload = function () {
                                        g[a].onload = Prototype.emptyFunction, this.closeDimensions[a] = {
                                                width: g[a].width,
                                                height: g[a].height
                                        }, this._lightviewLoadedEvent()
                                }.bind(this), g[a].src = this.images + "close_" + a + ".png"
                        }, this);
                        var i = new Image;
                        i.onload = function () {
                                i.onload = Prototype.emptyFunction, this.loading.setStyle({
                                        width: i.width + "px",
                                        height: i.height + "px",
                                        marginTop: -0.5 * i.height + .5 * this.border + "px",
                                        marginLeft: -0.5 * i.width + "px"
                                }), this._lightviewLoadedEvent()
                        }.bind(this), i.src = this.images + "loading.gif";
                        var j = new Image;
                        j.onload = function () {
                                j.onload = Prototype.emptyFunction;
                                var a = {
                                        width: j.width + "px",
                                        height: j.height + "px"
                                };
                                this.slideshow.setStyle(a), this.slideshowButton.setStyle(a), this._lightviewLoadedEvent()
                        }.bind(this), j.src = this.images + "inner_slideshow_stop.png", $w("prev next").each(function (a) {
                                var b = a.capitalize(),
                                        c = new Image;
                                c.onload = function () {
                                        c.onload = Prototype.emptyFunction, this["inner" + b + "Button"].setStyle({
                                                width: c.width + "px",
                                                height: c.height + "px"
                                        }), this._lightviewLoadedEvent()
                                }.bind(this), c.src = this.images + "inner_" + a + ".png", this["inner" + b + "Button"].prevnext = a
                        }, this), $w("slideshow innerPrevNext imgNumber").each(function (a) {
                                this[a].hide = this[a].hide.wrap(function (a, b) {
                                        return this.style.position = "absolute", a(b), this
                                }), this[a].show = this[a].show.wrap(function (a, b) {
                                        return this.style.position = "relative", a(b), this
                                })
                        }, this), this.lightview.select("*").invoke("setStyle", {
                                zIndex: this.options.zIndex + 1
                        }), this.lightview.hide(), this._lightviewLoadedEvent()
                },
                prepare: function () {
                        Effect.Queues.get("lightview")._each(function (a) {
                                a.cancel()
                        }), this.scaledInnerDimensions = null, this.view.isSet() ? (this.controllerHeight = this._controllerHeight, this.controller && !this.controller.visible() && (this.controller.setStyle("visibility:hidden").show(), this.controllerCenter.setOpacity(0))) : (this.controllerHeight = null, this.controller.hide()), !this.view.options.topclose && this.topcloseButtonImage.retrieve("visible") && this.toggleTopClose(!1), this.hideOverlapping(), this.hideContent(), new Effect.Event({
                                queue: this.queue,
                                afterFinish: function () {
                                        $w("top bottom").each(function (a) {
                                                var b = a.capitalize();
                                                this["content" + b].remove();
                                                var c = {};
                                                this["content" + b] = (new Element("div", {
                                                        className: "lv_content" + b
                                                })).hide(), c[a] = this["content" + b], this.center.insert(c)
                                        }.bind(this))
                                }.bind(this)
                        }), this.disableKeyboardNavigation(), this.views = null
                },
                restoreInlineContent: function () {
                        this.inlineContent && this.inlineMarker && (this.inlineMarker.insert({
                                before: this.inlineContent.setStyle({
                                        display: this.inlineContent._inlineDisplayRestore
                                })
                        }), this.inlineMarker.remove(), this.inlineMarker = null)
                },
                show: function (a, b) {
                        this.element = null;
                        var c = Object.isString(a);
                        if (Object.isElement(a) || c) {
                                if (c && a.startsWith("#")) {
                                        this.show({
                                                href: a,
                                                options: Object.extend({
                                                        autosize: !0
                                                }, b || {})
                                        });
                                        return
                                }
                                this.element = $(a);
                                if (!this.element) return;
                                this.element.blur(), this.view = this.element._view || new Lightview.View(this.element)
                        } else a.href ? (this.element = $(document.body), this.view = new Lightview.View(a)) : Object.isNumber(a) && (this.element = this.getSet(this.view.rel)[a], this.view = this.element._view);
                        if (this.view.href) {
                                this.prepare();
                                if (this.view.isGallery() || this.view.isSet()) if (this.extendSet(this.view.rel), this.views = this.getViews(this.view.rel), this.view.isSet()) this.controllerOffset = this.views.length > 1 ? this._controllerOffset : 0, this.isSetGallery = this.views.all(function (a) {
                                        return a.isImage()
                                });
                                this.restoreCenter(), this.appear();
                                if (this.view.href != "#lightviewError" && Object.keys(Lightview.Plugin).join(" ").indexOf(this.view.type) >= 0 && !Lightview.Plugin[this.view.type]) return $("lightviewError").update((new Template(this.errors.requiresPlugin)).evaluate({
                                        type: this.view.type.capitalize(),
                                        pluginspage: this.pluginspages[this.view.type]
                                })), c = $("lightviewError").getDimensions(), this.show({
                                        href: "#lightviewError",
                                        title: this.view.type.capitalize() + " plugin required",
                                        options: c
                                }), !1;
                                c = Object.extend({
                                        menubar: "bottom",
                                        topclose: !1,
                                        wmode: "transparent",
                                        innerPreviousNext: this.view.isGallery() && this.options.buttons.innerPreviousNext.display,
                                        keyboard: this.options.keyboard,
                                        slideshow: this.view.isGallery() && this.options.buttons.slideshow.display || this.isSetGallery,
                                        overflow: "hidden",
                                        overlayClose: this.options.overlay.close,
                                        viewport: this.options.viewport
                                }, this.options.defaultOptions[this.view.type] || {}), this.view.options = Object.extend(c, this.view.options), this.view.isSet() && (this.view.options.topclose = this.views.length <= 1), !this.view.title && !(this.view.caption || this.views && this.views.length > 1) && this.view.options.topclose && (this.view.options.menubar = !1), this._contentPosition = "content" + (this.view.options.menubar == "top" ? "Bottom" : "Top");
                                if (this.view.isImage()) {
                                        if (!n && !this.view._VMLPreloaded) {
                                                this.view._VMLPreloaded = !0;
                                                var d = (new Element("ns_vml:image", {
                                                        src: this.view.href,
                                                        display: "none"
                                                })).setStyle("height:1px;width:1px;");
                                                $(document.body).insert(d), Element.remove.delay(.1, d)
                                        }
                                        if (this.view.isGallery() || this.view.isSet()) this.position = this.views.indexOf(this.view), this.preloadSurroundingImages();
                                        (this.innerDimensions = this.view.preloadedDimensions) ? this.afterEffect() : (this.startLoading(), d = new Image, d.onload = function () {
                                                d.onload = Prototype.emptyFunction, this.stopLoading(), this.innerDimensions = {
                                                        width: d.width,
                                                        height: d.height
                                                }, this.afterEffect()
                                        }.bind(this), d.src = this.view.href)
                                } else this.view.isSet() && (this.position = this.views.indexOf(this.view)), this.innerDimensions = this.view.options.fullscreen ? document.viewport.getDimensions() : {
                                        width: this.view.options.width,
                                        height: this.view.options.height
                                }, this.afterEffect()
                        }
                },
                insertContent: function () {
                        function a(a, b, c) {
                                a = $(a), c = h(c), a.update((new Element("img", {
                                        id: "lightviewContent",
                                        src: b,
                                        alt: "",
                                        galleryimg: "no"
                                })).setStyle(c))
                        }
                        var b = function () {
                                        function b(b, c, d) {
                                                var b = $(b),
                                                        e = h(d),
                                                        f = new Image;
                                                f.onload = function () {
                                                        canvas = new Element("canvas", e), b.update(canvas);
                                                        try {
                                                                canvas.getContext("2d").drawImage(f, 0, 0, d.width, d.height)
                                                        } catch (h) {
                                                                a(b, c, d)
                                                        }
                                                }.bind(this), f.src = c
                                        }

                                        function c(a, b, c) {
                                                a = $(a), a.update((new Element("div")).setStyle(h(c)).setStyle({
                                                        filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="scale")'
                                                }))
                                        }
                                        return n ? b : c
                                }();
                        return function () {
                                this.detectExtension(this.view.href);
                                var c = this.scaledInnerDimensions || this.innerDimensions;
                                if (this.view.isImage()) this[this._contentPosition].setStyle(h(c)), this.scaledInnerDimensions ? b(this[this._contentPosition], this.view.href, c) : a(this[this._contentPosition], this.view.href, c);
                                else if (this.view.isExternal()) switch (this.view.type) {
                                case "ajax":
                                        var c = Object.clone(this.view.options.ajax) || {},
                                                d = function () {
                                                        this.stopLoading(), this.view.options.autosize && (this[this._contentPosition].setStyle({
                                                                width: "auto",
                                                                height: "auto"
                                                        }), this.innerDimensions = this.getHiddenDimensions(this[this._contentPosition])), new Effect.Event({
                                                                queue: this.queue,
                                                                afterFinish: this.resizeWithinViewport.bind(this)
                                                        })
                                                }.bind(this);
                                        c.onComplete = c.onComplete ? c.onComplete.wrap(function (a, b) {
                                                d(), a(b)
                                        }) : d, this.startLoading(), new Ajax.Updater(this[this._contentPosition], this.view.href, c);
                                        break;
                                case "iframe":
                                        this.scaledInnerDimensions && (c.height -= this.menubarDimensions.height), this[this._contentPosition].update(this.iframe = (new Element("iframe", {
                                                frameBorder: 0,
                                                hspace: 0,
                                                src: this.view.href,
                                                id: "lightviewContent",
                                                name: "lightviewContent_" + (Math.random() * 99999).round(),
                                                scrolling: this.view.options && this.view.options.scrolling ? "auto" : "no"
                                        })).setStyle(Object.extend({
                                                border: 0,
                                                margin: 0,
                                                padding: 0
                                        }, h(c))));
                                        break;
                                case "inline":
                                        c = this.view.href, c = $(c.substr(c.indexOf("#") + 1));
                                        if (!c || !c.tagName) break;
                                        var e = c.getDimensions();
                                        c.insert({
                                                before: this.inlineMarker = (new Element(c.tagName)).hide()
                                        }), c._inlineDisplayRestore = c.getStyle("display"), this.inlineContent = c.show(), this[this._contentPosition].update(this.inlineContent), this[this._contentPosition].select("select, object, embed").each(function (a) {
                                                this.overlappingRestore.each(function (b) {
                                                        b.element == a && a.setStyle({
                                                                visibility: b.visibility
                                                        })
                                                })
                                        }.bind(this)), this.view.options.autosize && (this.innerDimensions = e, new Effect.Event({
                                                queue: this.queue,
                                                afterFinish: this.resizeWithinViewport.bind(this)
                                        }))
                                } else {
                                        e = {
                                                tag: "object",
                                                id: "lightviewContent",
                                                width: c.width,
                                                height: c.height
                                        };
                                        switch (this.view.type) {
                                        case "quicktime":
                                                Object.extend(e, {
                                                        pluginspage: this.pluginspages[this.view.type],
                                                        children: [{
                                                                tag: "param",
                                                                name: "autoplay",
                                                                value: this.view.options.autoplay
                                                        }, {
                                                                tag: "param",
                                                                name: "scale",
                                                                value: "tofit"
                                                        }, {
                                                                tag: "param",
                                                                name: "controller",
                                                                value: this.view.options.controls
                                                        }, {
                                                                tag: "param",
                                                                name: "enablejavascript",
                                                                value: !0
                                                        }, {
                                                                tag: "param",
                                                                name: "src",
                                                                value: this.view.href
                                                        }, {
                                                                tag: "param",
                                                                name: "loop",
                                                                value: this.view.options.loop || !1
                                                        }]
                                                }), Object.extend(e, Prototype.Browser.IE ? {
                                                        codebase: this.codebases[this.view.type],
                                                        classid: this.classids[this.view.type]
                                                } : {
                                                        data: this.view.href,
                                                        type: this.mimetypes[this.view.type]
                                                });
                                                break;
                                        case "flash":
                                                Object.extend(e, {
                                                        data: this.view.href,
                                                        type: this.mimetypes[this.view.type],
                                                        quality: "high",
                                                        wmode: this.view.options.wmode,
                                                        pluginspage: this.pluginspages[this.view.type],
                                                        children: [{
                                                                tag: "param",
                                                                name: "movie",
                                                                value: this.view.href
                                                        }, {
                                                                tag: "param",
                                                                name: "allowFullScreen",
                                                                value: "true"
                                                        }]
                                                }), this.view.options.flashvars && e.children.push({
                                                        tag: "param",
                                                        name: "FlashVars",
                                                        value: this.view.options.flashvars
                                                })
                                        }
                                        this[this._contentPosition].setStyle(h(c)).update(this.createHTML(e)).setStyle("visibility:hidden").show(), this.view.isQuicktime() &&
                                        function () {
                                                try {
                                                        "SetControllerVisible" in $("lightviewContent") && $("lightviewContent").SetControllerVisible(this.view.options.controls)
                                                } catch (a) {}
                                        }.bind(this).defer()
                                }
                        }
                }(),
                getHiddenDimensions: function (a) {
                        var a = $(a),
                                b = a.ancestors(),
                                c = [],
                                d = [];
                        return b.push(a), b.each(function (b) {
                                b != a && b.visible() || (c.push(b), d.push({
                                        display: b.getStyle("display"),
                                        position: b.getStyle("position"),
                                        visibility: b.getStyle("visibility")
                                }), b.setStyle({
                                        display: "block",
                                        position: "absolute",
                                        visibility: "visible"
                                }))
                        }), b = {
                                width: a.clientWidth,
                                height: a.clientHeight
                        }, c.each(function (a, b) {
                                a.setStyle(d[b])
                        }), b
                },
                clearContent: function () {
                        var a = $("lightviewContent");
                        if (a) switch (a.tagName.toLowerCase()) {
                        case "object":
                                if (Prototype.Browser.WebKit && this.view.isQuicktime()) {
                                        try {
                                                a.Stop()
                                        } catch (b) {}
                                        a.innerHTML = ""
                                }
                                a.parentNode ? a.remove() : a = Prototype.emptyFunction;
                                break;
                        case "iframe":
                                a.remove(), Prototype.Browser.Gecko && window.frames.lightviewContent && delete window.frames.lightviewContent;
                                break;
                        default:
                                a.remove()
                        }
                        $w("Top Bottom").each(function (a) {
                                this["content" + a].setStyle("width:auto;height:auto;").update("").hide()
                        }, this)
                },
                adjustDimensionsToView: function () {
                        var a = this.scaledInnerDimensions || this.innerDimensions;
                        if (this.view.options.controls) switch (this.view.type) {
                        case "quicktime":
                                a.height += 16
                        }
                        this[(this.scaledInnerDimensions ? "scaledI" : "i") + "nnerDimensions"] = a
                },
                afterEffect: function () {
                        new Effect.Event({
                                queue: this.queue,
                                afterFinish: this.afterShow.bind(this)
                        })
                },
                afterShow: function () {
                        this.fillMenuBar(), this.view.isAjax() || this.stopLoading(), this.view.options.autosize && this.view.isInline() || this.view.isAjax() || this.resizeWithinViewport(), this.view.isIframe() || new Effect.Event({
                                queue: this.queue,
                                afterFinish: this.insertContent.bind(this)
                        }), this.view.options.topclose && new Effect.Event({
                                queue: this.queue,
                                afterFinish: this.toggleTopClose.bind(this, !0)
                        })
                },
                finishShow: function () {
                        new Effect.Event({
                                queue: this.queue,
                                afterFinish: this.showContent.bind(this)
                        }), this.view.isIframe() && new Effect.Event({
                                delay: .2,
                                queue: this.queue,
                                afterFinish: this.insertContent.bind(this)
                        }), this.sliding && new Effect.Event({
                                queue: this.queue,
                                afterFinish: this.nextSlide.bind(this)
                        }), (this.view.isQuicktime() || this.view.isFlash()) && new Effect.Event({
                                queue: this.queue,
                                delay: .1,
                                afterFinish: Element.setStyle.bind(this, this[this._contentPosition], "visibility:visible")
                        })
                },
                previous: function () {
                        Effect.Queues.get(Lightview.queue.scope).effects.length || this.show(this.getSurroundingIndexes().previous)
                },
                next: function () {
                        Effect.Queues.get(Lightview.queue.scope).effects.length || this.show(this.getSurroundingIndexes().next)
                },
                resizeWithinViewport: function () {
                        this.adjustDimensionsToView();
                        var a = this.getInnerDimensions(),
                                b = this.getBounds();
                        this.view.options.viewport && (a.width > b.width || a.height > b.height) ? this.view.options.fullscreen ? (this.scaledInnerDimensions = b, this.fillMenuBar(), a = b) : (a = this.getOuterDimensions(), this.view.isMedia() ? (b = [b.height / a.height, b.width / a.width, 1].min(), this.scaledInnerDimensions = {
                                width: (this.innerDimensions.width * b).round(),
                                height: (this.innerDimensions.height * b).round()
                        }) : this.scaledInnerDimensions = {
                                width: a.width > b.width ? b.width : a.width,
                                height: a.height > b.height ? b.height : a.height
                        }, this.fillMenuBar(), a = Object.clone(this.scaledInnerDimensions), this.view.isMedia() && (a.height += this.menubarDimensions.height)) : (this.fillMenuBar(), this.scaledInnerDimensions = null), this._resize(a)
                },
                resize: function (a) {
                        this._resize(a, {
                                duration: 0
                        })
                },
                _resize: function () {
                        var a, b, c, d, e, f = function () {
                                        var e, f, g;
                                        return g = k ?
                                        function (d) {
                                                this.lightview.setStyle({
                                                        width: (a.width + d * b).toFixed(0) + "px",
                                                        height: (a.height + d * c).toFixed(0) + "px"
                                                }), this.resizeCenter.setStyle({
                                                        height: f - 1 * this.border + "px"
                                                })
                                        } : m ?
                                        function () {
                                                var a = this.getViewportDimensions(),
                                                        b = document.viewport.getScrollOffsets();
                                                this.lightview.setStyle({
                                                        position: "absolute",
                                                        marginLeft: 0,
                                                        marginTop: 0,
                                                        width: e + "px",
                                                        height: f + "px",
                                                        left: (b[0] + a.width / 2 - e / 2).floor() + "px",
                                                        top: (b[1] + a.height / 2 - f / 2).floor() + "px"
                                                }), this.resizeCenter.setStyle({
                                                        height: f - 1 * this.border + "px"
                                                })
                                        } : function () {
                                                this.lightview.setStyle({
                                                        position: "fixed",
                                                        width: e + "px",
                                                        height: f + "px",
                                                        marginLeft: ((0 - e) / 2).round() + "px",
                                                        marginTop: ((0 - f) / 2 - d).round() + "px"
                                                }), this.resizeCenter.setStyle({
                                                        height: f - 1 * this.border + "px"
                                                })
                                        }, function (d) {
                                                e = (a.width + d * b).toFixed(0), f = (a.height + d * c).toFixed(0), g.call(this, d)
                                        }
                                }();
                        return function (g, h) {
                                var i = h || {};
                                a = this.lightview.getDimensions(), e = 2 * this.border, width = g.width ? g.width + e : a.width, height = g.height ? g.height + e : a.height, this.hidePrevNext();
                                if (a.width == width && a.height == height) new Effect.Event({
                                        queue: this.queue,
                                        afterFinish: this._afterResize.bind(this, g)
                                });
                                else {
                                        var j = {
                                                width: width + "px",
                                                height: height + "px"
                                        };
                                        b = width - a.width, c = height - a.height, parseInt(this.lightview.getStyle("marginLeft").replace("px", "")), parseInt(this.lightview.getStyle("marginTop").replace("px", "")), d = this.controller.visible() ? this.controllerOffset / 2 : 0, k || Object.extend(j, {
                                                marginLeft: 0 - width / 2 + "px",
                                                marginTop: 0 - height / 2 + "px"
                                        }), i.duration == 0 ? f.call(this, 1) : this.resizing = new Effect.Tween(this.lightview, 0, 1, Object.extend({
                                                duration: this.options.effectDurations.resize,
                                                queue: this.queue,
                                                transition: this.options.transition,
                                                afterFinish: this._afterResize.bind(this, g)
                                        }, i), f.bind(this))
                                }
                        }
                }(),
                _afterResize: function (a) {
                        if (this.menubarDimensions) {
                                var b = this[this._contentPosition],
                                        c;
                                this.view.options.overflow == "auto" && (c = b.getDimensions()), b.setStyle({
                                        height: a.height - this.menubarDimensions.height + "px",
                                        width: a.width + "px"
                                });
                                if (this.view.options.overflow != "hidden" && (this.view.isAjax() || this.view.isInline())) if (Prototype.Browser.IE) if (this.view.options.overflow == "auto") {
                                        var d = b.getDimensions();
                                        b.setStyle("overflow:visible");
                                        var e = {
                                                overflowX: "hidden",
                                                overflowY: "hidden"
                                        },
                                                f = 0;
                                        c.height > a.height && (e.overflowY = "auto", e.width = d.width - 15, e.paddingRight = "15px", f = 15), c.width - f > a.width && (e.overflowX = "auto", e.height = d.height - 15, e.paddingBottom = "15px"), b.setStyle(e)
                                } else b.setStyle({
                                        overflow: this.view.options.overflow
                                });
                                else b.setStyle({
                                        overflow: this.view.options.overflow
                                });
                                else b.setStyle("overflow:hidden");
                                this.restoreCenter(), this.resizing = null, this.finishShow()
                        }
                },
                showContent: function () {
                        new Effect.Event({
                                queue: this.queue,
                                beforeStart: this.hidePrevNext.bind(this)
                        }), new Effect.Event({
                                queue: this.queue,
                                afterFinish: function () {
                                        this[this._contentPosition].show(), this.fillMenuBar(), this.menubar.visible() && this.menubar.setStyle("visibility:visible").setOpacity(1)
                                }.bind(this)
                        }), new Effect.Parallel([new Effect.Opacity(this.center, {
                                sync: !0,
                                from: 0,
                                to: 1
                        }), new Effect.Appear(this.sideButtons, {
                                sync: !0
                        })], {
                                queue: this.queue,
                                duration: this.options.effectDurations.content.appear,
                                afterFinish: function () {
                                        this.element && this.element.fire("lightview:opened")
                                }.bind(this)
                        }), (this.view.isGallery() || this.isSetGallery && this.options.controller.buttons.side) && new Effect.Event({
                                queue: this.queue,
                                afterFinish: this.showPrevNext.bind(this)
                        })
                },
                hideContent: function () {
                        function a() {
                                this.restoreInlineContent(), this.clearContent()
                        }

                        function b(a) {
                                this.center.setOpacity(a), this.sideButtons.setOpacity(a)
                        }
                        return function () {
                                this.lightview.visible() ? new Effect.Tween(this.lightview, 1, 0, {
                                        duration: .2,
                                        queue: this.queue,
                                        afterFinish: a.bind(this)
                                }, b.bind(this)) : (this.center.setOpacity(0), this.sideButtons.setOpacity(0), this.clearContent())
                        }
                }(),
                hideData: function () {
                        $w("innerController data dataText title caption imgNumber innerPrevNext innerNextButton innerPrevButton slideshow closeButton").each(function (a) {
                                Element.hide(this[a])
                        }, this), this.menubar.setStyle("visibility:hidden").setOpacity(0)
                },
                fillMenuBar: function () {
                        this.hideData(), this.view.options.menubar ? this.menubar.show() : (this.menubarDimensions = {
                                width: 0,
                                height: 0
                        }, this.closeButtonWidth = 0, this.menubar.hide());
                        if (this.view.title || this.view.caption) this.dataText.show(), this.data.show();
                        this.view.title && this.title.update(this.view.title).show(), this.view.caption && this.caption.update(this.view.caption).show();
                        if (this.views && this.views.length > 1) if (this.view.isSet()) {
                                var a = p(this.position + 1, this.views.length);
                                this.setNumber.update((new Template(this.options.controller.setNumberTemplate)).evaluate({
                                        position: a.position,
                                        total: a.total
                                })), this.controller.getStyle("visibility") == "hidden" && (this.controller.setStyle("visibility:visible"), this._controllerCenterEffect && Effect.Queues.get("lightview").remove(this._controllerCenterEffect), this._controllerCenterEffect = new Effect.Appear(this.controllerCenter, {
                                        queue: this.queue,
                                        duration: .1
                                }))
                        } else this.data.show(), this.view.isImage() && (this.innerController.show(), this.innerPrevNext.show(), a = p(this.position + 1, this.views.length), this.imgNumber.show().update((new Template(this.options.imgNumberTemplate)).evaluate({
                                position: a.position,
                                total: a.total
                        })), this.view.options.slideshow && (this.slideshowButton.show(), this.slideshow.show()));
                        var b = this.view.isSet();
                        if ((this.view.options.innerPreviousNext || b) && this.views.length > 1) {
                                var c = {
                                        prev: this.options.cyclic || this.position != 0,
                                        next: this.options.cyclic || (this.view.isGallery() || b) && this.getSurroundingIndexes().next != 0
                                };
                                $w("prev next").each(function (a) {
                                        var d = a.capitalize(),
                                                e = c[a] ? "pointer" : "auto";
                                        b ? this["controller" + d].setStyle({
                                                cursor: e
                                        }).setOpacity(c[a] ? 1 : this.options.buttons.opacity.disabled) : this["inner" + d + "Button"].setStyle({
                                                cursor: e
                                        }).setOpacity(c[a] ? this.options.buttons.opacity.normal : this.options.buttons.opacity.disabled)
                                }.bind(this));
                                if (this.view.options.innerPreviousNext || this.options.controller.innerPreviousNext) this.innerPrevButton.show(), this.innerNextButton.show(), this.innerPrevNext.show()
                        }
                        this.controllerSlideshow.setOpacity(this.isSetGallery ? 1 : this.options.buttons.opacity.disabled).setStyle({
                                cursor: this.isSetGallery ? "pointer" : "auto"
                        }), this.setCloseButtons(), this.menubar.childElements().find(Element.visible) || (this.menubar.hide(), this.view.options.menubar = !1), this.setMenubarDimensions()
                },
                setCloseButtons: function () {
                        var a = this.closeDimensions.small.width,
                                b = this.closeDimensions.large.width,
                                c = this.scaledInnerDimensions ? this.scaledInnerDimensions.width : this.innerDimensions.width,
                                d = 0,
                                e = this.view.options.closeButton || "large",
                                f = this.options.borderColor;
                        this.view.options.topclose || this.view.isSet() || !this.view.options.closeButton ? f = null : c >= 180 + a && c < 180 + b ? (f = "small", d = a) : c >= 180 + b && (f = e, d = this.closeDimensions[e].width), d > 0 ? (this.data.show(), this.closeButton.setStyle({
                                width: d + "px"
                        }).show()) : this.closeButton.hide(), f && this.closeButton.setPngBackground(this.images + "close_" + f + ".png", {
                                backgroundColor: this.options.backgroundColor
                        }), this.closeButtonWidth = d
                },
                startLoading: function () {
                        this.loading.show()
                },
                stopLoading: function () {
                        this.loadingEffect && Effect.Queues.get("lightview").remove(this.loadingEffect), new Effect.Fade(this.loading, {
                                duration: .2,
                                queue: this.queue,
                                delay: .2
                        })
                },
                setPrevNext: function () {
                        if (this.view.isImage()) {
                                var a = this.options.cyclic && this.views.length > 1 || this.position != 0,
                                        b = this.options.cyclic && this.views.length > 1 || (this.view.isGallery() || this.view.isSet()) && this.getSurroundingIndexes().next != 0;
                                this.prevButtonImage[a ? "show" : "hide"](), this.nextButtonImage[b ? "show" : "hide"]();
                                var c = this.scaledInnerDimensions || this.innerDimensions;
                                this.prevnext.setStyle({
                                        height: c.height + "px",
                                        marginTop: this.border + (this.view.options.menubar == "top" ? this.menubar.getHeight() : 0) + "px"
                                }), c = (c.width / 2 - 1 + this.border).floor(), a && (this.prevnext.insert(this.prevButton = (new Element("div", {
                                        className: "lv_Button lv_PrevButton"
                                })).setStyle({
                                        width: c + "px"
                                })), this.prevButton.side = "prev"), b && (this.prevnext.insert(this.nextButton = (new Element("div", {
                                        className: "lv_Button lv_NextButton"
                                })).setStyle({
                                        width: c + "px"
                                })), this.nextButton.side = "next"), (a || b) && this.prevnext.show()
                        }
                },
                showPrevNext: function () {
                        this.view && this.options.buttons.side.display && this.view.isImage() && (this.setPrevNext(), this.prevnext.show())
                },
                hidePrevNext: function () {
                        this.prevButton && (this.prevButton = null), this.nextButton && (this.nextButton = null), this.prevnext.update("").hide(), this.prevButtonImage.hide().setStyle({
                                marginLeft: this.sideDimensions.width + "px"
                        }), this.nextButtonImage.hide().setStyle({
                                marginLeft: -1 * this.sideDimensions.width + "px"
                        })
                },
                appear: function () {
                        function a() {
                                this.lightview.setOpacity(1)
                        }
                        return l || (a = a.wrap(function (a, b) {
                                a(b), this.lightview.show()
                        })), function () {
                                this.lightview.getStyle("opacity") == 0 && (this.options.overlay.display ? new Effect.Appear(this.overlay, {
                                        duration: .2,
                                        from: 0,
                                        to: o ? 1 : this.options.overlay.opacity,
                                        queue: this.queue,
                                        beforeStart: this.maxOverlay.bind(this),
                                        afterFinish: a.bind(this)
                                }) : a.call(this))
                        }
                }(),
                hide: function () {
                        Prototype.Browser.IE && this.iframe && this.view.isIframe() && this.iframe.remove();
                        if (l && this.view.isQuicktime()) {
                                var a = $$("object#lightviewContent")[0];
                                if (a) try {
                                        a.Stop()
                                } catch (b) {}
                        }
                        this.lightview.getStyle("opacity") != 0 && (this.stopSlideshow(), this.prevnext.hide(), (!Prototype.Browser.IE || !this.view.isIframe()) && this.center.hide(), Effect.Queues.get("lightview_hide").effects.length > 0 || (Effect.Queues.get("lightview").each(function (a) {
                                a.cancel()
                        }), new Effect.Event({
                                queue: this.queue,
                                afterFinish: this.restoreInlineContent.bind(this)
                        }), new Effect.Opacity(this.lightview, {
                                duration: .1,
                                from: 1,
                                to: 0,
                                queue: {
                                        position: "end",
                                        scope: "lightview_hide"
                                }
                        }), new Effect.Fade(this.overlay, {
                                duration: .16,
                                queue: {
                                        position: "end",
                                        scope: "lightview_hide"
                                },
                                afterFinish: this.afterHide.bind(this)
                        })))
                },
                afterHide: function () {
                        this.clearContent(), this.lightview.hide(), this.center.setOpacity(0).show(), this.prevnext.update("").hide(), this.contentTop.update("").hide(), this.contentBottom.update("").hide(), this.disableKeyboardNavigation(), this.showOverlapping(), this.toggleTopClose(!1, 0), new Effect.Event({
                                queue: this.queue,
                                afterFinish: this.resize.bind(this, this.options.startDimensions)
                        }), new Effect.Event({
                                queue: this.queue,
                                afterFinish: function () {
                                        this.element && this.element.fire("lightview:hidden"), $w("element views view scaledInnerDimensions isSetGallery _openEffect content")._each(function (a) {
                                                this[a] = null
                                        }.bind(this))
                                }.bind(this)
                        })
                },
                setMenubarDimensions: function () {
                        this.menubar.setStyle("padding:0;");
                        var a = {},
                                a = this[(this.scaledInnerDimensions ? "scaledI" : "i") + "nnerDimensions"].width;
                        this.menubar.setStyle({
                                width: a + "px"
                        }), this.data.setStyle({
                                width: a - this.closeButtonWidth - 1 + "px"
                        }), a = this.getHiddenDimensions(this.menubar);
                        if (this.view.options.menubar) switch (a.height += this.options.menubarPadding, this.view.options.menubar) {
                        case "bottom":
                                this.menubar.setStyle("padding:" + this.options.menubarPadding + "px 0 0 0");
                                break;
                        case "top":
                                this.menubar.setStyle("padding: 0 0 " + this.options.menubarPadding + "px 0")
                        }
                        this.menubar.setStyle({
                                width: "100%"
                        }), this.menubarDimensions = this.view.options.menubar ? a : {
                                width: a.width,
                                height: 0
                        }
                },
                restoreCenter: function () {
                        var a, b, c;
                        return c = k ?
                        function () {
                                this.lightview.setStyle({
                                        top: "50%",
                                        left: "50%"
                                })
                        } : l || m ?
                        function () {
                                var b = this.getViewportDimensions(),
                                        c = document.viewport.getScrollOffsets();
                                this.lightview.setStyle({
                                        marginLeft: 0,
                                        marginTop: 0,
                                        left: (c[0] + b.width / 2 - a.width / 2).floor() + "px",
                                        top: (c[1] + b.height / 2 - a.height / 2).floor() + "px"
                                })
                        } : function () {
                                this.lightview.setStyle({
                                        position: "fixed",
                                        left: "50%",
                                        top: "50%",
                                        marginLeft: (0 - a.width / 2).round() + "px",
                                        marginTop: (0 - a.height / 2 - b).round() + "px"
                                })
                        }, function () {
                                a = this.lightview.getDimensions(), b = this.controller.visible() ? this.controllerOffset / 2 : 0, c.call(this)
                        }
                }(),
                startSlideshow: function () {
                        this.stopSlideshow(), this.sliding = !0, this.next.bind(this).delay(.25), this.slideshowButton.setPngBackground(this.images + "inner_slideshow_stop.png", {
                                backgroundColor: this.options.backgroundColor
                        }).hide(), this.controllerSlideshow.setPngBackground(this.images + "controller_slideshow_stop.png", {
                                backgroundColor: this.options.controller.backgroundColor
                        })
                },
                stopSlideshow: function () {
                        this.sliding && (this.sliding = !1), this.slideTimer && clearTimeout(this.slideTimer), this.slideshowButton.setPngBackground(this.images + "inner_slideshow_play.png", {
                                backgroundColor: this.options.backgroundColor
                        }), this.controllerSlideshow.setPngBackground(this.images + "controller_slideshow_play.png", {
                                backgroundColor: this.options.controller.backgroundColor
                        })
                },
                toggleSlideshow: function () {
                        (!this.view.isSet() || this.isSetGallery) && this[(this.sliding ? "stop" : "start") + "Slideshow"]()
                },
                nextSlide: function () {
                        this.sliding && (this.slideTimer = this.next.bind(this).delay(this.options.slideshowDelay))
                },
                updateViews: function () {
                        $$("a[class~=lightview], area[class~=lightview]").each(function (a) {
                                var b = a._view;
                                b && (b._title && a.writeAttribute("title", b._title), a._view = null)
                        })
                },
                getSet: function (a) {
                        var b = a.indexOf("][");
                        return b > -1 && (a = a.substr(0, b + 1)), $$('a[rel^="' + a + '"], area[rel^="' + a + '"]')
                },
                getViews: function (a) {
                        return this.getSet(a).pluck("_view")
                },
                addObservers: function () {
                        $(document.body).observe("click", this.delegateClose.bindAsEventListener(this)), $w("mouseover mouseout").each(function (a) {
                                this.prevnext.observe(a, function (a) {
                                        var b = a.findElement("div");
                                        b && (this.prevButton && this.prevButton == b || this.nextButton && this.nextButton == b) && this.toggleSideButton(a)
                                }.bindAsEventListener(this))
                        }.bind(this)), this.prevnext.observe("click", function (a) {
                                (a = a.findElement("div")) && (a = this.prevButton && this.prevButton == a ? "previous" : this.nextButton && this.nextButton == a ? "next" : null) && this[a].wrap(function (a, b) {
                                        this.stopSlideshow(), a(b)
                                }).bind(this)()
                        }.bindAsEventListener(this)), $w("prev next").each(function (a) {
                                var b = a.capitalize(),
                                        c = function (a, b) {
                                                this.stopSlideshow(), a(b)
                                        },
                                        d = function (a, b) {
                                                var c = b.element().prevnext;
                                                (c == "prev" && (this.options.cyclic || this.position != 0) || c == "next" && (this.options.cyclic || (this.view.isGallery() || this.view.isSet()) && this.getSurroundingIndexes().next != 0)) && a(b)
                                        };
                                this[a + "ButtonImage"].observe("mouseover", this.toggleSideButton.bindAsEventListener(this)).observe("mouseout", this.toggleSideButton.bindAsEventListener(this)).observe("click", this[a == "next" ? a : "previous"].wrap(c).bindAsEventListener(this)), this["inner" + b + "Button"].observe("click", this[a == "next" ? a : "previous"].wrap(d).wrap(c).bindAsEventListener(this)).observe("mouseover", Element.setOpacity.curry(this["inner" + b + "Button"], this.options.buttons.opacity.hover).wrap(d).bindAsEventListener(this)).observe("mouseout", Element.setOpacity.curry(this["inner" + b + "Button"], this.options.buttons.opacity.normal).wrap(d).bindAsEventListener(this)), this["controller" + b].observe("click", this[a == "next" ? a : "previous"].wrap(d).wrap(c).bindAsEventListener(this))
                        }, this);
                        var a = [this.closeButton, this.slideshowButton];
                        l ? a.invoke("setOpacity", 1) : a.each(function (a) {
                                a.observe("mouseover", Element.setOpacity.bind(this, a, this.options.buttons.opacity.hover)).observe("mouseout", Element.setOpacity.bind(this, a, this.options.buttons.opacity.normal))
                        }, this), this.slideshowButton.observe("click", this.toggleSlideshow.bindAsEventListener(this)), this.controllerSlideshow.observe("click", this.toggleSlideshow.bindAsEventListener(this));
                        if (l || m) a = function (a, b) {
                                this.lightview.getStyle("top").charAt(0) != "-" && a(b)
                        }, Event.observe(window, "scroll", this.restoreCenter.wrap(a).bindAsEventListener(this)), Event.observe(window, "resize", this.restoreCenter.wrap(a).bindAsEventListener(this));
                        m && Event.observe(window, "resize", this.maxOverlay.bindAsEventListener(this)), k && (a = function () {
                                this.controller && this.controller.setStyle({
                                        left: ((document.documentElement.scrollLeft || 0) + document.viewport.getWidth() / 2).round() + "px"
                                })
                        }, Event.observe(window, "scroll", a.bindAsEventListener(this)), Event.observe(window, "resize", a.bindAsEventListener(this))), this.options.preloadHover && (this._preloadImageHover = function (a) {
                                var b = a.findElement("a[class~=lightview], area[class~=lightview]");
                                b && (a.stop(), b._view || new Lightview.View(b), this.preloadImageHover(b))
                        }.bindAsEventListener(this), $(document.body).observe("mouseover", this._preloadImageHover))
                },
                toggleTopClose: function (a) {
                        if (!a || !this.topcloseButtonImage.retrieve("visible")) this._topCloseEffect && Effect.Queues.get("lightview_topCloseEffect").remove(this.topCloseEffect), this._topCloseEffect = new Effect.Morph(this.topcloseButtonImage, {
                                style: {
                                        marginTop: (a ? 0 : this.closeDimensions.topclose.height) + "px"
                                },
                                duration: a ? this.options.effectDurations.topclose.show : 0,
                                queue: this.queue,
                                delay: a ? this.options.effectDurations.topclose.delay : 0,
                                afterFinish: function () {
                                        this.topcloseButtonImage.store("visible", a)
                                }.bind(this)
                        })
                },
                getScrollDimensions: function () {
                        var a = {};
                        return $w("width height").each(function (b) {
                                var c = b.capitalize(),
                                        d = document.documentElement;
                                a[b] = Prototype.Browser.IE ? [d["offset" + c], d["scroll" + c]].max() : Prototype.Browser.WebKit ? document.body["scroll" + c] : d["scroll" + c]
                        }), a
                },
                maxOverlay: function () {
                        m && this.overlay.setStyle(h(this.getScrollDimensions()))
                },
                delegateClose: function () {
                        return function (a) {
                                this.view && this.view.options && a.findElement(".lv_Close, .lv_topButtons .lv_Button, .lv_Loading, .lv_controllerClose" + (this.view.options.overlayClose ? ", #lv_overlay" : "")) && this.hide()
                        }
                }(),
                toggleSideButton: function (a) {
                        var b = a.target.side,
                                c = this.sideDimensions.width,
                                c = {
                                        marginLeft: (a.type == "mouseover" ? 0 : b == "prev" ? c : -1 * c) + "px"
                                };
                        this.sideEffect || (this.sideEffect = {}), this.sideEffect[b] && Effect.Queues.get("lightview_side" + b).remove(this.sideEffect[b]), this.sideEffect[b] = new Effect.Morph(this[b + "ButtonImage"], {
                                style: c,
                                duration: this.options.effectDurations.sideButtons[a.type == "mouseout" ? "hide" : "show"],
                                queue: {
                                        scope: "lightview_side" + b,
                                        limit: 1
                                },
                                delay: a.type == "mouseout" ? .1 : 0
                        })
                },
                getSurroundingIndexes: function () {
                        if (this.views) {
                                var a = this.position,
                                        b = this.views.length;
                                return {
                                        previous: a <= 0 ? b - 1 : a - 1,
                                        next: a >= b - 1 ? 0 : a + 1
                                }
                        }
                },
                createCorner: function (a, b, c) {
                        var c = c || this.options,
                                d = c.radius,
                                e = c.border;
                        position = {
                                top: b.charAt(0) == "t",
                                left: b.charAt(1) == "l"
                        }, n ? (b = new Element("canvas", {
                                className: "cornerCanvas" + b.capitalize(),
                                width: e + "px",
                                height: e + "px"
                        }), b.setStyle("float:left"), a.insert(b), a = b.getContext("2d"), a.fillStyle = c.backgroundColor, a.arc(position.left ? d : e - d, position.top ? d : e - d, d, 0, Math.PI * 2, !0), a.fill(), a.fillRect(position.left ? d : 0, 0, e - d, e), a.fillRect(0, position.top ? d : 0, e, e - d)) : (c = (new Element("ns_vml:roundrect", {
                                fillcolor: c.backgroundColor,
                                strokeWeight: "1px",
                                strokeColor: c.backgroundColor,
                                arcSize: (d / e * .5).toFixed(2)
                        })).setStyle({
                                width: 2 * e - 1 + "px",
                                height: 2 * e - 1 + "px",
                                position: "absolute",
                                left: (position.left ? 0 : -1 * e) + "px",
                                top: (position.top ? 0 : -1 * e) + "px"
                        }), a.insert(c), c.outerHTML = c.outerHTML)
                },
                hideOverlapping: function () {
                        function a() {
                                return $$("object, embed, select")
                        }
                        return Prototype.Browser.IE && document.documentMode >= 8 && (a = function () {
                                return document.querySelectorAll("object, embed, select")
                        }), function () {
                                if (!this.preventingOverlap) {
                                        var b = a();
                                        this.overlappingRestore = [];
                                        for (var c = 0, d = b.length; c < d; c++) {
                                                var e = b[c];
                                                this.overlappingRestore.push({
                                                        element: e,
                                                        visibility: e.style.visibility
                                                }), e.style.visibility = "hidden"
                                        }
                                        this.preventingOverlap = !0
                                }
                        }
                }(),
                showOverlapping: function () {
                        this.overlappingRestore.each(function (a) {
                                a.element.style.visibility = a.visibility
                        }), delete this.overlappingRestore, this.preventingOverlap = !1
                },
                getInnerDimensions: function () {
                        return {
                                width: this.innerDimensions.width,
                                height: this.innerDimensions.height + this.menubarDimensions.height
                        }
                },
                getOuterDimensions: function () {
                        var a = this.getInnerDimensions(),
                                b = 2 * this.border;
                        return {
                                width: a.width + b,
                                height: a.height + b
                        }
                },
                getBounds: function () {
                        var a = 2 * this.sideDimensions.height + 21,
                                b = this.getViewportDimensions();
                        return {
                                width: b.width - a,
                                height: b.height - a
                        }
                },
                getViewportDimensions: function () {
                        var a = document.viewport.getDimensions();
                        return this.controller && this.controller.visible() && this.views && this.views.length > 1 && (a.height -= this.controllerOffset), a
                }
        }), function () {
                function a(a, b) {
                        this.view && a(b)
                }
                $w("fillMenuBar insertContent").each(function (b) {
                        this[b] = this[b].wrap(a)
                }, Lightview)
        }(), Object.extend(Lightview, {
                enableKeyboardNavigation: function () {
                        this.view.options.keyboard && (this.keyboardEvent = this.keyboardDown.bindAsEventListener(this), document.observe("keydown", this.keyboardEvent))
                },
                disableKeyboardNavigation: function () {
                        this.keyboardEvent && document.stopObserving("keydown", this.keyboardEvent)
                },
                keyboardDown: function (a) {
                        var b = String.fromCharCode(a.keyCode).toLowerCase(),
                                c = a.keyCode,
                                d = (this.view.isGallery() || this.isSetGallery) && !this.resizing,
                                e = this.view.options.slideshow;
                        this.view.isMedia() ? (a.stop(), a = c == Event.KEY_ESC || ["x", "c"].member(b) ? "hide" : c == 37 && d && (this.options.cyclic || this.position != 0) ? "previous" : c == 39 && d && (this.options.cyclic || this.getSurroundingIndexes().next != 0) ? "next" : b == "p" && e && d ? "startSlideshow" : b == "s" && e && d ? "stopSlideshow" : null, b != "s" && this.stopSlideshow()) : a = c == Event.KEY_ESC ? "hide" : null, a && this[a](), d && (c == Event.KEY_HOME && this.views.first() != this.view && this.show(0), c == Event.KEY_END && this.views.last() != this.view && this.show(this.views.length - 1))
                }
        }), Lightview.afterShow = Lightview.afterShow.wrap(function (a, b) {
                this.enableKeyboardNavigation(), a(b)
        }), Object.extend(Lightview, {
                extendSet: function (a) {
                        (a = this.getSet(a)) && a._each(Lightview.Extend)
                },
                preloadSurroundingImages: function () {
                        if (this.views.length != 0) {
                                var a = this.getSurroundingIndexes();
                                this.preloadFromSet([a.next, a.previous])
                        }
                },
                preloadFromSet: function (a) {
                        var b = this.views && this.views.member(a) || Object.isArray(a) ? this.views : a.rel ? this.getViews(a.rel) : null;
                        b && $A(Object.isNumber(a) ? [a] : a.type ? [b.indexOf(a)] : a).uniq().each(function (a) {
                                this.preloadImageDimensions(b[a])
                        }, this)
                },
                setPreloadedDimensions: function (a, b) {
                        a.preloadedDimensions = {
                                width: b.width,
                                height: b.height
                        }
                },
                preloadImageDimensions: function (a) {
                        if (!a.preloadedDimensions && !a.isPreloading && a.href) {
                                var b = new Image;
                                b.onload = function () {
                                        b.onload = Prototype.emptyFunction, a.isPreloading = null, this.setPreloadedDimensions(a, b)
                                }.bind(this), a.isPreloading = !0, b.src = a.href
                        }
                },
                preloadImageHover: function (a) {
                        (a = a._view) && a.preloadedDimensions || a.isPreloading || !a.isImage() || this.preloadImageDimensions(a)
                }
        }), Element.addMethods({
                setPngBackground: function (a, b, c) {
                        return a = $(a), c = Object.extend({
                                align: "top left",
                                repeat: "no-repeat",
                                sizingMethod: "scale",
                                backgroundColor: ""
                        }, c || {}), a.setStyle(k ? {
                                filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + b + "'', sizingMethod='" + c.sizingMethod + "')"
                        } : {
                                background: c.backgroundColor + " url(" + b + ") " + c.align + " " + c.repeat
                        }), a
                }
        }), Object.extend(Lightview, {
                detectType: function (a) {
                        var b;
                        return $w("flash image iframe quicktime").each(function (c) {
                                RegExp("\\.(" + this.typeExtensions[c].replace(/\s+/g, "|") + ")(\\?.*)?", "i").test(a) && (b = c)
                        }.bind(this)), b ? b : a.startsWith("#") ? "inline" : document.domain && document.domain != a.replace(/(^.*\/\/)|(:.*)|(\/.*)/g, "") ? "iframe" : "image"
                },
                detectExtension: function (a) {
                        return (a = a.gsub(/\?.*/, "").match(/\.([^.]{3,4})$/)) ? a[1] : null
                },
                createHTML: function (a) {
                        var b = "<" + a.tag,
                                c;
                        for (c in a)["children", "html", "tag"].member(c) || (b += " " + c + '="' + a[c] + '"');
                        return /^(?:area|base|basefont|br|col|frame|hr|img|input|link|isindex|meta|param|range|spacer|wbr)$/i.test(a.tag) ? b += "/>" : (b += ">", a.children && a.children.each(function (a) {
                                b += this.createHTML(a)
                        }.bind(this)), a.html && (b += a.html), b += "</" + a.tag + ">"), b
                }
        }), function () {
                document.observe("dom:loaded", function () {
                        function a(a) {
                                var c = !1;
                                if (b) c = $A(navigator.plugins).pluck("name").join(",").indexOf(a) >= 0;
                                else try {
                                        c = new ActiveXObject(a)
                                } catch (d) {}
                                return !!c
                        }
                        var b = navigator.plugins && navigator.plugins.length;
                        window.Lightview.Plugin = b ? {
                                flash: a("Shockwave Flash"),
                                quicktime: a("QuickTime")
                        } : {
                                flash: a("ShockwaveFlash.ShockwaveFlash"),
                                quicktime: a("QuickTime.QuickTime")
                        }
                })
        }(), Lightview.View = Class.create({
                initialize: function (a) {
                        if (!a._view) {
                                var b = Object.isElement(a);
                                b && !a._view && (a._view = this, a.title) && (a._view._title = a.title, Lightview.options.removeTitles && a.setAttribute("title", "")), this.href = b ? a.getAttribute("href") : a.href, this.href.indexOf("#") >= 0 && (this.href = this.href.substr(this.href.indexOf("#")));
                                var c = b ? a.getAttribute("rel") : a.rel;
                                if (c) if (this.rel = c, c.startsWith("gallery")) this.type = "gallery";
                                else if (c.startsWith("set")) if (c.include("][")) {
                                        var c = c.split("]["),
                                                d = c[1].match(/([a-zA-Z]*)/)[1];
                                        d && (this.type = d, c = c[0] + "]", a.writeAttribute("rel", c), this.rel = c)
                                } else this.type = Lightview.detectType(this.href);
                                else this.type = c;
                                else this.rel = this.type = Lightview.detectType(this.href);
                                $w("ajax flash gallery iframe image inline quicktime external media set")._each(function (a) {
                                        var b = a.capitalize(),
                                                c = a.toLowerCase();
                                        "image gallery media external set".indexOf(a) < 0 && (this["is" + b] = function () {
                                                return this.type == c
                                        }.bind(this))
                                }.bind(this)), b && a._view._title ? (a = a._view._title.split(Lightview.options.titleSplit).invoke("strip"), a[0] && (this.title = a[0]), a[1] && (this.caption = a[1]), this.options = (a = a[2]) && Object.isString(a) ? eval("({" + a + "})") : {}) : (this.title = a.title, this.caption = a.caption, this.options = a.options || {}), this.options.ajaxOptions && (this.options.ajax = Object.clone(this.options.ajaxOptions), delete this.options.ajaxOptions)
                        }
                },
                isGallery: function () {
                        return this.type.startsWith("gallery")
                },
                isSet: function () {
                        return this.rel.startsWith("set")
                },
                isImage: function () {
                        return this.isGallery() || this.type == "image"
                },
                isExternal: function () {
                        return "iframe inline ajax".indexOf(this.type) >= 0
                },
                isMedia: function () {
                        return !this.isExternal()
                }
        }), Lightview.Extend = function (a) {
                var b = $(a);
                return new Lightview.View(a), b
        }, function () {
                function a(a) {
                        var b = a.findElement("a[class~=lightview], area[class~=lightview]");
                        b && (a.stop(), this.Extend(b), this.show(b))
                }

                function b(a) {
                        (a = a.findElement("a[class~=lightview], area[class~=lightview]")) && this.Extend(a)
                }

                function c(a) {
                        var b;
                        b = a.target;
                        var c = a.type;
                        (a = a.currentTarget) && a.tagName && (c === "load" || c === "error" || c === "click" && a.tagName.toLowerCase() === "input" && a.type === "radio") && (b = a), b.nodeType == Node.TEXT_NODE && (b = b.parentNode);
                        if (c = b) b ? (c = b.className, c = c.length > 0 && (c == "lightview" || /(^|\s)lightview(\s|$)/.test(c))) : c = void 0;
                        c && this.Extend(b)
                }
                document.observe("lightview:loaded", function () {
                        $(document.body).observe("click", a.bindAsEventListener(Lightview)), Lightview.options.removeTitles && Prototype.Browser.IE && document.documentMode >= 8 ? $(document.body).observe("mouseover", c.bindAsEventListener(Lightview)) : $(document.body).observe("mouseover", b.bindAsEventListener(Lightview))
                })
        }(), Object.extend(Lightview, {
                buildController: function () {
                        var a = this.options.controller,
                                b = a.border;
                        $(document.body).insert(this.controller = (new Element("div", {
                                id: "lightviewController"
                        })).setStyle({
                                zIndex: this.options.zIndex + 1,
                                marginBottom: a.margin + "px",
                                position: "absolute",
                                visibility: "hidden"
                        }).insert(this.controllerTop = (new Element("div", {
                                className: "lv_controllerTop"
                        })).insert((new Element("div", {
                                className: "lv_controllerCornerWrapper lv_controllerCornerWrapperTopLeft"
                        })).setStyle("margin-left: " + b + "px").insert(new Element("div", {
                                className: "lv_Corner"
                        }))).insert((new Element("div", {
                                className: "lv_controllerBetweenCorners"
                        })).setStyle({
                                margin: "0 " + b + "px",
                                height: b + "px"
                        })).insert((new Element("div", {
                                className: "lv_controllerCornerWrapper lv_controllerCornerWrapperTopRight"
                        })).setStyle("margin-left: -" + b + "px").insert(new Element("div", {
                                className: "lv_Corner"
                        })))).insert(this.controllerMiddle = (new Element("div", {
                                className: "lv_controllerMiddle clearfix"
                        })).insert(this.controllerCenter = (new Element("div", {
                                className: "lv_controllerCenter"
                        })).setStyle("margin: 0 " + b + "px").insert((new Element("div", {
                                className: "lv_controllerSetNumber"
                        })).insert(this.setNumber = new Element("div"))).insert((new Element("div", {
                                className: "lv_ButtonWrapper lv_controllerPrev"
                        })).insert(this.controllerPrev = (new Element("div", {
                                className: "lv_Button"
                        })).setPngBackground(this.images + "controller_prev.png", {
                                backgroundColor: a.backgroundColor
                        }))).insert((new Element("div", {
                                className: "lv_ButtonWrapper lv_controllerNext"
                        })).insert(this.controllerNext = (new Element("div", {
                                className: "lv_Button"
                        })).setPngBackground(this.images + "controller_next.png", {
                                backgroundColor: a.backgroundColor
                        }))).insert((new Element("div", {
                                className: "lv_ButtonWrapper lv_controllerSlideshow"
                        })).insert(this.controllerSlideshow = (new Element("div", {
                                className: "lv_Button"
                        })).setPngBackground(this.images + "controller_slideshow_play.png", {
                                backgroundColor: a.backgroundColor
                        }))).insert((new Element("div", {
                                className: "lv_ButtonWrapper lv_controllerClose"
                        })).insert(this.controllerClose = (new Element("div", {
                                className: "lv_Button"
                        })).setPngBackground(this.images + "controller_close.png", {
                                backgroundColor: a.backgroundColor
                        }))))).insert(this.controllerBottom = (new Element("div", {
                                className: "lv_controllerBottom"
                        })).insert((new Element("div", {
                                className: "lv_controllerCornerWrapper lv_controllerCornerWrapperBottomLeft"
                        })).setStyle("margin-left: " + b + "px").insert(new Element("div", {
                                className: "lv_Corner"
                        }))).insert((new Element("div", {
                                className: "lv_controllerBetweenCorners"
                        })).setStyle({
                                margin: "0 " + b + "px",
                                height: b + "px"
                        })).insert((new Element("div", {
                                className: "lv_controllerCornerWrapper lv_controllerCornerWrapperBottomRight"
                        })).setStyle("margin-left: -" + b + "px").insert(new Element("div", {
                                className: "lv_Corner"
                        }))))), $w("prev next").each(function (a) {
                                this["controller" + a.capitalize()].prevnext = a
                        }, this), l && (this.controller.hide = function () {
                                return this.setStyle("left:-9500px;top:-9500px;visibility:hidden;"), this
                        }, this.controller.show = function () {
                                return this.setStyle("visibility:visible"), this
                        }, this.controller.visible = function () {
                                return this.getStyle("visibility") == "visible" && parseFloat(this.getStyle("top").replace("px", "")) > -9500
                        }), this.controller.select(".lv_ButtonWrapper div").invoke("setStyle", h(this.controllerButtonDimensions));
                        var c = this.controller.select(".lv_Corner");
                        $w("tl tr bl br").each(function (b, d) {
                                a.radius > 0 ? this.createCorner(c[d], b, a) : c[d].insert(new Element("div", {
                                        className: "lv_Fill"
                                })), c[d].setStyle({
                                        width: a.border + "px",
                                        height: a.border + "px"
                                }).addClassName("lv_Corner" + b.capitalize())
                        }, this), this.controller.down(".lv_controllerMiddle").setStyle("width:100%;"), this.controller.setStyle(k ? {
                                position: "absolute",
                                top: "auto",
                                left: ""
                        } : {
                                position: "fixed",
                                top: "auto",
                                left: "50%"
                        }), this.controller.select(".lv_controllerBetweenCorners", ".lv_controllerMiddle", ".lv_Button", ".lv_Fill").invoke("setStyle", {
                                backgroundColor: a.backgroundColor
                        }), this.setNumber.update((new Template(a.setNumberTemplate)).evaluate({
                                position: 999,
                                total: 999
                        })), this.setNumber.setStyle({
                                width: this.setNumber.getWidth() + "px",
                                height: this.controllerCenter.getHeight() + "px"
                        }), this._fixateController(), this.setNumber.update(""), this.controller.hide().setStyle("visibility:visible"), this.addObservers(), this._lightviewLoadedEvent()
                },
                _fixateController: function () {
                        var a, b, c = this.options.controller,
                                d = c.border;
                        k ? (a = this.controllerCenter.getDimensions(), b = a.width + 2 * d, this.controllerCenter.setStyle({
                                width: a.width + "px",
                                margin: 0
                        }), this.controllerMiddle.setStyle("width:auto;"), this.controllerCenter.setStyle({
                                paddingLeft: d + "px"
                        }), this.controllerMiddle.setStyle({
                                width: b + "px"
                        }), $w("top bottom").each(function (a) {
                                this["controller" + a.capitalize()].setStyle({
                                        width: b + "px"
                                })
                        }, this), this.controller.setStyle("margin-left:-" + (b / 2).round() + "px")) : (this.controllerMiddle.setStyle("width:auto"), a = this.controllerMiddle.getDimensions(), this.setNumber.up().setStyle({
                                lineHeight: a.height + "px",
                                width: this.setNumber.getDimensions().width + "px"
                        }), this.controller.setStyle({
                                width: a.width + "px",
                                marginLeft: 0 - (a.width / 2).round() + "px"
                        }), this.controllerMiddle.setStyle({
                                width: a.width + "px"
                        }), $w("top bottom").each(function (b) {
                                this["controller" + b.capitalize()].setStyle({
                                        width: a.width + "px"
                                })
                        }, this)), this._controllerOffset = c.margin + a.height + 2 * d, this._controllerHeight = this.controller.getHeight(), this.setNumber.setStyle({
                                lineHeight: a.height + "px"
                        })
                }
        }), Lightview.buildController = Lightview.buildController.wrap(function (a, b) {
                var c = new Image;
                c.onload = function () {
                        c.onload = Prototype.emptyFunction, this.controllerButtonDimensions = {
                                width: c.width,
                                height: c.height
                        }, a(b)
                }.bind(this), c.src = this.images + "controller_prev.png", (new Image).src = this.images + "controller_slideshow_stop.png"
        }), Lightview.build = Lightview.build.wrap(function (a, b) {
                a(b), this.buildController()
        }), Lightview.hide = Lightview.hide.wrap(function (a, b) {
                this.view && this.view.isSet() && (this.controller.hide(), this.setNumber.update("")), a(b)
        })
})(), Lightview.load(), document.observe("dom:loaded", Lightview.start.bind(Lightview))