let bird;
let pipes = [];
let game;
let gameState = 0;
let score = 0;
let protected = false;
function setup() {
    createCanvas(400,600);
    frameRate(120)
    bird = new Bird();
    pipes.push(new Pipe());
    game = new Game();
   
}

function draw() {
    background(0);
    //Oyun arası ekranlar için switch-case yapısı oluşturuldu
    switch(gameState){
        case 0:
            game.menu();
            break;
        case 1:
            game.start();
            break;
        case 2:
            game.gameOver();
            break;
    }
    
}

//Kullanıcı space tuşuna bastığında kuş zıplıyor
function keyPressed(){
    if(key == ' '){
        bird.up();
    }
}

//Switch-Case yapısı içinde kullanılan oyun sahnesi
function Game(){
    this.start = () => {
        //Scoreboard
        text("Skor: " + score, 45,30)
        //Protected true ise kalkan aktif değil ise kalkan pasif yazacak
        text(protected ? "Kalkan: Aktif" : "Kalkan: Pasif",70,60)

        //Kuş fonksiyonları
        bird.show();
        bird.update();
        textSize(20);
        fill(255)

        //Pipe fonksiyonları
        //Her 120 karede bir pipes dizisine yeni bir pipe ekliyor
        if(frameCount % 120   == 0){
        pipes.push(new Pipe());
        }
        //Pipe sayısı kadar ekrana pipe getiriyor
        for(let i = pipes.length-1; i>=0; i--){
            pipes[i].show();
            pipes[i].update();
            //Eğer kuş borulara çarparsa ve protected false ise oyun bitti ekranına yolluyor
            if(pipes[i].hits(bird)){
                if(protected != true){
                    gameState=2;
                }
            }
            //Kuş boruların arasından geçtikçe puan kazanıyor
            if(pipes[i].collectCoin(bird)){
                score++;
            }
            //Borular ekran dışına çıktığında yok oluyor
            if(pipes[i].offscreen()){
                pipes.splice(i,1);
            }
        }
         //Her 5 skorda bir, armoru aktif ediyor.
        if(score != 0 && score % 5 == 0){
           protected = true;
           //3sn sonra protected false oluyor
           setTimeout(()=>{protected = false},3000)
        }
    }
    //Switch-Case yapısı için ana ekran
    this.menu = () => {
        background(96, 157, 255)
		fill(255)
        textAlign(CENTER);
        textSize(40)
        text('Flappy Ball', width / 2, height / 5)
        textSize(30);
        text('Başlamak İçin Tıkla', width / 2, height / 2);
        textSize(20)
        text('Nasıl Oynanır?', width / 2, height / 2+80)
        textSize(20)
        text('Space tuşuna basarak boruların arasından geç ve skor kazan.', width/7, height/2+100,300,100);
        text("Her 5 skorda bir 3 saniyeliğine sahip olduğun ve boruların içinden geçebileceğin kalkan kazanırsın. ", width/7, height/2+180,300,100)

    }
    //Switch-Case yapısı için oyun bitti ekranı
    this.gameOver = () =>{
        background(96, 157, 255)
		fill(255)
        textAlign(CENTER);
        textSize(30);
        text('Oyun Bitti', width / 2, height / 3)
        textSize(20)
		text('Tekrar Oynamak İçin Tıkla', width / 2, height / 2 + 20);
    }
}

//Mouse click için kullanılan fonksiyon, sayfalar arası geçiş yapıyor
function mousePressed(){
    if(gameState == 0){
        //Oyun başlamadan değişkenleri sıfırlıyoruz.
        bird.x = width/3;
        bird.y = height/2;
        pipes.x = width;
        pipes = [];
        score=0;
        gameState = 1;
    }else if(gameState == 2){
        gameState = 0;
    }
}

//Kuş için kullanılan fonksiyonlar
function Bird(){
    //Kuşun başlangıç konumu
    this.x = width/3;
    this.y = height/2;
    
    //Kuşun boyutu
    this.birdW = 32;
    this.birdH = 32;

    //Kuşa etki eden kuvvetler
    this.gravity = 0;
    this.velocity = .3;
    this.lift = -6;

    this.show = () => {
        fill(255);
        //Eğer protected true ise kuşun etrafında kırmızı renkte şeffaf bir kalkan oluşmasını sağlayan if koşulu
        if(protected){
            fill(255);
            ellipse(this.x,this.y,this.birdW,this.birdH)
            fill(240, 52, 52, 50)
            ellipse(this.x,this.y,this.birdW*2,this.birdH*2)
        }else{
        fill(255);
         ellipse(this.x,this.y,this.birdW,this.birdH)
        }
        
    }

    this.update = () => {
        this.gravity += this.velocity;
        this.gravity = Math.min(5,this.gravity);
        this.y += this.gravity;
        //Kuş ekrandan aşağı düşünce oyun bitsin
        if(this.y > height){
            gameState = 2;
        }

    }

    this.up = () => {
        this.gravity = this.lift;
    }
}
//Kuş için kullanılan fonksiyonlar
function Pipe(){
    //Boru için genel tanımlamalar
    this.top = random(height / 6, 3 / 4 * height);
    this.bottom = height - (this.top+100);
    this.x = width;
    this.w = 50 ;
    this.gap = 100;
    this.speed=2;

    //Kuşun boruya çarpma olayını sağlayan fonksiyon. True ve false döndürüyor
    this.hits = function(bird) {
        if (bird.y < this.top || bird.y > height - this.bottom) {
          if (bird.x > this.x && bird.x < this.x + this.w) {
            return true;
          }
        }
        return false;
      }
    //Kuşun boruların arasından geçtiğinde skorun artmasınaı sağlayan fonksiyon. True ve false döndürüyor
    this.collectCoin = (bird) => {
        if(bird.x > this.x && bird.x < this.x + 2.5){
            return true;
        }
        return false;
    }

    this.show = () =>{
        fill(255);
        rect(this.x, 0, this.w, this.top);
        rect(this.x, this.top+this.gap, this.w,height-this.top-this.gap);
    }
    this.update = () => {
        this.x -= this.speed;
    }
    //Boruların ekran dışından çıkıp çıkmadığını kontrol eden fonksiyon. True ve false döndürür.
    this.offscreen = () => {
        if(this.x < -this.w){
            return true;
        }else {
            return false;
        }
    }
}
