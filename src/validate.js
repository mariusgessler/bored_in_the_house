const validateActivity = (activity) => {
  if ((!/^[a-zA-Z0-9]{4,35}$/).test(activity)) {
    const msg = 'Please make sure your activity hast between 4 and 35 letters and contains no special characters - Thanks!😌';
    return { validated: true, msg };
  }
  const formattedActivity = activity.charAt(0).toUpperCase + activity.slice(1);
  const msg = `Thanks, '${formattedActivity}' will be added to our database!😎`;
  return { validated: true, msg };
};

module.exports = {
  validateActivity,
};
