#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Botones
#define BTN_LEFT   2
#define BTN_RIGHT  3
#define BTN_FIRE   4

// Jugador
int playerX = SCREEN_WIDTH / 2;
int lives = 3;
int score = 0;

// Disparo
bool shooting = false;
int bulletY = SCREEN_HEIGHT / 2;
int bulletX = 0;

// Enemigo
int enemyX = random(10, SCREEN_WIDTH - 10);
int enemySize = 6;
int enemyY = 10;
bool enemyAlive = true;

void setup() {
  pinMode(BTN_LEFT, INPUT_PULLUP);
  pinMode(BTN_RIGHT, INPUT_PULLUP);
  pinMode(BTN_FIRE, INPUT_PULLUP);

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(25, 20);
  display.println("MicroDOOM Mejorado");
  display.setCursor(15, 40);
  display.println("Presiona FIRE para jugar");
  display.display();

  while (digitalRead(BTN_FIRE) == HIGH);
  delay(500);
}

void loop() {
  if (lives <= 0) {
    // GAME OVER
    display.clearDisplay();
    display.setTextSize(2);
    display.setCursor(15, 20);
    display.println("GAME OVER");
    display.setTextSize(1);
    display.setCursor(20, 50);
    display.print("Score: ");
    display.print(score);
    display.display();

    // Esperar botón para reiniciar
    while (digitalRead(BTN_FIRE) == HIGH);
    delay(300);
    lives = 3;
    score = 0;
    playerX = SCREEN_WIDTH / 2;
    enemyAlive = true;
    enemyX = random(10, SCREEN_WIDTH - 10);
    return;
  }

  // Movimiento del jugador
  if (digitalRead(BTN_LEFT) == LOW) {
    playerX -= 2;
    if (playerX < 0) playerX = 0;
  }
  if (digitalRead(BTN_RIGHT) == LOW) {
    playerX += 2;
    if (playerX > SCREEN_WIDTH - 6) playerX = SCREEN_WIDTH - 6;
  }

  // Disparo
  if (digitalRead(BTN_FIRE) == LOW && !shooting) {
    shooting = true;
    bulletY = SCREEN_HEIGHT / 2;
    bulletX = playerX + 2;
  }

  // Avanza disparo
  if (shooting) {
    bulletY -= 4;
    if (bulletY < 0) shooting = false;
  }

  // Colisión disparo vs enemigo
  if (shooting && enemyAlive &&
      bulletX >= enemyX && bulletX <= enemyX + enemySize &&
      bulletY <= enemyY + enemySize && bulletY >= enemyY) {
    shooting = false;
    enemyAlive = false;
    score++;
  }

  // Enemigo avanza hacia abajo
  if (enemyAlive) {
    enemyY += 1;
    if (enemyY > SCREEN_HEIGHT - 8) {
      lives--;
      enemyAlive = false;
    }
  }

  // Respawn enemigo
  if (!enemyAlive) {
    enemyX = random(10, SCREEN_WIDTH - 10);
    enemyY = 0;
    enemyAlive = true;
  }

  // Dibujar
  display.clearDisplay();

  // HUD
  display.setCursor(0, 0);
  display.setTextSize(1);
  display.print("Score: ");
  display.print(score);
  display.setCursor(80, 0);
  display.print("Lives: ");
  display.print(lives);

  // Jugador
  display.fillRect(playerX, SCREEN_HEIGHT - 10, 6, 6, SSD1306_WHITE);

  // Disparo
  if (shooting) {
    display.fillRect(bulletX, bulletY, 2, 4, SSD1306_WHITE);
  }

  // Enemigo
  if (enemyAlive) {
    display.drawRect(enemyX, enemyY, enemySize, enemySize, SSD1306_WHITE);
  }

  display.display();
  delay(40);
}
