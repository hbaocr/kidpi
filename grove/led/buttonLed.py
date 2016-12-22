from grovepi import *

button = 3
led = 2
pinMode(button,"INPUT");
pinMode(led,"OUTPUT");

while True:
  try:
    if digitalRead(button) == 1:
      digitalWrite(led, 1)
    else:
      digitalWrite(led, 0)
  except TypeError:
    print "Type Error!!!"

  except IOError:
    print "IO Error - wrong port?"

