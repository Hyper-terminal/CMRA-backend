   // src/types.d.ts
   import { Request } from 'express';

   declare module 'express-serve-static-core' {
     interface Request {
       user?: any;  // Adjust the type as necessary
     }
   }