const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/checkUser' , (req , res) => {
    const {username} = req.body;
    db.query('SELECT username FROM tbluser WHERE username = ?' , [username] , (err , rows) => {
        if(err){
            throw err;
        }
        if(rows.length > 0){
            return res.status(400).json({msg: 'Username is already exist'});
        }
        res.status(200).json({msg: 'Username is already to use'});
    });
});

router.post('/register' , (req , res) => {
    const {fullname , username , password} = req.body;
    bcrypt.hash(password , 12 , (err , password_hash) => {
        if(err){
            throw err;
        }
        db.query('INSERT INTO tbluser (fullname , username , password) VALUES(? , ? , ?)' , [fullname , username , password_hash] , (err) => {
            if(err){
                throw err;
            }
            res.status(201).json({msg: 'Register your accout is successfully'});
        });
    });
});

router.post('/login' , (req , res) => {
    const {username , password} = req.body;
    db.query('SELECT * FROM tbluser WHERE username = ?' , [username] , (err , rows) => {
        if(err){
            throw err;
        }
        if(rows.length > 0){
            bcrypt.compare(password , rows[0].password , (err , result) => {
                if(err){
                    throw err;
                }
                if(result){
                    const token = jwt.sign({
                        data: rows[0].fullname
                    } , 'secretkey' ,{
                        "expiresIn": '1h'
                    });
                    res.status(200).json({msg: 'Login successfully' , token: token});
                }else{
                    res.status(400).json({msg: 'Invalid username or password'}); 
                }
            });
        }else{
            res.status(400).json({msg: 'Invalid username or password'});
        } 
    });
});

router.get('/authorized' , (req , res) => {
    const token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({msg: 'You do not have access to the information'});
    }else{
        jwt.verify(token , 'secretkey' , (err , decoded) => {
            if(err){
                res.status(403).json({msg: 'Invalid token'});
                throw err;
            }
            res.status(200).json({name : decoded.data});
        });
    }
});

module.exports = router;