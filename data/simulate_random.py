import random
import math
from sys import stdout

sumSec = 0
sumTick = 0
goal = 43100
sumComp = 0
sumLong = 0
nbLong = 0
longSec = []

def distfunc(p):
	# Progressive distribution
	# p a random float number between 0 and 1
	return 60.0 - ( 1798.32 * math.sqrt(0.00111319-0.00111215*p))

def progressiveRand():
	# return a random number between 1 and 60 according to distfunc distribution
	p = random.uniform(0.1, 1.0)
	return int(distfunc(p)*100)/100

def distfunc1(p,lone,thr):
	# Thresolded distribution
	# thr : break point
	# part of number smaller than thr 
	# p a random float number between 0 and 1
	if p<lone :
		a = 1000+int(p * ((thr-100)/lone) )
	else:
		a = 1000+int((thr-100)+( ((60000-thr)/(1-lone))*(p-lone) ) ) 
	return a

def segRand():
	# return a random number between 1 and 60 according to distfunc1 
	# distribution with 80% of number smaller than 5
	p = random.uniform(0.1, 1.0)
	return distfunc1(p,.8,5000)/1000
		

while sumSec< goal:
	newSec = progressiveRand()
	nbLong += 1
	sumLong += newSec
	compSec = newSec-1
	sumComp += compSec*2
	sumTick += 	1+compSec*2
	sumSec += newSec+compSec
	longSec.append(newSec)
stdout.write("\n")
longSec.sort()
print(longSec)
print("sumSec\tsumTick\tnbComp\tnbLong\tsumLong/nbLong")
print("%d\t%d\t%d\t%d\t%d" %(sumSec,sumTick,sumComp,nbLong,sumLong/nbLong))