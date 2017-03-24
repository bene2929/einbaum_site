#!/usr/bin/python
import spidev
import os
import RPi.GPIO as GPIO
import time
import sys
import MySQLdb
#define outputs
GPIO.setmode(GPIO.BOARD)
GPIO.setup(3,GPIO.OUT)
GPIO.setup(5, GPIO.OUT)
GPIO.setup(11, GPIO.OUT)
GPIO.setup(13,GPIO.OUT)
GPIO.setup(15, GPIO.OUT)
GPIO.setup(29, GPIO.OUT)
GPIO.setup(31,GPIO.OUT)
GPIO.setup(33, GPIO.OUT)
GPIO.setup(35, GPIO.OUT)
GPIO.setup(37,GPIO.OUT)



#spi setup
spi = spidev.SpiDev()
spi.open(0,0)

db = None
cur = None
ledDefinition= [3,5,11,13,15,29,31,33,35,37]
def setLeds():
    #ledStatus = open("LedFile.txt",'r') #Lesezugriff
    
    cur.execute("SELECT * FROM leds")
    for line in cur.fetchall():
        print(line)
        actualPin = ledDefinition[int(line["id"])-1]
        if(line["status"]=="0"):
            GPIO.output(actualPin,GPIO.LOW)
        else:
            GPIO.output(actualPin,GPIO.HIGH)
    #ledStatus.close()

def getSensorValues():
    #sensorValues = open("SensorFile.txt",'w') #Schreibzugriff
    
    #temp Sensor
    for i in range (0,4):
        rawData = spi.xfer([1, (8 + i) <<4, 0])
        processedData = ((rawData[1]&3) <<8 ) + rawData[2]
        voltage= processedData*0.0032                   #U in V
        temperature = voltage*100                       #temp =mV/10.. 10mv/degreeC
        lineToWrite = "temp"+str(i)+";"+str(temperature)
        out="UPDATE sensors SET status='"+ str(temperature)+"' WHERE type='temp' AND number='"+ str(i)+"'"
        cur.execute(out)    
        b=cur.fetchall()    
        #sensorValues.write(lineToWrite+"\n")
        print(lineToWrite)


    #moisture Sensor
    for x in range (4,5):
        rawData = spi.xfer([1, (8 + x) <<4, 0])
        processedData = ((rawData[1]&3) <<8 ) + rawData[2]
        voltage= processedData*0.0032
        
        moisture = round((voltage-0.826)/0.0315,2)
        lineToWrite = "moisture"+str(x-4)+";"+str(moisture)
        id=x-4
        out="UPDATE sensors SET status='"+ str(moisture)+"' WHERE type='moist' AND number='"+ str(id)+"'"
        print(lineToWrite)
        cur.execute(out)
        b=cur.fetchall()    
    
       
    #sensorValues.close();
    

while (True): 
        if db!= None :
            db.close()
        db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="einbaum",  # your password
                     db="SmartData")        # name of the data base
                     
        cur = db.cursor(MySQLdb.cursors.DictCursor)
        setLeds()
        getSensorValues()
        db.commit()
        time.sleep(0.1)



