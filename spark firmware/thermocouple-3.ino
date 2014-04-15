double thermoTemp = 0;
double internalTemp = 0;
double debug = 0;
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
double t0;
double t1;
double t2;
double t3;

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

  pinMode(D7,OUTPUT);       
  
  Serial.begin(9600);        
  
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
    //add spark vairable to debug remotely 
    Spark.variable("debug", &debug, DOUBLE);

    SPI.setClockDivider(SPI_CLOCK_DIV64);
    SPI.setBitOrder(MSBFIRST);
    SPI.setDataMode(SPI_MODE3);
    SPI.begin();
    
    Spark.function("cook", cookFunction);
    
    digitalWrite(D0, HIGH);
    digitalWrite(D1, HIGH);
    digitalWrite(D2, HIGH);
    digitalWrite(D3, HIGH);
    

}

void loop() {
    
    // Wiring instructions for playing with fusion 4ch thermocouple board 
    //Connect SO to A4
    //Connect SCK to A3
    //CS0-3 to D0-3
    

    
    t0 = readChip(0,true);
    t1 = readChip(1,true);
    t2 = readChip(2,true);
    t3 = readChip(3,true);
    
    
    if (t3 > maxtemp){
        maxtemp = t3;
    }
    
    Serial.print("The max temp recorded so far is:");
    Serial.print(maxtemp);
    Serial.println("");   
    
    sprintf(resultstr, "{\"t2\":%f,\"t3\":%f}", t2, t3); 
    delay(1000);
    
    Spark.publish("Temp", String(t3));
    

    
    if (setPoint && (t3 > setPoint)) {
    Serial.print("The measured temp exceeds the setpoint");
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
    delay(5);

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
    tempF =  ((float)thermoTemp*9.0/5.0+32.0);
    
    if (print == true) {
      Serial.print("T");
      Serial.print(chip);
      Serial.print(" = ");
      Serial.print(tempF);
      Serial.print(" F");
      Serial.println(""); 
    }
    delay(10);
    return tempF;
}

//This is the 'spark fucntion' that accepts the POST command from our Google App Script
int cookFunction(String command) 
{

  //Change the data recieved to a char    
  char *charCommand; 
  charCommand = strdup(command.c_str());
  //Initialize a helper variable to be used with strtok_r
  char *saveptr;
  
  //Parse the recieved command into usable local variables
  setPoint = strtod(strtok_r(charCommand, ",", &saveptr), NULL);
 // debug = strtod(strtok_r(charCommand, ",", &saveptr), NULL);
  cookType = strtok_r(NULL, ",", &saveptr);
  heatSourceTemp = strtod(strtok_r(NULL, ",", &saveptr), NULL);
  meatMass = strtod(strtok_r(NULL, ",", &saveptr), NULL);
  meatType = strtok_r(NULL, ",", &saveptr);
  meatDim = strtod(strtok_r(NULL, ",", &saveptr), NULL);
  
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
  
  
  //This section could execute a function that contained models when the cook command was recieved
  //Right now it does not do anything
  //The return of this function is the reply sent to the POST command and can pass data back to the App Script
  //look for the matching argument "cooknow" <-- max of 64 characters long
  if(command == "cooknow")
  {
    Serial.print("Cook Command Recieved!");
    return 1;
  }
  else return -1;
}
