import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
transform(items, term) {
    if (!term || !items)
        return items;
    return FilterPipe.filter(items, term);
}
    static filter(items, term) {
    const toCompare = term.toLowerCase();
    function checkInside(item, term) {
        var objk = Object.keys(item);
        for (let property in item) {
            var ind = objk.indexOf(property);
            var k= objk[ind];
            if (item[property] === null || item[property] == undefined) {
                continue;
            }
            if (typeof item[property] === 'object') {
                console.log(item[property]);
                if (checkInside(item[property], term)) {
                    return true;
                }
            }
            if(k =="modifiedTimestamp"){
                var arr = item[property].slice(0,10).split("-");
                var arr1 = item[property].slice(11).split(":");
                var date = arr[1] + '/'+ arr[2]+'/'+arr[0]+' '+arr1[0]+':'+arr1[1]+':'+arr1[2];
                if(date.includes(toCompare)){
                    return true;
                }
             }
             if(typeof item[property]=="string"){
                if(k=="approverName"){
                    let appr_arr = item[property].split('.');
                    let fName = appr_arr[0];
                    let lName = appr_arr[1];
                    let approver_name="";
                      approver_name = fName+" "+lName;
                      if(approver_name.includes(toCompare)) {
                          return true;
                      }
                 }
                 if(item[property].toString().toLowerCase().includes(toCompare)){
                         return true;
                 }
             }
             
            //  if(item[property].toString().toLowerCase().includes(toCompare)){
            //     return true;
            // }
            
            if(k=="version"){
                var ver = 'v1'+'.'+item[property];
                if(ver.includes(toCompare)){
                    return true;
                }
            }
            
        }
        return false;
    }
    return items.filter(function (item) {
        return checkInside(item, term);
    });
}

}






