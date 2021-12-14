import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  keyBase64 = ')>epsftcloudplatforml23s#434'

  encrypt(plainText) {
/*below function gennerates the AES key using the CBC and PCKS5 Padding, 
the Key is generated based from the UTF format that is generated, 
this Gives the Flexibility of high security using 256 bit Encryption of AES. Also uses Crypto JS library */

    var keyUtf8 = CryptoJS.enc.Utf8.parse('1234567890123456');
    var ivUtf8 = CryptoJS.enc.Utf8.parse('1234567890123456');
    var ciphertext = CryptoJS.AES.encrypt(plainText, keyUtf8,{
      iv: ivUtf8
    });
    return ciphertext.toString();
  };

  decrypt(decryptMessage) {
    var keyUtf8 = CryptoJS.enc.Utf8.parse('1234567890123456');
    var ivUtf8 = CryptoJS.enc.Utf8.parse('1234567890123456');
    var decrypt = CryptoJS.AES.decrypt(decryptMessage, keyUtf8,{
      iv: ivUtf8
    });     
   return CryptoJS.enc.Utf8.stringify(decrypt).toString();  
  }

}
