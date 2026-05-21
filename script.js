class Game2048 {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore') || '0');
        this.hasWon = false;
        this.gameOver = false;
        this.tileId = 0;
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.board = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
        this.score = 0;
        this.hasWon = false;
        this.gameOver = false;
        this.tileId = 0;
        
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        this.hideOverlays();
    }
    
    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.board[randomCell.row][randomCell.col] = value;
            this.addTileDisplay(randomCell.row, randomCell.col, value);
        }
    }
    
    addTileDisplay(row, col, value) {
        const tilesContainer = document.getElementById('tilesContainer');
        const tile = document.createElement('div');
        tile.className = `tile tile-${value} tile-new`;
        tile.id = `tile-${this.tileId++}`;
        tile.style.left = `${col * 95 + 15}px`;
        tile.style.top = `${row * 95 + 15}px`;
        tile.textContent = value;
        tilesContainer.appendChild(tile);
    }
    
    move(direction) {
        if (this.gameOver) return false;
        
        let moved = false;
        const vectors = {
            up: { row: -1, col: 0 },
            down: { row: 1, col: 0 },
            left: { row: 0, col: -1 },
            right: { row: 0, col: 1 }
        };
        
        const vector = vectors[direction];
        const traversals = this.buildTraversals(vector);
        
        const tilesContainer = document.getElementById('tilesContainer');
        tilesContainer.innerHTML = '';
        
        traversals.row.forEach(row => {
            traversals.col.forEach(col => {
                const cell = { row, col };
                const tile = this.board[row][col];
                
                if (tile !== 0) {
                    const positions = this.findFarthestPosition(cell, vector);
                    const next = positions.next;
                    
                    if (next.row !== cell.row || next.col !== cell.col) {
                        if (this.board[next.row][next.col] === tile) {
                            const newValue = tile * 2;
                            this.board[next.row][next.col] = newValue;
                            this.board[cell.row][cell.col] = 0;
                            
                            const mergedTile = document.createElement('div');
                            mergedTile.className = `tile tile-${newValue} tile-merged`;
                            mergedTile.id = `tile-${this.tileId++}`;
                            mergedTile.style.left = `${next.col * 95 + 15}px`;
                            mergedTile.style.top = `${next.row * 95 + 15}px`;
                            mergedTile.textContent = newValue;
                            tilesContainer.appendChild(mergedTile);
                            
                            this.score += newValue;
                            
                            if (newValue === 2048 && !this.hasWon) {
                                this.win();
                            }
                            
                            moved = true;
                        } else {
                            this.board[next.row][next.col] = tile;
                            this.board[cell.row][cell.col] = 0;
                            
                            const movedTile = document.createElement('div');
                            movedTile.className = `tile tile-${tile}`;
                            movedTile.id = `tile-${this.tileId++}`;
                            movedTile.style.left = `${next.col * 95 + 15}px`;
                            movedTile.style.top = `${next.row * 95 + 15}px`;
                            movedTile.textContent = tile;
                            tilesContainer.appendChild(movedTile);
                            
                            moved = true;
                        }
                    } else {
                        const stayTile = document.createElement('div');
                        stayTile.className = `tile tile-${tile}`;
                        stayTile.id = `tile-${this.tileId++}`;
                        stayTile.style.left = `${col * 95 + 15}px`;
                        stayTile.style.top = `${row * 95 + 15}px`;
                        stayTile.textContent = tile;
                        tilesContainer.appendChild(stayTile);
                    }
                }
            });
        });
        
        if (moved) {
            setTimeout(() => this.addRandomTile(), 100);
            this.updateDisplay();
            
            if (!this.canMove()) {
                this.gameOver = true;
                this.showGameOver();
            }
        }
        
        return moved;
    }
    
    buildTraversals(vector) {
        const traversals = { row: [], col: [] };
        
        for (let i = 0; i < this.size; i++) {
            traversals.row.push(i);
            traversals.col.push(i);
        }
        
        if (vector.row === 1) traversals.row.reverse();
        if (vector.col === 1) traversals.col.reverse();
        
        return traversals;
    }
    
    findFarthestPosition(cell, vector) {
        let previous;
        let current = { ...cell };
        
        do {
            previous = { ...current };
            current = {
                row: previous.row + vector.row,
                col: previous.col + vector.col
            };
        } while (this.withinBounds(current) && this.board[current.row][current.col] === 0);
        
        if (this.withinBounds(current) && this.board[current.row][current.col] === this.board[cell.row][cell.col]) {
            return { farthest: current, next: current };
        }
        
        return { farthest: previous, next: previous };
    }
    
    withinBounds(position) {
        return position.row >= 0 && position.row < this.size &&
               position.col >= 0 && position.col < this.size;
    }
    
    canMove() {
        if (this.hasEmptyCell()) return true;
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = this.board[i][j];
                
                if ((i < this.size - 1 && this.board[i + 1][j] === value) ||
                    (j < this.size - 1 && this.board[i][j + 1] === value)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    hasEmptyCell() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) return true;
            }
        }
        return false;
    }
    
    win() {
        this.hasWon = true;
        document.getElementById('winOverlay').classList.add('show');
    }
    
    continueGame() {
        document.getElementById('winOverlay').classList.remove('show');
    }
    
    showGameOver() {
        document.getElementById('finalScore').textContent = `最终得分: ${this.score}`;
        document.getElementById('gameOverOverlay').classList.add('show');
    }
    
    hideOverlays() {
        document.getElementById('gameOverOverlay').classList.remove('show');
        document.getElementById('winOverlay').classList.remove('show');
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore.toString());
        }
        
        document.getElementById('best').textContent = this.bestScore;
    }
    
    bindEvents() {
        document.getElementById('newGame').addEventListener('click', () => this.init());
        document.getElementById('restartBtn').addEventListener('click', () => this.init());
        document.getElementById('restartWinBtn').addEventListener('click', () => this.init());
        document.getElementById('continueBtn').addEventListener('click', () => this.continueGame());
        
        document.addEventListener('keydown', (e) => {
            if (this.gameOver && !this.hasWon) return;
            
            const keyMap = {
                38: 'up',
                40: 'down',
                37: 'left',
                39: 'right'
            };
            
            if (keyMap[e.keyCode]) {
                e.preventDefault();
                this.move(keyMap[e.keyCode]);
            }
        });
        
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.gameOver && !this.hasWon) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            const minSwipeDistance = 30;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > minSwipeDistance) {
                    this.move(dx > 0 ? 'right' : 'left');
                }
            } else {
                if (Math.abs(dy) > minSwipeDistance) {
                    this.move(dy > 0 ? 'down' : 'up');
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});