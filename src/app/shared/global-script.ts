import { Injectable } from "@angular/core";
import { NotifierService } from 'angular-notifier';

@Injectable()
export class GlobalScript {

    constructor(private notifier:NotifierService){}

    notify(msg, type){
        this.notifier.show({
            type: type,
            message: msg
        });
    }
    notifyClose(){
        this.notifier.hideNewest()
    this.notifier.hideAll()
    this.notifier.hideOldest();
    
    }
}
