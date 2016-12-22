from grovepi import *

ultrasonic_ranger = 7
button = 3
led = 2
pinMode(led,"OUTPUT");
pinMode(button,"INPUT");

while True:
  try:
    if digitalRead(button) == 1:
      range = ultrasonicRead(ultrasonic_ranger)
      print range,"cm or",(range * .03),"ft"
      digitalWrite(led, 1)
    else:
      digitalWrite(led, 0)
      
  except TypeError:
    print "Type Error!!!"

  except IOError:
    print "IO Error - wrong port?"

