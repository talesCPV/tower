#!/bin/bash
# Upload files to Github - git@github.com:talesCPV/tower.git

read -p "Are you sure to commit Tower to GitHub ? (Y/n)" -n 1 -r
echo 
if [[ $REPLY =~ ^[Yy]$ ]]
then

    git init

    git add assets/
    git add script.js
    git add style.css
    git add index.html
    git add teste.html
    git add commit.sh
    
    git commit -m "by_script"

#    git branch -M main
#    git remote add origin git@github.com:talesCPV/tower.git
    git remote set-url origin git@github.com:talesCPV/tower.git

    git push -u -f origin main

fi