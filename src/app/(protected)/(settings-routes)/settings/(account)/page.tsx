import type { Metadata } from "next";
import { AccountPage } from "./account-page";

export const metadata: Metadata = {
  title: "Account",
};

const Account = () => {
  return <AccountPage />;
};

export default Account;
