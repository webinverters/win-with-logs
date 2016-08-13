#!/bin/bash

if [ $# -lt 1 ] ; then

echo "Provide a commit message as the first parameter"

fi

make dist
git commit -am "$1"
gulp patch  # patch, release, feature
git push origin master --tags
npm publish
