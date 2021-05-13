/*
 * Keeps the app's secrets (anything that can be stolen and used inappropriately).
 *
 * Note, if we were using public GIT repository, this file would NOT be committed and pushed!
 *
 * @author Joseph Nagy
 */

// API Data 
exports.HOTEL_API = {
    URL: 'https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby',
    TOKEN: '4c4ad45605msha5568e011cc9bcfp196140jsn774959241e26',
};

exports.FLIGHT_API = {
    URL: 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/',
    TOKEN: '4c4ad45605msha5568e011cc9bcfp196140jsn774959241e26',
};

// WARNING: really lousy encryption key!
exports.COOKIE_ENCRYPTION_KEY = 'SECRET';

// These should represent the final URLs for your front- and backend projects
exports.DEPLOYED_URLS = {
    // TODO: change to Heroku and GitLab URLs, with a trailing slash
    SERVER: 'https://banana-crisp-68236.herokuapp.com/',
    VIEW: 'https://compsci290_2021spring.dukecs.io/portfolio_jn135/final/ui/dist/'
}

// This object was downloaded directly from Google Firebase Console to configure access
//   https://console.firebase.google.com/
exports.FIREBASE_CONFIG = {
    // TODO: fill this in with donloaded JSON data
    "type": "service_account",
    "project_id": "cs-290-final-7a544",
    "private_key_id": "9388fcdfcc59ace1034c36aee270c9f43146337a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDlO5HGfBsROm3p\nZpBuKwdH10EUIFbdpdpdt+ZhMcsSl9MHE3T8kkBviVS196iScur79wRj7HHkI22k\n7BD3d8PZMMS3otBjcF6FWgsvHBHoK+TZBUszlYeHTRhyZQrywhMmJrFppK0CLhab\nhu0EfZMyGzsWaXEczRVZOJP3OCkNWEQPpuxTzasZUiHIczO5+hxynNQOkphVgh2H\nNnNuVD3ZEloVQ933KhSyOxDEsf7abBzoAQF74qHM31Me0u0ee/bN20bdZo5TlPMk\ncFEl4XZt3qbYSyu03kH7yZj/aoCba97mnGVHxMZhcgP+6yoGKT7vdX+ZMyaoKVnp\nlerZORm1AgMBAAECggEAJR0lrzvpOvsZkAw7zqZ3TY2fmwVYYxcG+Zz8dxiTfy1n\nLJJdIsaAGb7joPmZyKpD+usFwjLmRrBowGa7IYH5ytifRPceo7buCsunG2fBS3SN\n3whBIncvg/u6vUy4PtEmvgrONyNDIqL5JJGuHsfBFP/9K1YDiwz2S6WCKWjllqP5\nHMw8zdcuTVDjaL1QjDsNYUiK0hAo41tF04hshG9t8oY9uL8hffn8mvZ4Tg6K3onH\nDtRPTLb1gaJEgGQZXa9oykYTUmsHFRtJR723UktpRcl7y7kNl9M2yma5ewoHwxcZ\nDq9ldcINmWFFQblErcGnWkNtJo4ITXlfnqe8c9D3kQKBgQD3ncXj8MubVBrueynG\nNp+5ti1/5yLhSDidDEA1PlruxgyFDEA0+Z/jK3wy4yDF38j3AzDL2J5f8/aby6ou\nKo2KQpN9EwPVinvdMrwPlziFOy/9ibOvB2xC2/LFO7HP6EVQeAlqRYSfTZ2AGaPC\nnSRKEg94Rh8YT9nXgM3MTei5RQKBgQDs/nSfv5NfNoDAJKV7QIUzlCz6eTB+J75z\nV5SVcba4/yZrzUZQ2QZgYZU8bqBbkYVOqjs8y/SqJ+eSp6EqwVHFedJ3BNFLHxaB\nxU++YaDXEHDMkBe95PJmouAvYm5hI8zt0jlAKeJQ8EJATjE6YKhVE8LF2gyrtbGi\ns6+S9Y6NsQKBgCcxJLJIWaGzNTQL8He8C5n0WM1Gw0GPEc7hsoP645+pXy/r2XnJ\nDOKC7nyLcJOBMSjPq3iIR8D+N0k/eicmexKoKPoB+XhiG+rN7fA1yi9kR9tEYVlR\nvnPypkFLioBSzi3HYg4dBLnGKiitZjsWbjj/FM2/o4pQkTVH4Mr2heBVAoGADIig\njlpJZv2w7XiCr/QHl2S8xDpokCN19Q+qsgSjj0EfPRBMKbZwmeRPSjTnkjAuBq0G\nGP8IX39gxebLpUE4G+OHd/fvQbPRMufGgeET6ovaC1eLieVz1G3EwXzJLaYBDorR\nsE0GxRUPy+rWu6mk/WrgICqaBPLFBD/Qh0spUOECgYEA4mkF9Lzrp5aqxHbke2yy\nWfpISC/E4iA+r5/bwajXTlbCdlnFmQ0hjNVaXev0Xppq6eI+LF6ORkPlnufvHqXD\ni/My7oR+NN5RuKB+CPpYu51n3LULu/st6aIyo2jXuYyeruJlTbZsBRAoCJMW4los\nRcGTShelSTp73v+8wPhq/40=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-jxrnk@cs-290-final-7a544.iam.gserviceaccount.com",
    "client_id": "115103090020757647851",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jxrnk%40cs-290-final-7a544.iam.gserviceaccount.com"
};

// This object was downloaded directly from Google Cloud Service Credentials Console to configure access
//   https://console.cloud.google.com/apis/credentials
exports.OAUTH = {
    // TODO: fill this in with donloaded JSON data
    "web": { 
        "client_id": "169311383791-d543b52ivnoj8ju14vaenlkm9pelpl2g.apps.googleusercontent.com", 
        "project_id": "civic-app-269416", "auth_uri": "https://accounts.google.com/o/oauth2/auth", 
        "token_uri": "https://oauth2.googleapis.com/token", 
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", 
        "client_secret": "dsj1IoHr3fGEvWnMQeS4bH5u", 
        "redirect_uris": ["http://localhost:3000/auth/google/redirect"] }
};