const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const formatActivity = (activity) => activity.trim().charAt(0).toUpperCase() + activity.substring(1).toLowerCase();

const validateActivity = (activity) => {
  const regex = /^[-0-9a-zA-Z/,!\s]{4,35}$/;

  if (!regex.test(activity)) {
    const msg = 'Please make sure your activity has between 4 and 35 letters and contains no special characters - Thanks!😌';
    return { validated: false, msg };
  }
  const formattedActivity = formatActivity(activity);
  const msg = `Thanks, '${formattedActivity}' will be added to our database!😎`;
  return { validated: true, msg, activity: formattedActivity };
};

module.exports = {
  getRandom,
  formatActivity,
  validateActivity,
};
