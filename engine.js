let alert_shown = false;

function GameSettings() {
    this.blockColorIdle = '#efefef';
    this.blockColorActive = '#c0c0c0';
    this.blockSizePx = 10;
    this.fps = 4;
    this.refreshEvery = 1 / this.fps * 1000;
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
    this.shapes = [];
    this.settings = new GameSettings();
    this.block_sz = this.settings.blockSizePx;
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
    }
    this.turnOn = (x, y) => {
        this.blocks[x][y].setColor(this.settings.blockColorActive);
    }
    this.turnOff = (x, y) => {
        this.blocks[x][y].setColor(this.settings.blockColorIdle);
    }
    this.add = (shape) => {
        this.shapes.push(
            shape
        )
        shape.paint();
    }
    this.tick = () => {
        setInterval(()=>{
            this.shapes.forEach( shape => {
                shape.moveDown();
                shape.paint();
            })
        },this.settings.refreshEvery);
    }
}

// function Shape(stage) {
//     this.move = () => {

//     }
// }
function ShapeSquare(stage, width, height, left, top) {
    this.stage=stage;
    this.width=width;
    this.height=height;
    this.left=left;
    this.top=top;
    this.canMoveDove

    this.paint = () => {
        for (let c = 0; c < this.width; c++) {
            for (let r = 0; r < this.height; r++) {
                this.stage.turnOn(this.left+c, this.top+r);
            }
        }
    }
    this.moveDown = () => {
        if(this.top+this.height < this.stage.height){
            for(let c=0;c<this.width;c++)
                this.stage.turnOff(this.left+c, this.top)
            this.top++;
        }
    }
}

window.onload = () => {
    let stage = new Stage(30, 30, 5, 10, 1.1, 1.1);
    stage.draw();
    // stage.turnOn(1, 1);
    let shape = new ShapeSquare(stage, 3, 3, 1, 1);
    stage.add(shape);
    stage.tick();
    // shape.paint();
    // shape.moveDown();
    // shape.paint();

}