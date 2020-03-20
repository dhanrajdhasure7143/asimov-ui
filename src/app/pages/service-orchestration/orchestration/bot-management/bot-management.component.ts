import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bot-management',
  templateUrl: './bot-management.component.html',
  styleUrls: ['./bot-management.component.css']
})
export class BotManagementComponent implements OnInit {
  feesDetails = {
    "id": 7,
    "uniqueId": "",
    "version": 0,
    "refNumber": "2018-08-22N1XMN",
    "bookingDate": "2018-08-22",
    "bookingFrom": "2018-08-23",
    "bookingTo": "2018-08-30",
    "rentAmount": 21950,
    "depositAmount": 9180,
    "depositPainOn": null,
    "rentPainOn": null,
    "depositPaid": false,
    "rentPaid": false,
    "bookingDetails": [
      {
        "id": 11,
        "uniqueId": "",
        "version": 0,
        "slot": {
          "id": 81,
          "uniqueId": "",
          "version": 1,
          "start": "2018-08-25 15:01:00",
          "end": "2018-08-25 18:30:00",
          "occupancy": 1,
          "shiftType": "SECOND",
          "occupiedCount": 1,
          "slotStatus": "TEMPORARY_BLOCKED",
          "bookingDetailIdentifier": null,
        },
        "rent": 2850,
        "electricCharges": 7500,
        "administrationCharges": 1000,
        "showTax": 100,
        "gstAmount": 0,
        "total": 11450,
        "cheked" : false
      },
      {
        "id": 12,
        "uniqueId": "",
        "version": 0,
        "slot": {
          "id": 41,
          "uniqueId": "",
          "version": 1,
          "start": "2018-08-25 09:01:00",
          "end": "2018-08-25 12:30:00",
          "occupancy": 1,
          "shiftType": "FIRST",
          "occupiedCount": 1,
          "slotStatus": "TEMPORARY_BLOCKED",
          "bookingDetailIdentifier": null,
        },
        "rent": 1900,
        "electricCharges": 7500,
        "administrationCharges": 1000,
        "showTax": 100,
        "gstAmount": 0,
        "total": 10500,
        "cheked" : false

      }
    ]
  }
  constructor() { }

  ngOnInit() {
  }
  CheckAllOptions(data) {
    console.log(data);
    
    if (this.feesDetails.bookingDetails.every(val => val.cheked == true))
      this.feesDetails.bookingDetails.forEach(val => { val.cheked = false });
    else
      this.feesDetails.bookingDetails.forEach(val => { val.cheked = true });
  }
  expression(data){
    console.log(data);
    
  }
  loopTrackBy(index, term){
    return index;
  }
}
