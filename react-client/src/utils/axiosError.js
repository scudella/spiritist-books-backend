const axiosError = (error) => {
  if (error.response?.data) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(error.response.data);
    // console.log(error.response.status);
    // console.log(error.response.headers);
    return error.response.data.msg;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log(error.request);
    // return error.request;
    return 'No server response';
  } else {
    // Something happened in setting up the request that triggered an Error
    // console.log('Error', error.message);
    return error.message;
  }
  // console.log(error.config);
};

export default axiosError;
