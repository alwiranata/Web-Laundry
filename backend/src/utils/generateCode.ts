export const generateUniqueCode = ()  : string =>{
    const now = Date.now().toString()
    return `ORD${now.slice(-6)}`
}