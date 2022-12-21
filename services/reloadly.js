require('dotenv').config()
const axios= require('axios')

 
 
const getToken = async()=>{
    return await axios({
            method: "post",
            url: "https://auth.reloadly.com/oauth/token",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                "client_id": "zCzkxxDVcI3x8ddMOvUS4uzHQtD671Y5",
                "client_secret": "MDeRGl4zuw-3rFblpUHKF5qUs7YtW0-1vEhkH082vMYz1SRuVqHkJUaPX2vzoYO",
                "grant_type": "client_credentials",
                "audience": "https://topups-sandbox.reloadly.com"
            } 
                 
    })
}


const getOperatorList = async () =>{
    const accessToken = await getToken()
   
    return axios({
        url : 'https://topups-sandbox.reloadly.com/operators/countries/NG',
        method: 'GET',
        headers: {
        Accept: 'application/com.reloadly.topups-v1+json',
        Authorization: `Bearer ${accessToken.data.access_token}`
  }
})

}



const topUp = async(amount, phone, operatorId) =>{
    const accessToken = await getToken()
    return axios(
       {
         url: process.env.RELOADLY_BASEURL,
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         Authorization: `Bearer ${accessToken.data.access_token}`
         },
         body: JSON.stringify({
           operatorId: operatorId,
           amount: amount,
           useLocalAmount: false,
           customIdentifier: 'airtime-top-up',
           recipientPhone: {
             countryCode: countryCode || "+234",
             number: phone
           },
           senderPhone: {
             countryCode: countryCode  || "+234",
             number: number
           }
         })
       }
     );
    
}

   
 module.export = {getToken, getOperatorList, topUp}
  