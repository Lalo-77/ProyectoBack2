import { Router } from "express";
import passport from "passport";

const  router = Router();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));  

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }),  
        (req, res) => {  
            
            res.redirect('/');  
        });  

export default router;