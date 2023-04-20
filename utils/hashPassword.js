
const bcrypt=require("bcrypt");
async function hashPassword(password) {
  try {
    const hashP = await bcrypt.hash(password, 10);

    return hashP;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { hashPassword };
