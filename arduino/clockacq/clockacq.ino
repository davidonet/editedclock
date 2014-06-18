// the setup routine runs once when you press reset:
void setup() {
  Serial.begin(115200);  
  pinMode(11,INPUT);
  digitalWrite(11,HIGH);
}

unsigned long t = 0;
boolean ispushed=false;

void loop() {
  if(digitalRead(11)==LOW){
    if(!ispushed){
      unsigned long b = millis();

      ispushed = true;
      if(t==0){
        Serial.write(0);
      }
      else{
        unsigned long r = b-t;
        byte v=255;
        if((r/10)<255)
          v = r/10;
        Serial.write(v);
      }
      t=b;
    }
  }
  else
  { 
    digitalWrite(13,LOW); 
    ispushed=false;
  }
  if (Serial.available()) {
    // read the most recent byte (which will be from 0 to 255):
    if(0 == Serial.read()){
      t=0;
      digitalWrite(13,HIGH);
      delay(200);
    }
  }
  else { 
    delay(30);
  }
}






