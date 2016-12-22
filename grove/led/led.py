from grovepi import *
import time

led = 2

pinMode(led, "OUTPUT")
time.sleep(1)

while True:
  try:
    digitalWrite(led, 1)
    time.sleep(1)

    digitalWrite(led, 0)
    time.sleep(1)
  except KeyboardInterrupt:
    digitalWrite(led, 0)
    break
  except IOError:
    print "Error"


