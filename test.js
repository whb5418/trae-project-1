class Game2048Test {
    constructor() {
        this.testResults = [];
    }
    
    assert(condition, message) {
        if (condition) {
            this.testResults.push({ status: 'PASS', message });
            console.log(`✅ PASS: ${message}`);
        } else {
            this.testResults.push({ status: 'FAIL', message });
            console.log(`❌ FAIL: ${message}`);
        }
    }
    
    runAllTests() {
        console.log('\n=== 2048 游戏测试套件 ===\n');
        
        this.testBoardInitialization();
        this.testTileAddition();
        this.testMoveLeft();
        this.testMoveRight();
        this.testMoveUp();
        this.testMoveDown();
        this.testTileMerge();
        this.testScoreCalculation();
        this.testWinCondition();
        this.testGameOverCondition();
        
        this.printSummary();
    }
    
    testBoardInitialization() {
        const game = new Game2048();
        this.assert(game.board.length === 4, '棋盘行数应为4');
        this.assert(game.board[0].length === 4, '棋盘列数应为4');
        this.assert(game.score === 0, '初始分数应为0');
        
        let emptyCells = 0;
        let nonEmptyCells = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (game.board[i][j] === 0) emptyCells++;
                else nonEmptyCells++;
            }
        }
        this.assert(nonEmptyCells === 2, '初始应有2个方块');
        this.assert(emptyCells === 14, '初始应有14个空格');
    }
    
    testTileAddition() {
        const game = new Game2048();
        const initialBoard = game.board.map(row => [...row]);
        
        game.addRandomTile();
        
        let newCells = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (initialBoard[i][j] === 0 && game.board[i][j] !== 0) {
                    newCells++;
                }
            }
        }
        this.assert(newCells === 1, '每次应只添加一个方块');
    }
    
    testMoveLeft() {
        const game = new Game2048();
        game.board = [
            [2, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        game.move('left');
        
        this.assert(game.board[0][0] === 2, '方块应左移到第一列');
        this.assert(game.board[0][1] === 0, '原位置应为空');
    }
    
    testMoveRight() {
        const game = new Game2048();
        game.board = [
            [0, 0, 0, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        game.move('right');
        
        this.assert(game.board[0][3] === 2, '方块应保持在最右列');
    }
    
    testMoveUp() {
        const game = new Game2048();
        game.board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 0, 0]
        ];
        
        game.move('up');
        
        this.assert(game.board[0][0] === 2, '方块应上移到第一行');
    }
    
    testMoveDown() {
        const game = new Game2048();
        game.board = [
            [2, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        game.move('down');
        
        this.assert(game.board[3][0] === 2, '方块应下移到最后一行');
    }
    
    testTileMerge() {
        const game = new Game2048();
        game.board = [
            [2, 2, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        game.move('left');
        
        this.assert(game.board[0][0] === 4, '两个2应合并为4');
        this.assert(game.board[0][1] === 0, '合并后原位置应为空');
    }
    
    testScoreCalculation() {
        const game = new Game2048();
        game.board = [
            [2, 2, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        game.move('left');
        
        this.assert(game.score === 4, '合并两个2应得4分');
    }
    
    testWinCondition() {
        const game = new Game2048();
        game.board = [
            [1024, 1024, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        
        game.move('left');
        
        this.assert(game.board[0][0] === 2048, '合并后应得到2048');
        this.assert(game.hasWon === true, '达到2048应触发胜利');
    }
    
    testGameOverCondition() {
        const game = new Game2048();
        game.board = [
            [2, 4, 8, 16],
            [16, 8, 4, 2],
            [2, 4, 8, 16],
            [16, 8, 4, 2]
        ];
        
        const canMove = game.canMove();
        this.assert(canMove === false, '无法移动时游戏应结束');
    }
    
    printSummary() {
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        
        console.log('\n=== 测试结果汇总 ===');
        console.log(`通过: ${passed} 个`);
        console.log(`失败: ${failed} 个`);
        console.log(`总测试数: ${this.testResults.length} 个`);
        
        if (failed === 0) {
            console.log('\n🎉 所有测试通过！');
        } else {
            console.log('\n⚠️ 有测试失败，请检查代码');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const test = new Game2048Test();
    test.runAllTests();
});