/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';

import keys from './components/keys';
import axios from 'axios';

let currentRow = 0
let currentTile = 0
let gameOver = false
const date = new Date()


const keyContainer = document.querySelector('.key-container')
const gameContainer = document.querySelector('.game-container')

const gameRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

const colorRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

// creating keyboard
keys.forEach(key => {
    const buttonTile = document.createElement('button')
    keyContainer.append(buttonTile)
    buttonTile.setAttribute('id', key)
    buttonTile.textContent = key
    buttonTile.addEventListener('click', () => onClick(key))
});

// creating game board
gameRows.forEach((row, rowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'row-' + rowIndex)
    gameContainer.append(rowElement)
    row.forEach((_rowTile, rowTileIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'row-' + rowIndex + '-tile-' + rowTileIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
})

document.getElementById('BACKSPACE').textContent = '⌫'


// clear localStorage if it's next day
if (date.toUTCString().slice(0,16) != window.localStorage.getItem('date').slice(0,16)) {
    window.localStorage.removeItem('currentTile')
    window.localStorage.removeItem('currentRow')
    window.localStorage.removeItem('gameRows')
    window.localStorage.removeItem('colorRows')
    window.localStorage.removeItem('gameOver')
    window.localStorage.removeItem('date')
}

// get data from localStorage and add data to board and keyboard


// listening to keypress
document.addEventListener('keydown', (event) => {
    if (event.repeat) return
    const keyUpperCase = event.key.toUpperCase()
    if (keys.includes(keyUpperCase)) {
        onClick(keyUpperCase)
    }
})

const shake = () => {
    const shakeRow = document.getElementById('row-' + currentRow)
    shakeRow.classList.remove('shake')
    shakeRow.offsetHeight
    shakeRow.classList.add('shake')
}

const onClick = (key) => {
    // if game is over this function is returned and nothing happens
    if (gameOver) return
    // if user inputs enter run sendRequest() if row isn't full shake row
    if (key === 'ENTER') {
        if (currentTile === 5 && gameOver === false) {
            sendRequest()
        } else {
            shake();
        }

    } 
    // if user inputs backspace clear current letter
    else if (key === 'BACKSPACE') {
        if (currentTile > 0) {
            currentTile --
            const currentTileElement = document.getElementById('row-' + currentRow + '-tile-' + currentTile)
            gameRows[currentRow][currentTile] = ''
            currentTileElement.textContent = ''
        } else {
            return
        }

    } 
    // if row isn't full add letter to current tile
    else {
        if (currentTile < 5) {
            const currentTileElement = document.getElementById('row-' + currentRow + '-tile-' + currentTile)
            gameRows[currentRow][currentTile] = key
            currentTileElement.textContent = key
            currentTile ++
        }
        else {
            return
        }
    }
}
console.log(window.localStorage.getItem('date').slice(0,16))

// send request to API
const sendRequest = () => {
    // post word from current row
    axios.post('/api/word',{
        'data': gameRows[currentRow]
    })
    .then((response) => {
        const data = response.data
        // if word isn't present in database shake current row
        if (!data[0]) {
            shake()
        } 
        // if word was correct
        else {
            let timer = 0
            let goodLettersCounter = 0
            data.forEach((val, key) => {
                // reveal if letters were correct in guessed word
                const tileToColor = document.getElementById('row-' + currentRow + '-tile-' + key)
                setTimeout(() => {
                    tileToColor.classList.add(val['color'])
                    tileToColor.classList.add('flip')
                }, timer);
                timer += 500
                colorRows[currentRow][key] = val['color']
                // add colors to keyboard's letters
                const keyboardLetter = document.getElementById(gameRows[currentRow][key])
                keyboardLetter.classList.add(val['color'])
                keyboardLetter.classList.add('flip')
                if (val['color'] === 'green') {
                    goodLettersCounter++
                }
            })

            // if all letters were "green" game is over and user can't input more
            if (goodLettersCounter === 5) {
                gameOver = true
                addToLocaStorage()
                return
            }
            // reset letter position and increment row
            goodLettersCounter = 0
            currentRow++
            currentTile = 0
            addToLocaStorage()
        }
        // if it's last row game is over and user lost
        if (currentRow === 5) {
            gameOver = true
            return
        }
    })

}


const addToLocaStorage = () => {
    window.localStorage.setItem('currentTile', currentTile)
    window.localStorage.setItem('currentRow', currentRow)
    window.localStorage.setItem('gameRows', JSON.stringify(gameRows))
    window.localStorage.setItem('colorRows', JSON.stringify(colorRows))
    window.localStorage.setItem('gameOver', gameOver)
    window.localStorage.setItem('date', date.toUTCString())
}