// eslint-disable import/prefer-default-export 
// package that bundles up query parameters given as an Object into URL syntax
import querystring from 'querystring';

// simple utility function to encode the given object as query parameters
// and return the resulting JSON
// NOTE: queryParameters contains values meant to be passed along with the URL
// (i.e., after the ?)
// NOTE: protocolOptions contains values meant to be passed along with the request
// (i.e., GET/POST, headers, etc.)
export async function getJSON(url, apiAction, queryParameters, protocolOptions) {
    const parameters = queryParameters ? `?${querystring.stringify(queryParameters)}` : '';
    const urlWithParameters = `${url}${apiAction}${parameters}`;
    console.log('getJSON', urlWithParameters);
    const response = await fetch(urlWithParameters, { credentials: 'include', ...(protocolOptions || {}) });

    // only convert response if request suceeded
    if (response.ok) {
        return response.json();
    }

    // FIXME: probably a better way to handle this - return an empty data object
    console.error(response);
    return {};
}
