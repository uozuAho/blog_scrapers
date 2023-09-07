#!/bin/bash
#
# Gets all blog post links from codinghorror.com, page 2 onwards.
# Takes a bit of tweaking with a good text editor afterwards.
#
# todo later, maybe:
# - does it exit if curl gets a bad response?
set -e

page=2
while [ $page -le 286 ]
do
    echo $page
    curl -s "https://blog.codinghorror.com/page/$page/" \
        | grep -oE 'a href="/(.*?)"' \
        | grep -v '#discourse-comments' \
        >> codinghorror2.md
    ((page++))
    sleep 1
done
