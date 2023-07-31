/**
 * Processes the body from the upstream, chunk by chunk, and
 * applies substitutions before passing them back to the client.
 *
 * @param {Object}  r     - The njs request object
 * @param {string}  chunk - A piece of the response from the upstream
 * @param {Object}  flags - A object containing the key `last` with a boolean value denoting whether
 *                          the chunk is the last in the response
 */
function injectEnvVariables(r, chunk, flags) {

  const env = {};

  for (const key in process.env) {
    if (key.startsWith('REACT_APP')) {
      env[key] = process.env[key];
    }
  }

  const newData = `
    <script>
      window.__ENV__ = ${JSON.stringify(env)};
    </script>
  `;

  const updatedResponse = new TextDecoder().decode(chunk).replace(/(<head>)/, '$1' + newData);

  r.sendBuffer(updatedResponse, flags);
}

/**
 * Deletes the `Content-Length` header from the response.
 * If this is done, nginx will provide the
 * `Transfer-Encoding: chunked` header.
 *
 * @param {Object}  r - The njs request object
 */
function removeContentLengthHeader(r) {
  delete r.headersOut['Content-Length'];
}

export default {
  injectEnvVariables,
  removeContentLengthHeader
};
