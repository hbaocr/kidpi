from grovepi import *

ultrasonic_ranger = 7

while True:
  try:
    range = ultrasonicRead(ultrasonic_ranger)
    print range,"cm or",(range * .03),"ft"
      
  except TypeError:
    print "Type Error!!!"

  except IOError:
    print "IO Error - wrong port?"

