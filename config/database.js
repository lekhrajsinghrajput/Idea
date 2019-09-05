if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI :'mongodb+srv://lekhraj:lekhraj@master-wqhtv.mongodb.net/test?retryWrites=true&w=majority'};
} else{
  module.exports = {mongoURI:'mongodb://localhost/idea-dev'};
}