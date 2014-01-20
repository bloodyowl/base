all:
	cp "routes/index.dist-json" "routes/index.json"
	cp "layout/index.dist-jade" "layout/index.jade"
	cp "scripts/index.dist-js" "scripts/index.js"
	cp "styles/index.dist-styl" "styles/index.styl"
	cp "i18n/index.dist-json" "i18n/index.json"