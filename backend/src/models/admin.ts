export type AdminRegister = {
    name : string
    email :string
    password : string 
    phone : string
}

export type AdminLogin =  {
    email : string
    password : string
}

export type AdminPayLoad = {
    id : number
    email : string
}