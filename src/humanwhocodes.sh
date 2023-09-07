#!/bin/bash
#
# Gets all blog post links from humanwhocodes.com, page 2 onwards.
# Takes a bit of tweaking with a good text editor afterwards.
#
# todo later, maybe:
# - does it exit if curl gets a bad response?
set -e

page=2
while [ $page -le 68 ]
do
    echo $page
    curl -s "https://humanwhocodes.com/blog/$page/" \
        | grep -oE 'a href="/blog/.*?"' \
        >> human.md
    ((page++))
    sleep 1
done
