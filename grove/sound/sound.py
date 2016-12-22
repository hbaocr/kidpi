from grovepi import *
import time

led = 2
sound = 1

pinMode(led, "OUTPUT")
time.sleep(1)
maxLevel = 0
while True:
  try:
    level = analogRead(sound)
    if level > maxLevel:
      print level
      maxLevel = level

    if level > 400:
      print level
      digitalWrite(led, 1)
    else: 
      digitalWrite(led, 0)
  except KeyboardInterrupt:
    digitalWrite(led, 0)
    break
  except IOError:
    print "Error"


