#!/bin/bash
CURRENT_COMMIT=`git rev-parse --short HEAD`#$CI_COMMIT_SHORT_SHA
AUTHORS=`git shortlog -sn | cut -d$'\t' -f 2 | grep -v eutampieri | perl -p -e 'chomp if eof' | tr '\n' ',' | sed 's/,/, /'`
COPYRIGHT_DATES = `git shortlog --format=format:%cI | grep - | sort | cut -d '-' -f1 | uniq | tr -d ' ' | perl copyright.pl`

for f in *.html
    do sed -i "s/{{version}}/$CURRENT_COMMIT/g" $f
    sed -i "s/{{authors}}/$AUTHORS/g" $f
    sed -i "s/{{dates}}/$COPYRIGHT_DATES/g" $f
done