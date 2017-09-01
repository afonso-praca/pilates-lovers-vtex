ignoreReplace = [/\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/,
  /\.woff(\?.*)?$/, /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/]

# Middleware that replaces vtexcommercestable and vteximg for vtexlocal
# This enables the same proxy to handle both domains and avoid adding rules to /etc/hosts
replaceHtmlBody = (environment) -> (req, res, next) ->
# Ignore requests to obvious non-HTML resources
  return next() if ignoreReplace.some (ignore) -> ignore.test(req.url)

  data = ''
  write = res.write
  end = res.end
  writeHead = res.writeHead
  proxiedStatusCode = null
  proxiedHeaders = null

  res.writeHead = (statusCode, headers) ->
    proxiedStatusCode = statusCode
    proxiedHeaders = headers

  res.write = (chunk) ->
    data += chunk

  res.end = (chunk, encoding) ->
    if chunk
      data += chunk

    if data
      data = data.replace(new RegExp(environment, "g"), "vtexlocal")
      data = data.replace(new RegExp("vteximg", "g"), "vtexlocal")

    # Restore res properties
    res.write = write
    res.end = end
    res.writeHead = writeHead

    if proxiedStatusCode and proxiedHeaders
      proxiedHeaders['content-length'] = Buffer.byteLength(data)
      res.writeHead proxiedStatusCode, proxiedHeaders

    res.end data, encoding

  next()

disableCompression = (req, res, next) ->
  req.headers['accept-encoding'] = 'identity'
  next()

rewriteLocationHeader = (rewriteFn) -> (req, res, next) ->
  writeHead = res.writeHead
  res.writeHead = (statusCode, headers) ->
    if headers and headers.location
      headers.location = rewriteFn(headers.location)
    res.writeHead = writeHead
    res.writeHead(statusCode, headers)
  next()

replaceHost = (host) -> (req, res, next) ->
  req.headers.host = host
  next()

errorHandler = (err, req) ->
  errString = err.code?.red ? err.toString().red
  console.log(errString, req.url.yellow)

module.exports =
  rewriteLocationHeader: rewriteLocationHeader
  replaceHost: replaceHost
  replaceHtmlBody: replaceHtmlBody
  disableCompression: disableCompression
  errorHandler: errorHandler