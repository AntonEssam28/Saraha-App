# SARAHA-APP [anonymous-messaging-app]

* send anonymous message or public message,
* view prfile with related messages
* handle message

- Tech Stack:
    - Express
    - JavaScriipt
    - monogoDB/Mongoose
    - redis [Caching]
    - nodemailer [email]
    - JWT [authentication]
    - bcrypt [password encryption]
    - oauth2 [login with google]
    - validation [Zod,Joi,Yup,Class-Validator]
    - error handling [AppError]

- Features:
    - authentication flow
        - register
        - verify email using OTP
        - login
        - reset password
        - send OTP
        - login with Google
        - logout
    - message flow:
        - sned a message [anonymous - public]
        - view message
        - delete message
    - user flow:
        - view profile
        - edit profile
        - delete profile
    - Guard:
        - authentication [token]

- OTP:
    - delete OTP after 10 min.
    - delete OTP after usage
    - store OTP temp.
        - database using mongodb support TTL [time to live][HDD]
        -into cache redis support TTL  PRFERRED [RAM] *50 faster more database

TODO
- Links:
    -verify-email:
        - /api/v1/auth/verify-email/:token
    -login:
        - /api/va/auth/login