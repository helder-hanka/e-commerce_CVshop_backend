import app from "./app";
import { SERVER_PORT } from "./env";

const PORT = SERVER_PORT || 3000;

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on : ${PORT}`);
});
