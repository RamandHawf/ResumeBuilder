require('dotenv').config();
	
const  config= {
    //two different keys for production and testing. 
    apiHost: 'https://api-test.nicehash.com', //use https://api-test.nicehash.com for development
    apiKey: process.env.API_KEY,
    //get it here: https://test.nicehash.com/my/settings/keys
    //or
    //https://new.nicehash.com/my/settings/keys
    apiSecret:process.env.API_SECRET,
    orgId: process.env.ORGID,
}
module.exports=config