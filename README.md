## Table of contents
* [General informations](#general-informations)
* [Technologies](#technologies)
* [Setup](#setup)

## General informations
This project is Wordle-clone. It uses PHP framework - Symfony for API backend and HTML/CSS/JS for frontend. User has 6 guesses to guess correct 
word. If letter is in the correct spot it turns green, if letter is correct but on the wrong spot it turns yellow and if letter is not present in the word it turns grey.
Javascript is used to handle game rendering and also to use local storage to store guesses taken in current day (resets daily UTC time zone). 

## Technologies
Project is created with:
* PHP 
* Symfony 
* JS 
* HTML/CSS

## Setup
To run this project, install locally using composer and npm: 

```
$ composer install
$ npm install
$ docker-compose up -d
$ symfony serve -d
```
For first use to populate database go to:
```
https://localhost:8000/populate
```

to change word go to: 

```
https://localhost:8000/word
```