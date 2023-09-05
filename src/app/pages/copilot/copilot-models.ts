export interface MessageData{
    uuid?:string,
    message?:any,
    components?:string[],
    values?:any,
    mappings?:any
}
export interface ButtonData {
    type?:string,
    label?: string
    submitValue?:any,
    disabled?:any
}
export interface MessageAction {
    actionType?: string,
    data?:any;
}
export interface ChatMessage {
    messageSourceType: string,
    data?:MessageData
}
export interface SelectedItem {
    submitValue?: any,
    label?:any
}

export interface MessageFormElement{
    
        "type"?:string,
        "name"?:string,
        "placeholder"?:string,
        "label"?:string,
        "required"?:boolean,
        "errorMessage"?:string,
        "value"?:string,
        "options"?:MessageFormElementOptions[]
        
        

}

export interface MessageFormElementOptions {
    
        "key"?:string,
        "value"?:string,
        
}

export interface UserMessagePayload{
    conversationId:string,
    message?:string,
    jsonData?:any
}

export interface SelectionList {
    label?:string,
    description?:string,
    icon?:string,
    items?:SelectionListItem[]
    submitValue?:string

}
export interface SelectionListItem {
    label?:string,
    id?:string,
    name?:string

}