import CustomAPIError from "./custom-api.js";

class notAuthorized extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export default notAuthorized;
