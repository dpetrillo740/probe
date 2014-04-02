double thermoTemp = 0;
double internalTemp = 0;
bool hasError = false;
bool scvFault = false;
bool scgFault = false;
bool ocFault = false;
unsigned long raw = 0;
int st;
double setPoint;
String cookType;
double heatSourceTemp;
double meatMass;
String meatType;
double meatDim;
double maxtemp = 0;

typedef struct {
    int ThermoTemp : 14;
    unsigned char Reserved : 1;
    bool Fault : 1;
    int InternalTemp : 12;
    unsigned char Reserved2 : 1;
    bool SCVFault : 1;
    bool SCGFault : 1;
    bool OCFault : 1; 
} Temp;

union Reading {
  unsigned long bit32;
  unsigned int bit16[2];
  unsigned char bit8[4];
  Temp temp;
};

char resultstr[64];

int cookFunction(String command);

void setup() {
    
  pinMode(D0,OUTPUT);    //Set these pins to output for CS0-3
  pinMode(D1,OUTPUT);    
  pinMode(D2,OUTPUT);    
  pinMode(D3,OUTPUT);    

  pinMode(D7,OUTPUT);         // Turn on the D7 led so we know it's time
  digitalWrite(D7,HIGH);      // to open the Serial Terminal.
  Serial.begin(9600);         // Open serial over USB.
//  while(!Serial.available()); // Wait here until the user presses ENTER in the Serial Terminal
  digitalWrite(D7,LOW); // Turn off the D7 led ... your serial is serializing!
  Serial.println("MAX31855 test");
  // wait for MAX chip to stabilize
  delay(1000);
  
    Spark.variable("hasError", &hasError, BOOLEAN);
    Spark.variable("scvFault", &scvFault, BOOLEAN);
    Spark.variable("scgFault", &scgFault, BOOLEAN);
    Spark.variable("ocFault", &ocFault, BOOLEAN);
    Spark.variable("thermoTemp", &thermoTemp, DOUBLE);
    Spark.variable("internalTemp", &internalTemp, DOUBLE);
    Spark.variable("raw", &raw, INT);
    Spark.variable("result", &resultstr, STRING); 

    SPI.setClockDivider(SPI_CLOCK_DIV64);
    SPI.setBitOrder(MSBFIRST);
    SPI.setDataMode(SPI_MODE3);
    SPI.begin();
    
    Spark.function("cook", cookFunction);
    

}

void loop() {
    
    //Connect SO to A4
    //Connect SCK to A3
    //CS0-3 to D0-3
    //https://api.spark.io/v1/devices/50ff6b065067545643400387/result?access_token=21b88a533a33b4d7d750ea2b5b2429bffab54b7f
    
    digitalWrite(D0, HIGH);
    digitalWrite(D1, HIGH);
    digitalWrite(D2, HIGH);
    digitalWrite(D3, HIGH);
    
    double t0;
    double t1;
    double t2;
    double t3;
    
    t0 = readChip(0,false);
    t1 = readChip(1,false);
    t2 = readChip(2,false);
    t3 = readChip(3,true);
    
    
    if (t3 > maxtemp){
        maxtemp = t3;
    }
    
    Serial.print("The max temp recorded so far is:");
    Serial.print(maxtemp);
    Serial.println("");   
    
    sprintf(resultstr, "{\"t2\":%f,\"t3\":%f}", t2, t3); 
    delay(300);
    

    
    if (setPoint && (t3 > setPoint)) {
    Serial.print("The Setpoint has been reached");
    Serial.println("");    
    digitalWrite(D7,HIGH);   
    }
}

double readChip(int chip, bool print){
//read the temperature from the thermocouple connected to 'chip'
//print the data to the serial port if print is true
    Reading reading;
    
    //clear the data
    reading.bit32 = 0;
    
    digitalWrite(("D",chip), LOW);
    delay(1);

    //read in the 32-bit value
    for(int i =3; i >= 0 ; i--) {
        reading.bit8[i] = SPI.transfer(0);
    }

    thermoTemp = (0x80000000 & reading.bit32 ? -1.0 : 1.0) * (double)((reading.bit32 >> 18) & 0x00001FFF) / 4.0;
    internalTemp =(0x00008000 & reading.bit32 ? -1.0 : 1.0) * (double)((reading.bit32 >> 4) & 0x000007FF) / 16.0;

    hasError = reading.temp.Fault;
    scvFault = reading.temp.SCVFault;
    scgFault = reading.temp.SCGFault;
    ocFault = reading.temp.OCFault;
    raw = reading.bit32;

    digitalWrite(("D",chip), HIGH);
    
    double tempF;
    tempF =  (thermoTemp*9.0/5.0+32.0);
    
    if (print == true) {
      Serial.print("T");
      Serial.print(chip);
      Serial.print(" = ");
      Serial.print(tempF);
      Serial.print(" F 13");
      Serial.println(""); 
    }
    delay(1);
    return tempF;
}

double stringToDouble(String var) {
    char buf[var.length()];
    var.toCharArray(buf,var.length());
    double ans=atof(buf); 
    return ans;
}


int cookFunction(String command) 
{
    
  st = command.substring(0,5).toInt();
  
  char *charCommand; 
  charCommand = strdup(command.c_str());
  char *saveptr;
  
  setPoint = stringToDouble(strtok_r(charCommand, ",", &saveptr));
  cookType = strtok_r(NULL, ",", &saveptr);
  heatSourceTemp = stringToDouble(strtok_r(NULL, ",", &saveptr));
  meatMass = stringToDouble(strtok_r(NULL, ",", &saveptr));
  meatType = strtok_r(NULL, ",", &saveptr);
  meatDim = stringToDouble(strtok_r(NULL, ",", &saveptr));
  
  Serial.print("The set temp is: ");
  Serial.print(setPoint);
  Serial.println("");
  Serial.print("The cooking method is: ");
  Serial.print(cookType);
  Serial.println("");
  Serial.print("The source temp is: ");
  Serial.print(heatSourceTemp);
  Serial.println("");
  Serial.print("The meat mass is: ");
  Serial.print(meatMass);
  Serial.println("");
  Serial.print("The meat type is: ");
  Serial.print(meatType);
  Serial.println("");
  Serial.print("The meat dimension is: ");
  Serial.print(meatDim);
  Serial.println("");  
  
  
  //look for the matching argument "coffee" <-- max of 64 characters long
  if(command == "cooknow")
  {
    Serial.print("Cook Command Recieved!");
    return 1;
  }
  else return -1;
}