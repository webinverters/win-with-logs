ISTANBUL=node_modules/.bin/istanbul
UNIT_TEST_FILES=$(shell find . -name "*.spec.js" -not -path "./node_modules/*")
INT_TEST_FILES=$(shell find . -name "*.int.js" -not -path "./node_modules/*")
MOCHA_ARGS=--bail -u bdd -r test/config.js --timeout 30000
MOCHA=node ./node_modules/mocha/bin/mocha ${MOCHA_ARGS}

unit:
	${MOCHA} ${UNIT_TEST_FILES} ${ARGS}

int:
	${MOCHA} ${INT_TEST_FILES} ${ARGS}

api: #init
	DEBUG=* ${MOCHA} ./test/api/*.api.js ${ARGS}

dist:
	-mkdir dist
	browserify angular-index.js --standalone robust-logs > dist/angular-dist.js

browser:
	./node_modules/karma/bin/karma start --log-level debug --auto-watch --browsers Chrome_without_security

coverage:
	$(ISTANBUL) cover node_modules/.bin/_mocha -- ${MOCHA_ARGS} ${ARGS} ${UNIT_TEST_FILES} ${INT_TEST_FILES}

viewCov:
	open coverage/lcov-report/index.html

all: unit int

.PHONY: unit int coverage viewCov all dist browser
