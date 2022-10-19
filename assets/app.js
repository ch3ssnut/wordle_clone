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
        tileElement.setAttribute('id', 'row-' + rowIndex + 'tile' + rowTileIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
})

const onClick = (key) => {
    console.log(key)
}