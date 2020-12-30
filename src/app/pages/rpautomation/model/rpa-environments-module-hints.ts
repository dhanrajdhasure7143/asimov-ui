export class RpaconfigHints{
    public rpaenvhints = [
        { selector:'#listofenv', description:'List of Environment(s)',showNext:true  },
        { selector:'#addenvbtn', description:'Create an Environment',showNext:true },        
        { selector:'#updateenvbtn', description:'Update an Environment',showNext:true },
        { selector:'#deleteenvbtn', description:'Delete Environment(s)',showNext:true },
        { selector:'#deployenvbtn', description:'Deploy Agent(s)' }
     
    ]
     public rpadbchints = [
        { selector:'#listofdb', description:'List of Database Connections',showNext:true  },
        { selector:'#adddbbtn', description:'Create an Database Connection',showNext:true },        
        { selector:'#updatedbbtn', description:'Modify an Database Connection',showNext:true },
        { selector:'#deletedbbtn', description:'Delete Database Connection' }
     
    ]
}