export const getElementValue = (key: string, mappings: any, cardItemData: any) => {
    let val: any = undefined;
    if (key.indexOf('.')===-1){
      if (mappings[key] && cardItemData[mappings[key]]) {
        val = cardItemData[mappings[key]]
      } else {
        val = cardItemData[key]
      }
      
    }else{
      //child element mapping
    }
    
    return val;
  }