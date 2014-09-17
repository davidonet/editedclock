import random

print ("'% < 1s','nb de tick','temps moyen'")

def distfun(p,lone,thr):
	if p<lone :
		a = 100+int(p * ((thr-100)/lone) )
	else:
		a = 100+int((thr-100)+( ((60000-thr)/(1-lone))*(p-lone) ) ) 
	return a

def randdist(lone,thr):
	s = 0
	n = 0
	row = ""
	while s<43200000:
		p = random.uniform(0.1, 1.0)
		a = distfun(p,lone,thr)
		if 43200000 < (a+s) :
			a = (43200000-s)
		row+=','+str(a)
		s+=a
		n+=1
	return 'Si %d %% des "secondes" durent moins de %d ms, on a %d mouvements soit en moyenne %s ms entre chaque (sur 12h)' % (int(lone*100),thr,n,int(43200000/n)) 	

print ("Inflexion à 1 s")
for p in range(50,100,5):
	print(randdist(p/100.0,1000))

print ("Inflexion à 5 s")
for p in range(50,100,5):
	print(randdist(p/100.0,5000))


print ("Inflexion à 10 s")
for p in range(50,100,5):
	print(randdist(p/100.0,10000))

print ("Inflexion à 30 s")
for p in range(50,100,5):
	print(randdist(p/100.0,30000))


