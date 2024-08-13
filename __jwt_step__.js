/**
 * install token
    1. install JsonWebTokenError
    2. jwt.sign(playLoad, secret, { expiresIn:})
    3. token send in client size
     How to store token in the client side
        i) memory
        ii)local Storage
        iii) http cookieParser(install cookie parser)

 */
/**
 * 1. set cookies with 
 *    i)httpOnly: true,
      ii)secure: false,
      iii)sameSite: 'none',
      for development
   2.cors
      app.use(cors({
    //this origin and credentials set up for cookies becouse cookies is work in same port but my server and client side ar work in difference port 
    origin: ['http://localhost:5173'],
    credentials: true

}));
   3.client side axios setting
   in axios set withCredential: true
 */