from grovepi import *

ultrasonic_ranger = 7
button = 3
led = 2
buzzer = 8

pinMode(led,"OUTPUT");
pinMode(buzzer,"OUTPUT");
pinMode(button,"INPUT");

while True:
  try:
    range = ultrasonicRead(ultrasonic_ranger)
    print range,"cm or",(range * .03),"ft"
    if range < 50:
      digitalWrite(led, 1)
      digitalWrite(buzzer, 1)
    else:
      digitalWrite(led, 0)
      digitalWrite(buzzer, 0)
      
  except TypeError:
    print "Type Error!!!"

  except IOError:
    print "IO Error - wrong port?"

