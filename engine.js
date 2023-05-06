
let alert_shown = false;

function GameSettings() {
    this.blockColorIdle = '#efefef';
    this.blockColorActive = '#c0c0c0';
    this.blockSizePx = 10;
    this.fps = 20;
    this.refreshEvery = 1 / this.fps * 1000;
    this.difficultyLevel = 1;
}

function Block(width, height, left, top) {
    this.init = () => {
        this.node = document.createElement('i');
        this.node.classList.add('block');
        this.node.style.width = width + 'px';
        this.node.style.height = height + 'px';
        this.node.style.top = top + 'px';
        this.node.style.left = left + 'px';
        this.node.style.position = 'absolute';
        this.paint();
    }
    this.paint = () => {
        document.body.appendChild(this.node);
    }
    this.setColor = (colorHex) => {
        this.node.style.backgroundColor = colorHex;
    }
    this.getColor = () => {
        return this.node.style.backgroundColor;
    }
    this.init();
}
function Stage(width, height, left, top, gapX, gapY) {
    this.width = width;
    this.height = height;
    this.left = left;
    this.top = top;
    this.gapX = gapX;
    this.gapY = gapY;
    this.blocks = [];
    // this.shapes = [];
    this.shape = null;
    this.shapes = [];
    this.settings = new GameSettings();
    this.block_sz = this.settings.blockSizePx;
    this.shapeSize = [0, 0];
    this.shapePosition = [0, 0];
    this.draw = () => {
        for (let c = 0; c < this.width; c++) {
            this.blocks[c] = [];
            for (let r = 0; r < this.height; r++) {
                this.blocks[c][r] = new Block(
                    this.block_sz,
                    this.block_sz,
                    this.left + (c * this.block_sz * this.gapX),
                    this.top + r * this.block_sz * this.gapY
                );
                this.blocks[c][r].setColor(this.settings.blockColorIdle);
            }
        }

        addEventListener('keydown', this.onMove);
    }
    this.turnOn = (x, y) => {
        this.blocks[x][y].setColor(this.settings.blockColorActive);
    }
    this.turnOff = (x, y) => {
        this.blocks[x][y].setColor(this.settings.blockColorIdle);
    }
    this.turnOff = (x, y) => {
        this.blocks[x][y].setColor(this.settings.blockColorIdle);
    }
    this.isOff = (x, y) => {
        return this.blocks[x][y].getColor() === this.settings.blockColorIdle;
    }
    this.clear = () => {
        for (let c = 0; c < this.width; c++) {
            for (let r = 0; r < this.height; r++) {

                this.turnOff(c, r);
            }
        }
    }
    this.add = (shape, position) => {
        this.shape = shape;
        this.shapes.push({ shape, position });
        /**
         * columns x rows
         */
        this.shapeSize = [
            shape[0].length,
            shape.length,
        ];
        /**
         * rows x columns
         */
        this.shapePosition = position;
    }
    this.paint = (shapeMatrix) => {
        for (let c = 0; c < this.shapeSize[0]; c++) {
            for (let r = 0; r < this.shapeSize[1]; r++) {
                if (shapeMatrix[r][c] === '*') {
                    this.turnOn(this.shapePosition[1] + c, this.shapePosition[0] + r);
                }
                // else {
                //     this.turnOff(this.shapePosition[1] + c, this.shapePosition[0] + r);
                // }
            }
        }
    }
    this.unpaint = (shapeMatrix) => {
        // this.clear();
        return;
        for (let c = 0; c < this.shapeSize[0]; c++) {
            for (let r = 0; r < this.shapeSize[1]; r++) {
                if (!this.isOff(this.shapePosition[1] + c, this.shapePosition[0] + r)) {
                    this.turnOff(this.shapePosition[1] + c, this.shapePosition[0] + r);
                }
            }
        }
    }

    this.collides = () => {
        // return this
    }

    this.getEdges = () => {
        let blocks = []
        for (let c = 0; c < this.shapeSize[0]; c++) {
            for (let r = 0; r < this.shapeSize[1]; r++) {
                let absX = this.shapePosition[1] + c;
                let absY = this.shapePosition[0] + r;
                if (
                    absY == 0 
                    this.blocks[absX][absY])
            }
        }
        return blocks;
    }

    this.moveDown = () => {
        if (this.shapePosition[0] + this.shapeSize[1] < this.height) {
            // for (let c = 0; c < this.shapeSize[0]; c++)
            //     this.turnOff(this.shapePosition[1] + c, this.shapePosition[0])
            this.shapePosition[0]++;
        } else {
            this.onSpawnRandomBlock();
        }
    }
    this.moveRight = () => {
        if (this.shapePosition[1] + this.shapeSize[0] < this.width) {
            for (let r = 0; r < this.shapeSize[1]; r++)
                this.turnOff(this.shapePosition[1], this.shapePosition[0] + r)
            this.shapePosition[1]++;
        }
    }
    this.moveLeft = () => {
        if (this.shapePosition[1] > 0) {
            for (let r = 0; r < this.shapeSize[1]; r++)
                this.turnOff(this.shapePosition[1] + this.shapeSize[0] - 1, this.shapePosition[0] + r)
            this.shapePosition[1]--;
        }
    }
    //_UTILS
    this.randomInRange = (min, max) => {
        return Math.trunc(Math.random() * (max - min) + min)
    }
    //_EVENTS
    this.onSpawnRandomBlock = () => {
        // console.log("onSpawnRandomBlock");
        let randomShapeIndex = this.randomInRange(0, Shape._shapes.length);
        let randomShape = Shape._shapes[randomShapeIndex];
        let randomColumnIndex = this.randomInRange(0, this.width - randomShape[0].length);
        this.add(randomShape, [0, randomColumnIndex]);
    }
    this.onMove = (e) => {
        switch (e.key) {
            case "ArrowLeft":
                this.moveLeft();
                break;
            case "ArrowRight":
                this.moveRight();
                break;
            case "ArrowDown":
                this.moveDown();
                break;
        }
        document.title = e.key === "ArrowLeft";
    }

    this.tick = () => {
        setInterval(() => {
            this.moveDown();
        }, 1 / this.settings.difficultyLevel * 1000);

        setInterval(() => {
            this.unpaint(this.shape)
            this.paint(this.shape)
        }, this.settings.refreshEvery);
    }
}

function Shape() { }

Shape._shapes = [
    // [
    //     '***',
    //     '*  ',
    //     '*  ',
    // ],
    [
        '* *',
        '* *',
        '***',
    ],
    // [
    //     '***',
    //     '***',
    //     '***',
    // ],
    [
        '*  ',
        '***',
        '  *',
    ],
    // [
    //     '**  ',
    //     '*** ',
    //     '  **',
    // ],
    // [
    //     '  *  ',
    //     ' *** ',
    //     '*****',
    //     ' *** ',
    //     '  *  ',
    // ],
];


Shape.GetById = (id) => {
    return Shape._shapes[id];
}

let stage = null;
window.onload = () => {
    stage = new Stage(30, 30, 5, 10, 1.1, 1.1);
    stage.draw();
    let shape = Shape.GetById(0);
    let position = [0, 5]; // [row,col]
    stage.add(shape, position);
    stage.paint(shape);
    // stage.tick();
}