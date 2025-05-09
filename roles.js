// roles.js
const roles = {
  owner: ["create", "delete", "update", "read"],
  admin: ["update", "read"],
  user: ["read"],
};

module.exports = roles;
