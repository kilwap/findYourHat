const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const heroCharacter = '@';

class Field {
  constructor() {
    this.field = Field.generateField();
    this.pos_x = 0;
    this.pos_y = 0;
    this.endGame = false;
  };

  static generateField(){
    let height = prompt('enter height: ');
    if (!(height > 4)){
      while (!(height > 4 )){
        console.log('height must be a number larger than 4!');
        height = prompt('enter height: ');
        height = parseInt(height)
      }
    }
    let width = prompt('enter width: ');
    if (!(width > 4 )){
      while (!(width > 4 )){
        console.log('width must be a number larger than 4!');
        width = prompt('enter width: ');
      }
    }
    let holesPercent = prompt('enter maximum percentage of holes on board: ');
    if (!(holesPercent >= 0 && holesPercent <= 100)){
      while (!(holesPercent >= 0 && holesPercent <= 100)){
        console.log('percent must be a numbe between 0 and 100');
        console.log(holesPercent);
        holesPercent = prompt('enter maximum percentage of holes on board: ');
      }
    }
    let fieldOk = false
    while(!fieldOk){
      let randField = [];
      let hatPlaced = false;
      let numberOfHoles = height * width * (holesPercent/100);
      for (let i=0; i < height; i++){
        randField.push([]);
        for (let j=0; j < width; j++){
          if (i==0 && j==0){
            randField[i][j] = heroCharacter;
          } else {
            const symbolSelect =  Math.floor(Math.random() * 3);
            switch (symbolSelect){
              case 0:
                randField[i][j] = fieldCharacter;
                break;
              case 1:
                if (numberOfHoles > 0){
                  randField[i][j] = hole;
                  numberOfHoles--;
                } else {
                  randField[i][j] = fieldCharacter;
                }
                break;
              case 2:
                if (!hatPlaced && i > 2){
                  randField[i][j] = hat;
                  hatPlaced = true;
                } else {
                  randField[i][j] = fieldCharacter;
                }
                break;
            }
          }
        }
      }
      fieldOk = Field.validateField(randField);
      if (fieldOk){
        return randField;
      }
    }
    
  }

  static recursiveValidate(x, y, wasHere, field){
      if (wasHere[0][0]){
        return true;
      }
      if(field[x][y] == hole || wasHere[x][y]){
        return false;
      }
      wasHere[x][y] = true;
      if (x != 0){
        if (Field.recursiveValidate(x-1, y, wasHere, field)){
          return true;
        }
      }
      if (x != field[0].length - 1){
        if (Field.recursiveValidate(x+1, y, wasHere, field)){
          return true;
        }
      }
      if (y != 0){
        if (Field.recursiveValidate(x, y-1, wasHere, field)){
          return true;
        }
      }
      if (y != field.length - 1){
        if (Field.recursiveValidate(x, y+1, wasHere, field)){
          return true;
        }
      }
      return false;
    
    }

  static validateField(field){
    let solvable = false;
    let wasHere = [];
    let hatPosition = [];
    for(let i=0; i<field.length; i++){
      wasHere.push([]);
      for (let j=0; j<field[0].length; j++){
        if (field[i][j] == hat){
          hatPosition = [i, j];

        }
        wasHere[i][j] = false;
      }
    }

    solvable = Field.recursiveValidate(hatPosition[0], hatPosition[1], wasHere, field); 
    return solvable;
  }

  print(){
    let board = '\n';
    for ( let i = 0; i<this.field.length; i++){
      board += this.field[i].join('');
      board += '\n';
    }
    console.log(board);
  }

  positionCheck(){
    if (this.pos_y >= this.field.length || this.pos_x >= this.field[0].length || this.pos_x < 0 || this.pos_y < 0){
      console.log('you are out of board');
      this.endGame = true;
    }else if (this.field[this.pos_y][this.pos_x] == hat){
      console.log('you won');
      this.endGame = true;
    } else if (this.field[this.pos_y][this.pos_x] == hole){
      console.log('you are in a hole');
      this.endGame = true;
    } else {
      console.log('everything is ok');
    }
  }

  askUser(){
    const userInput = prompt('Which way? ');
    this.field[this.pos_y][this.pos_x] = pathCharacter;
    switch(userInput){
      case 'r':
        this.pos_x += 1;
        break;
      case 'd':
        this.pos_y += 1;
        console.log(this.field.length);
        console.log(this.pos_y);
        break;
      case 'l':
        this.pos_x -= 1;
        break;
      case 'u':
        this.pos_y -= 1;
        console.log(this.pos_y);
        break;
      default:
        console.log('wrong input, type r, d, l or u  ;)');
    }
  }

  playGame(){
    this.print();
    while (!this.endGame){
      this.askUser();
      this.positionCheck();
      console.log(this.pos_y);
      console.log(this.pos_x);
      if (this.pos_y >=0 && this.pos_y < this.field.length){
        if (this.pos_y>=0 && this.field[this.pos_y][this.pos_x] != hole){
        this.field[this.pos_y][this.pos_x] = heroCharacter;
      
        }
      }
      this.print();
    } 
  }

}
const myField = new Field();
myField.playGame();