const success = (message = "Success", data = null, code = 200) => {
  return {
    code,
    error: false,
    message,
    results: data,
  };
};

const error = (message = "Error", errors = null, code = 500) => {
  return {
    code,
    error: true,
    message,
    results: errors,
  };
};

export { success, error };
