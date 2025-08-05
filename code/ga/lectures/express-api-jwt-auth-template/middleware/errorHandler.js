const logError = (err) => {
  console.log ('--------------------------------')
  console.log ('🚨🚨   EROOR   🚨🚨')
  console.log ('Error: ', err.message)
  console.log ('Name: ', err.name)
  console.log ('Status: ', err.status)
  console.log ('Field: ', err.field)
  console.log ('--------------------------------')
  console.log ('🔍  STACK TRACE  🔍')
  console.log (err.stack)
  console.log ('--------------------------------')
  console.log ('The above error occurred during the below request:')
}


const errorHandler = (err, req, res, next) => {
  if (err.name === 'InvalidDataError') {
    return res.status(err.status).json(err.response)
    
    // * Mongoose Validation Error
  if (err.name === 'ValidationError') {
  const response = {}

  for (const keyName in err.errors) {
    response[keyName] = err.errors[keyName].properties.message
  }

  return res.status(400).json(response)
}

// * Unique constraints (field value already exists)
if (err.name === 'MongoServerError' && err.code === 11000) {
  const [keyName, keyValue] = Object.entries(err.keyValue)[0]
  return res.status(400).json({
    message: `The ${keyName} ${keyValue} already exists.`,
    field: keyName
  })
}
// * Unautorhized
if (err.name === 'UnauthorizedError') {
  return res.status(401).json({ message: 'Unauthorized' })
}


// * Fallback response if no error has been identified
return res.status(500).json({ message: 'Internal Server Error' })


  
  } else {
    logError(err)
    res.status(500).json({ message: 'Internal server error' })
  }
  next(err)
}

export default errorHandler