#!/bin/bash

for i in $(find templates -name '*.html') # or whatever other pattern...
# for i in *.ts # or whatever other pattern...
do
  if ! grep -q Copyright $i
  then
    cat licencing.txt $i >$i.new && mv $i.new $i
  fi
done