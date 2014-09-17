import csv

with open('test.dat','wb') as rawfile:
	with open('test.csv','r') as csvfile:
		datareader = csv.reader(csvfile)
		for row in datareader :
			print(row[1],)
			rawfile.write(bytes(int(x) for x in row[2:]))
			
