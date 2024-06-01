export const saveToLocalStorage = (key:string, value: string) => {
    window.localStorage.setItem(key, value)
}

export const getItemFromLocalStorage = (key:string) => {
    return window.localStorage.getItem(key)
}


