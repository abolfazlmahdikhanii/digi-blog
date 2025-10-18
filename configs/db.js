const { default: mongoose } = require("mongoose");

const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) return;

    await mongoose.connect("mongodb://localhost:27017/digiblogs");
    console.log("Connection Successfully:)");
  } catch (error) {
    console.log("Connection Has Problem!!");
  }
};

export default connectToDB;
