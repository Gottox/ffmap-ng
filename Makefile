D3_VERSION = 3.5.4
OBOE_VERSION = 2.1.1
FETCH_TOOL = wget -O- -q
#FETCH_TOOL = curl
PUBLIC = public

all: $(PUBLIC)/index.html $(PUBLIC)/script.js $(PUBLIC)/img

clean:
	rm -r $(PUBLIC) oboe-$(OBOE_VERSION).js d3-$(D3_VERSION).js || true

oboe-$(OBOE_VERSION).js:
	$(FETCH_TOOL) https://raw.github.com/jimhigson/oboe.js/v$(OBOE_VERSION)/dist/oboe-browser.min.js > $@

d3-$(D3_VERSION).js:
	$(FETCH_TOOL) https://github.com/mbostock/d3/raw/v$(D3_VERSION)/d3.min.js > $@

$(PUBLIC):
	mkdir -p $@

$(PUBLIC)/script.js: $(PUBLIC) d3-$(D3_VERSION).js oboe-$(OBOE_VERSION).js config.js ffmapng.js
	cat d3-$(D3_VERSION).js oboe-$(OBOE_VERSION).js config.js ffmapng.js > $@

$(PUBLIC)/index.html: $(PUBLIC) index.html
	cat index.html > $@

$(PUBLIC)/img: $(PUBLIC) img
	mkdir -p $(PUBLIC)/img
	for f in img/*; do cat $$f > $(PUBLIC)/$$f; done

jshint:
	jshint config.js ffmapng.js

jshint_watch:
	inotifyrun /bin/sh -c "clear; make jshint";

.PHONY: all clean

# vim:ft=make
