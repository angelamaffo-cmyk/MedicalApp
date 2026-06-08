import { isDevMode } from "@angular/core";

export const environment = {
  production: !isDevMode(),
  apiUrl: 
  isDevMode()
  ?'http://localhost:8000/api'
  : 'https://medtrack-api-xke8.onrender.com/api'
};