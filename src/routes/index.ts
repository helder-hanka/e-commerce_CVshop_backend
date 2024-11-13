// import products from "./admin";
// import authAdmin from "./auths/admin";
import authAdminCvShop from "./auths/adminCvShop";
// import adminCvShop from "./adminCvShop";
// import authUser from "./auths/user";
// import user from "./user";

const api = "/api/";

export = (app: { use: (arg0: string, arg1: any) => void }) => {
  // app.use("/admin", products);
  // app.use("/admin-auth", authAdmin);
  app.use(`${api}admincvshop-auth`, authAdminCvShop);
  // app.use("/admin_cv_shop", adminCvShop);
  // app.use("/user-auth", authUser);
  // app.use("/user", user);
};
