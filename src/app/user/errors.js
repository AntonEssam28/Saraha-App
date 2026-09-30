import {AppError} from "../../common/error/error.js";

export const userNotExist = new AppError ('User not Exists.',404)
export const userAlreadyExist = new AppError ('User Already Exists.',409)
export const userAlreadyVerified = new AppError ('User Already Verified.',400)
export const userNotVerified = new AppError ('User Not Verified.',403)

// class User{
//     userName;
//     email;
//     password;
    
//     constructor(userName,email,password){
//         this.userName=userName;
//         this.email=email;
//         this.password=password;
//     }
// }

// const user = new User('Anton Essam','a@y.com','12345')

// class Customer extends User {  //3mlna inhertance en el customer ya5od bardo el hagat ely gowa elk user
//     phone;
//     age;
//     address;
//     isVerified;
//     isDeleted;

//     constructor(userName,email,password,phone,age,address){
//         super(userName,email,password);
//         this.phone=phone;
//         this.age=age;
//         this.address=address;
//         this.isVerified=false;
//         this.isDeleted=false
//     }
// }

// const customer =  new Customer ('New Anton Essam','a@y.com','12345','01273236667',25,'E;nozha')
