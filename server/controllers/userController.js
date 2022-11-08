const { Octokit } = require("@octokit/core");
const { createOAuthUserAuth } = require("@octokit/auth-oauth-user");
const {
  restEndpointMethods,
} = require("@octokit/plugin-rest-endpoint-methods");

const MyOctokit = Octokit.plugin(restEndpointMethods);

// Authenticate user on get.
async function get_access_token_on_get (req, res) {
    try {
        const auth = createOAuthUserAuth({
            clientId: req.app.get('clientId'),
            clientSecret: req.app.get('clientSecret'),
            code: req.query.code,
            scopes: 'user'
          });
    
        const { token } = await auth(); // request authentication token
    
        res.json({
            access_token: token
        })
    } catch ( RequestError ) {
        console.log('oops')
        res.status(500).json({
            error: RequestError.message
        });
    }
  };

// display user data on get
async function get_user_data_on_get (req, res) {
    try {
        // get Bearer token included in headers from frontend request
        // create octokit instance which we can use to query rest api endpoints
        const octokit = new MyOctokit({ auth: req.get('Authorization') }); 
        
        userData = await octokit.rest.users.getAuthenticated(); // Get authenticated users information
        res.json(userData.data)
    } catch (RequestError) {
        console.log('oopsie')
        res.status(500).json({
            error: RequestError.message
        });
    }
};

module.exports = { 
    get_user_data_on_get,
    get_access_token_on_get
}