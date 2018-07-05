#!/bin/bash
cd
if [ -d "perfiles" ]; then rm -Rf perfiles; fi
mkdir perfiles
cd perfiles
#cd jsonFiles

touch etr{6300..6800}
tr=$\class
for file in $(ls)
do
cat <<EOF >$file
{
  "$tr": "org.example.mynetwork.Trader",
  "tradeId": "$file",
  "firstName": "sammy",
  "lastName": "joe"
}
EOF
mv ./$file ~/nodeExtract/jsonFiles/
done