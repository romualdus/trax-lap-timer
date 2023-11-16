// constants won't change. They're used here to set pin numbers:
const int BUTTON_PIN_A = 32;
const int BUTTON_PIN_B = 35;
const int BUTTON_PIN_C = 34;
const int LED_PIN = 2;

// key name to send
const char DATA_TIMER[] = {"data:timer"};
const char DATA_FINISH_TIME_A[] = {"data:finish-time-a"};
const char DATA_FINISH_TIME_B[] = {"data:finish-time-b"};
const char DATA_FINISH_TIME_C[] = {"data:finish-time-c"};

// variables will change:
int buttonStateA = 0;
int buttonStateB = 0;
int buttonStateC = 0;

bool finalLap = false;
bool isAFinished = false;
bool isBFinished = false;
bool isCFinished = false;

bool startStopwatch = false;
unsigned long firstStopwatchTime = 0;
unsigned long stopwatchTime = 0;

char timeBuffer[8];

void setup()
{
  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN_A, INPUT);
  pinMode(BUTTON_PIN_B, INPUT);
  pinMode(BUTTON_PIN_C, INPUT);
}

void loop()
{
  if(Serial.available() > 0) {
    String receivedString = "";

    while(Serial.available() > 0) {
      receivedString += char(Serial.read());
    }

    if(receivedString == "reset") {
      startStopwatch = false;
      finalLap = false;
      isAFinished = false;
      isBFinished = false;
      isCFinished = false;
    }

    if(receivedString == "final") {
      finalLap = true;
    }
  }


  buttonStateA = digitalRead(BUTTON_PIN_A);
  buttonStateB = digitalRead(BUTTON_PIN_B);
  buttonStateC = digitalRead(BUTTON_PIN_C);

  if (!startStopwatch)
  {
    if (buttonStateA == LOW || buttonStateB == LOW || buttonStateC == LOW)
    {
      firstStopwatchTime = millis();
      stopwatchTime == 0;
      startStopwatch = true;
    }
  } else {
    stopwatchTime = millis() - firstStopwatchTime;
    String stopwatchTimeFormatted = timeFormatter(stopwatchTime);
    Serial.print(DATA_TIMER);
    Serial.println("=" + stopwatchTimeFormatted);

    if (finalLap)
    { 
      if (buttonStateA == LOW && !isAFinished)
      {
        isAFinished = true;
        Serial.print(DATA_FINISH_TIME_A);
        Serial.println("=" + stopwatchTimeFormatted);
      }

      if (buttonStateB == LOW && !isBFinished)
      {
        isBFinished = true;
        Serial.print(DATA_FINISH_TIME_B);
        Serial.println("=" + stopwatchTimeFormatted);
      }

      if (buttonStateC == LOW && !isCFinished)
      {
        isCFinished = true;
        Serial.print(DATA_FINISH_TIME_C);
        Serial.println("=" + stopwatchTimeFormatted);
      }
    }

    if(isAFinished && isBFinished && isCFinished)
    {
      delay(1000);

      startStopwatch = false;
      finalLap = false;
      isAFinished = false;
      isBFinished = false;
      isCFinished = false;
    }
  }

  delay(1);
}

String timeFormatter(unsigned long time)
{
  float minutes = time / 60000;
  unsigned long over = time % 60000;
  float seconds = over / 1000;
  float millis = over % 1000;

  sprintf(timeBuffer, "%d:%02d:%03d", int(minutes), int(seconds), int(millis));

  return String(timeBuffer);
}
