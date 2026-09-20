 # DATABASE DESIGN

 * User:
  
 - name -> [String-reuired-minlength:3-maxlength:20-trim:true]
 - email -> [String-reuired--unique:true-trim:true-lowerCase:true]
 - password -> [String-InCaseProviderLocal->reuired]
 - provider -> [Google-facebook-'local']
 - isDeleted -> [Boolean]-[Defaut:False]
 - isVerified -> [Boolean]-[Defaut:False]
 - DoB -> [Date]
 - gender -> [String] - [Male-Female]
 - createdAt -> [Date]
 - updatedAt -> [Date]


 -------------------------


 * Message:

 - content -> [String-reuired-minlength:1-maxlength:200-trim:true]
 - reciever -> [ObjectId-required-ref:'User']
 - sender  -> [ObjectId-ref:'User']
 - isDelted -> [Boolean]-[Defaut:False]
 - createdAt -> [Date]
 - updatedAt -> [Date]

 --------------------------

 * OTP [OneTimePassword] TODO:switch to caching

- code -> [Sring-required-length:6]
- email -> [String-reuired--unique:true-trim:true-lowerCase:true]
- expiresAt -> [Date]
- createdAt -> [Date]
