const users = require("./users");

function validateClientInfo(clientInfo) {
  const phoneNumber = clientInfo.phoneNumber;
  const address = clientInfo.address;
  const email = clientInfo.email;

  if (!isPhoneNumberValid(phoneNumber)) {
    return "Invalid phone number";
  }
  if (!isAddressValid(address)) {
    return "Invalid address";
  }
  if (!isEmailValid(email)) {
    return "Invalid email";
  }

  return "";
}

function isPhoneNumberValid(phoneNumber) {
  let isValid = true;
  isValid = !!phoneNumber && phoneNumber.trim();
  isValid = phoneNumber.match(/^[0-9]+$/);
  return isValid;
}

function isAddressValid(address) {
  let isValid = true;
  isValid = !!address && address.trim();
  return isValid;
}

function isEmailValid(email) {
  let isValid;
  isValid = !!email && email.trim();
  isValid = email.includes("@");
  return isValid;
}

function getUserInfo(username) {
  const userData = users.getUserData(username);
  if (!userData) {
    return {};
  }
  return userData.info;
}

function addInfo(username, clientInfo) {
  // Validate
  const errorMessage = validateClientInfo(clientInfo);
  if (errorMessage) {
    return errorMessage;
  }

  // Update user data
  users.updateUserData({
    username,
    key: "info",
    newData: clientInfo,
  });

  return clientInfo;
}

module.exports = {
  getUserInfo,
  addInfo,
};
