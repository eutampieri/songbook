#!/bin/bash
CURRENT_COMMIT=`git rev-parse --short HEAD`#$CI_COMMIT_SHORT_SHA
AUTHORS=`git log | git shortlog -sn | cut -d$'\t' -f 2 | grep -v eutampieri | perl -p -e 'chomp if eof' | tr '\n' ',' | sed 's/,/, /'`
COPYRIGHT_DATES=`git log --format=format:%cI | grep - | sort | cut -d '-' -f1 | uniq | tr -d ' ' | perl tools/copyright.pl`

perl -v

echo "Current commit: $CURRENT_COMMIT"
echo "Authors: $AUTHORS"
echo "First and last commit years: $COPYRIGHT_DATES"

for f in *.html
    do echo "Processing $f..."
    sed -i "s/{{version}}/$CURRENT_COMMIT/g" $f
    sed -i "s/{{authors}}/$AUTHORS/g" $f
    sed -i "s/{{dates}}/$COPYRIGHT_DATES/g" $f
done

mv tools/make_index.py .