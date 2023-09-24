
// Definición de la clase SnakeGame
class SnakeGame
{
    constructor()
    {   // Inicializa el juego al crear una instancia
        this.inicio();
    }
    inicio()
    {
        // Configuración inicial del juego
        this.game =
        {
            size: 20, // Tamaño de las celdas en el lienzo
            points:100,// Puntos ganados por comer comida
            score:0,// Puntuación actual del jugador
            audios:
            {
                
                lose:new Audio() // Sonido de perder el juego
            },
            lockkey:false  // Evita múltiples movimientos rápidos
        };

        // Representación de la serpiente
        this.snake =
        {
            position: null,// Dirección de movimiento de la serpiente
            body:
            [
                {
                    x: 300,
                    y:200,
                }
            ]
        };

        // Representación de la comida
        this.food =
        {
            x: 120,
            y: 140,
            ico:new Image(), // Imagen de la manzana
            audio: new Audio()// Sonido al comer comida
        };

        // Direcciones de movimiento
        this.position =
        {
            up: 0,
            right: 1,
            down: 2,
            left:3
        };

        // Estado del juego
        this.gameover = false;

        // Configuración del lienzo HTML
        this.canvas = document.getElementById('game');
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.canvas.focus(); // Darle el enfoque al lienzo para recibir eventos de teclado

        this.context = this.canvas.getContext('2d'); // Contexto de dibujo en 2D
        this.score = document.getElementById('score');

        // Configuración de recursos (imágenes y sonidos)
        this.food.ico.src = '../material/food.png';
        this.food.audio.src = '../material/bite.mp3';
        this.game.audios.lose.src = '../material/lose.mp3';
    }

    //Se crea la funcion start
    start()
    {
        let self = this; // Almacena una referencia a la instancia actual de SnakeGame

        // Manejo de controles del jugador
        controls();
        // Dibuja el juego en intervalos regulares
        let interval = setInterval(draw, 100);

        //Se crea la funcion draw
        function draw()
        {
            setTimeout(() => 
            {
              self.game.lockkey = false;// Desbloquea las teclas después de un tiempo
            },100);

             // Borra el lienzo para dibujar la siguiente frame
            self.context.clearRect(0,0, self.canvas.width, self.canvas.height)

            // Lógica de movimiento de la serpiente y detección de colisión
            if (self.snake.body.length > 1)
            {
                self.snake.body.pop();
                self.snake.body.unshift({
                    x: self.snake.body[0].x,
                    y: self.snake.body[0].y
                });
            }

            // Dibuja la serpiente y la la manzana en el lienzo
            if (self.food.x === self.snake.body[0].x && self.food.y === self.snake.body[0].y)
            {
                //Genera una nueva posición aleatoria para la manzana
                self.food.x = Math.floor(Math.random()* (self.canvas.width / self.game.size))* self.game.size;
                self.food.y = Math.floor(Math.random()* (self.canvas.height / self.game.size))* self.game.size;
                
                // Hace crecer el cuerpo de la serpiente al agregar una nueva parte en su cola
                self.snake.body.push(
                {
                    x: self.snake.body[self.snake.body.length - 1].x,
                    y: self.snake.body[self.snake.body.length - 1].y
                });

                // Aumenta la puntuación del jugador y actualiza el marcador en la interfaz
                self.game.score++;
                self.score.innerText =(self.game.score * self.game.points).toLocaleString('es-pe');
                // Reproduce un sonido para indicar que se ha comido la comida
                self.food.audio.play();
            }

            // Dibuja la imagen de la manzana en el lienzo en su nueva posición
            self.context.drawImage(self.food.ico, self.food.x, self.food.y, self.game.size,self.game.size);

            // Actualiza la posición de la cabeza de la serpiente según la dirección actual
            if(self.snake.position === self.position.up)
            {
               self.snake.body[0].y += -self.game.size;//Mueve hacia arriba
            }
            if(self.snake.position === self.position.down)
            {
               self.snake.body[0].y += self.game.size;//Mueve hacia abajo
            }

            if(self.snake.position === self.position.right)//Mueve hacia la derecha
            {
               self.snake.body[0].x += self.game.size;
            }
            if(self.snake.position === self.position.left)//Mueve hacia la izquierda
            {
               self.snake.body[0].x += -self.game.size;
            }

            self.snake.body.forEach((pos,index) =>
            {
                if (index === 0)
                {
                    self.context.fillStyle = "blue";  //La cabeza de la serpiente es azul
                }else
                {
                    self.context.fillStyle = "red"; //El cuerpo de la serpiente es rojo
                }
                self.context.fillRect(pos.x, pos.y, self.game.size, self.game.size);//Dibuja un cuadrado para cada parte de la serpiente
            });

            colision(); //Verifica si hay colisiones en este fotograma
        }

        function controls()
        {
            document.addEventListener('keyup', (e) => {
                if(self.game.lockkey)
                {
                    return; //Evita múltiples movimientos rápidos
                }

                //Detecta las teclas presionadas y actualiza la dirección de movimiento de la serpiente
                if(e.keyCode === 38 && self.snake.position !== self.position.down)
                {
                    self.snake.position = self.position.up;//Mueve hacia arriba
                    self.game.lockkey = true;
                }
                if(e.keyCode === 39 && self.snake.position !== self.position.left)
                {
                    self.snake.position = self.position.right;//Mueve hacia la derecha
                    self.game.lockkey = true;
                }
                if(e.keyCode === 37 && self.snake.position !== self.position.right)
                {
                    self.snake.position = self.position.left;//Mueve hacia la izquierda
                    self.game.lockkey = true;
                }
                if(e.keyCode === 40 && self.snake.position !== self.position.up)
                {
                    self.snake.position = self.position.down;// Mueve hacia abajo
                    self.game.lockkey = true;
                }
            })
        }

        function colision()
        {
            let snakehead = self.snake.body[0];

             //Comprueba si hay colisiones con las paredes del lienzo
            self.gameover = 
            (
                (snakehead.y <0 || snakehead.y >= self.canvas.height)
                || (snakehead.x < 0 || snakehead.x >= self.canvas.width)
            )

            if(self.snake.body.length> 1)
            {   
                //Comprueba si la serpiente colisiona consigo misma
                self.snake.body.forEach((body, index) =>
                {
                   if (index > 0 && (body.y === snakehead.y && body.x=== snakehead.x))
                   {
                       self.gameover = true;
                   }
                });
            }
            if (self.gameover)
            {
                clearInterval(interval);//Detiene el juego
                self.context.font = "30px Arial"
                self.context.fillStyle ="black"
                self.context.fillText("GAME OVER", self.canvas.height / 2 + self.game.size, self.canvas.height / 2);//Muestra "GAME OVER" en el lienzo

                self.game.audios.lose.play();//Reproduce un sonido de pérdida del juego
            }

        }
    }
}