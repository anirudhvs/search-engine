#!/bin/bash
t1=$(($(date +%s%N)/1000000))
node $1
t2=$(($(date +%s%N)/1000000))
echo $(($t2-$t1))