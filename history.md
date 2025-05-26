

##  Changes

26/05/2025

  Refactored serviceController.ts ( previously controller/serviceRegister.ts)
    - added error handling for register and list services
    - added test cases under test/unit/serviceController.test.ts
      
  Refactored serviceRegistry.ts
    - made the file strictly Singelton by privatising constructor and the instance
    - list now returns a deep copy of the Map values ( made sure healthCheck, rateLimiter are not depending on directly modifying the services returned by the list)

  Refactored rateLimiter.ts
    - added error handling 

  Refactored proxyHandler.ts
    - added error handling 
