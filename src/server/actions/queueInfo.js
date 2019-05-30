// Get queue info
const main = (sbService, queueName) => {
  return new Promise((resolve, reject) => {
    return sbService.getQueue(queueName, function (err, data) {
      if (err) {
        console.log("error received", error);
        reject(error);
      } else {
        console.log("data returned", typeof data);
        resolve(data);
      }
    })
  });
}

export default main;