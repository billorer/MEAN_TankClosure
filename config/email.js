//EMAILS
const nodemailer = require('nodemailer');

module.exports = {
    sendEmail : function(data){
    	const transporter = nodemailer.createTransport({
    	    service: 'gmail',
    	    auth: {
            	type: 'OAuth2',
                user: 'zoran@suto.ro',
                clientId: '75594978998-q29vd6ancdngukru4j25fj1rnnd9clrv.apps.googleusercontent.com',
                clientSecret: 'CevhJSTLE5JpMdeRVO-GG7gz',
                refreshToken: '1/Ubz5p5Rqn_l4TQbLbfTExjF3VawGqeWGyKC71kkEwQ0DYJMOts67IGcDD1hjO72b',
                accessToken: 'ya29.GlsrBESwOfIpuyolYIqcI8PBM_Z6XlXS0p1-5mA7Yf8gZ0lrw_uBwf-cUQyc5elVg1mgX4xXwNPnpkbEm61DwavGBaTobd6kNisE-Sq9zD7CM0466Gu6uKt7_SXP',
    	    },
    	});

    	const mailOptions = {
    	    from: 'closureTank <zoran@suto.ro>',
    	    to: data.email,
    	    subject: 'Successful registration!',
    	    text: "Thank you for your registration!\n\r" +
                "Your name: " + data.first_name + " " + data.last_name + "\n\r" +
                "Your username: " + data.username + "\n\r" +
                "Your email address: " + data.email + "\n\r" +
                "For further information please contact zoran@suto.ro"
    	};

    	transporter.sendMail(mailOptions, function (err, res) {
    	    if(err){
                console.log('The resgistration email could not be sent!');
                return false;
            } else {
    	        console.log('The resgistration email was sent successfully!');
                return true;
            }
    	});
    }
};
