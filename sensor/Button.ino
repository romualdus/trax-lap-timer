// constants won't change. They're used here to set pin numbers:
const int buttonPinA = 32;
const int buttonPinB = 35;
const int buttonPinC = 34; 
const int ledPin = 2;

// variables will change:
int buttonStateA = 0;
int buttonStateB = 0;
int buttonStateC = 0;

bool startStopwatch = false;

unsigned long firstStopwatchTime = 0;
unsigned long stopwatchTime = 0;
unsigned long winnerTime = 0;

unsigned long firstLapTimeA = 0;
unsigned long firstLapTimeB = 0;
unsigned long firstLapTimeC = 0;

unsigned long splitLapA = 0;
unsigned long splitLapB = 0;
unsigned long splitLapC = 0;

int countLapA = 1;
int countLapB = 1;
int countLapC = 1;

char timeBuffer[8];


void setup() {
  Serial.begin(115200);

  pinMode(ledPin, OUTPUT);
  pinMode(buttonPinA, INPUT);
  pinMode(buttonPinB, INPUT);
  pinMode(buttonPinC, INPUT);
}

void loop() {
  buttonStateA = digitalRead(buttonPinA);
  buttonStateB = digitalRead(buttonPinB);
  buttonStateC = digitalRead(buttonPinC);

  if(!startStopwatch && stopwatchTime == 0) {
    if(buttonStateA == LOW || buttonStateB == LOW || buttonStateC == LOW) {
      firstStopwatchTime = millis();
      startStopwatch = true;
    }
  }

  if(startStopwatch) {
    stopwatchTime = millis() - firstStopwatchTime;

    String stopwatchTimeFormatted = timeFormatter(stopwatchTime);
    Serial.println("stopwatchTime=" + stopwatchTimeFormatted);

    firstLapTimeA = stopwatchTime - splitLapA;
    firstLapTimeB = stopwatchTime - splitLapB;
    firstLapTimeC = stopwatchTime - splitLapC;

    if(buttonStateA == LOW) {
      if(countLapC == 1 && firstLapTimeC >= 2000) {
        countLapC++;
        splitLapC = stopwatchTime;

        Serial.println("lapC=" + stopwatchTimeFormatted);
      } else if(countLapB == 2 && firstLapTimeB >= 2000) {
        countLapB++;
        splitLapB = stopwatchTime;

        Serial.println("lapB=" + stopwatchTimeFormatted);
      } else if(countLapA == 3 && firstLapTimeA >= 2000) {
        countLapA++;
        splitLapA = stopwatchTime;

        Serial.println("lapA=" + stopwatchTimeFormatted);
      }
    }

    if(buttonStateB == LOW) {
      if(countLapA == 1 && firstLapTimeA >= 2000) {
        countLapA++;
        splitLapA = stopwatchTime;

        Serial.println("lapA=" + stopwatchTimeFormatted);
      } else if(countLapC == 2 && firstLapTimeC >= 2000) {
        countLapC++;
        splitLapC = stopwatchTime;

        Serial.println("lapC=" + stopwatchTimeFormatted);
      } else if(countLapB == 3 && firstLapTimeB >= 2000) {
        countLapB++;
        splitLapB = stopwatchTime;

        Serial.println("lapB=" + stopwatchTimeFormatted);
      }
    }

    if(buttonStateC == LOW) {
      if(countLapB == 1 && firstLapTimeB >= 2000) {
        countLapB++;
        splitLapB = stopwatchTime;

        Serial.println("lapB=" + stopwatchTimeFormatted);
      } else if(countLapA == 2 && firstLapTimeA >= 2000) {
        countLapA++;
        splitLapA = stopwatchTime;

        Serial.println("lapA=" + stopwatchTimeFormatted);
      } else if(countLapC == 3 && firstLapTimeC >= 2000) {
        countLapC++;
        splitLapC = stopwatchTime;

        Serial.println("lapC=" + stopwatchTimeFormatted);
      }
    }
    
    if(countLapA > 3 && countLapB > 3 && countLapC > 3) {
      startStopwatch = false;
    }
  }

  delay(1);
}

String timeFormatter(unsigned long time) {
  float minutes = time / 60000;
  unsigned long over = time % 60000;
  float seconds = over / 1000;
  float millis = over % 1000;

  sprintf(timeBuffer, "%d:%02d:%03d", int(minutes), int(seconds), int(millis));

  return String(timeBuffer);
}
