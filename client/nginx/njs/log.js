function debugLog(r) {
  var connection = {
    "serial": Number(r.variables.connection),
    "request_count": Number(r.variables.connection_requests),
    "elapsed_time": Number(r.variables.request_time)
  }
  if (r.variables.pipe == "p") {
    connection.pipelined = true;
  } else {
    connection.pipelined = false;
  }
  if ( r.variables.ssl_protocol !== undefined ) {
    connection.ssl = sslInfo(r);
  }

  var request = {
    "client": r.variables.remote_addr,
    "port": Number(r.variables.server_port),
    "host": r.variables.host,
    "method": r.method,
    "uri": r.uri,
    "http_version": Number(r.httpVersion),
    "bytes_received": Number(r.variables.request_length)
  };
  request.headers = {};
  for (var h in r.headersIn) {
    request.headers[h] = r.headersIn[h];
  }

  var response = {
    "status": Number(r.variables.status),
    "bytes_sent": Number(r.variables.bytes_sent),
  }
  response.headers = {};
  for (var h in r.headersOut) {
    response.headers[h] = r.headersOut[h];
  }

  return JSON.stringify({
    "timestamp": r.variables.time_iso8601,
    "connection": connection,
    "request": request,
    "response": response
  });
}

export default { debugLog };
