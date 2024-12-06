router.post('/signup', (req, res) => {
    const { user_type, shop_name, name, mobile, email ,password} = req.body;
    
    // Sample response for now
    res.json({
        message: "User registered successfully",
        user: {
            user_type,
            shop_name,
            name,
            mobile,
            email,
            password
        }
    });
});
