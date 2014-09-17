import random
import math
from sys import stdout


def distfunc(i):
	# Progressive distribution
	# p a random float number between 0 and 1
	p = i/10000.0
	raw = 1+60.0 - ( 1798.32 * math.sqrt(0.00111319-0.00111215*p))
	return math.floor(raw *1000)*1000

longSeconds = 12*60

sample = [distfunc(i) for i in random.sample(range(10000),longSeconds)]

timeMissing = 12*60*60*1000*1000 - sum(sample)
secondMissing = 12*60*60 - longSeconds
secNum = 0
meanSec = 2*math.floor(timeMissing / secondMissing) -100000

print("Mean long sec %d ms \t Mean short sec %d ms" % ((sum(sample) / 1200) / 1000,meanSec/1000))

while( 0<secondMissing and 0<timeMissing):
	aSec = random.randint(100000,meanSec-100000)
	bSec = 100000+ meanSec - aSec
	sample.append(aSec)
	sample.append(bSec)
	secondMissing -=2
	secNum +=2
	timeMissing -=  (aSec+bSec)

sample.sort()
sample[0] += timeMissing


def transformToBytes(val):
	b0 = val >> 24
	b1 = val >> 16 & 255
	b2 = val >> 8 & 255
	b3 = val & 255
	return bytes([b0,b1,b2,b3])

