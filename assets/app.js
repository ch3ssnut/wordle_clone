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

keys.forEach(key => {
    const buttonTile = document.createElement('button')
    keyContainer.append(buttonTile)
    buttonTile.setAttribute('id', key)
    buttonTile.textContent = key
    buttonTile.addEventListener('click', () => onClick(key))
});

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

const onClick = (key) => {
    if (key === 'ENTER') {
        if (currentTile === 5 && gameOver === false) {
            sendRequest(gameRows[currentRow])
        } else {
            console.log('not full row enter')
        }

    } else if (key === 'BACKSPACE') {
        if (currentTile > 0) {
            currentTile --
            const currentTileElement = document.getElementById('row-' + currentRow + '-tile-' + currentTile)
            gameRows[currentRow][currentTile] = ''
            currentTileElement.textContent = ''
        } else {
            console.log('no letters backspace')
        }

    } else {
        if (currentTile < 5) {
            const currentTileElement = document.getElementById('row-' + currentRow + '-tile-' + currentTile)
            gameRows[currentRow][currentTile] = key
            currentTileElement.textContent = key
            currentTile ++
        }
        else {
            console.log("full row")
        }
    }
}

const sendRequest = () => {
    axios.post('/api/word',{
        'data': gameRows[currentRow]
    })
    .then((response) => {
        const data = response.data
        if (data === false) {
            console.log('no such word')
        } else {
            data.forEach((val, key) => {
                const tileToColor = document.getElementById('row-' + currentRow + '-tile-' + key)
                tileToColor.classList.add(val['color'])
            })
        }

        if (currentRow === 5) {
            gameOver = true
            return
        }
        currentRow++
        currentTile = 0
    })

}