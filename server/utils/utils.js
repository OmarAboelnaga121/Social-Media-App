
module.exports = checkAuth = () => {
    console.log('Checking authentication status...');
    if (!req.isAuthenticated()) {
        console.log('User is not authenticated.');
        res.send(false);
    }else{
        console.log('User is authenticated.');
        res.send(true);
    }
}