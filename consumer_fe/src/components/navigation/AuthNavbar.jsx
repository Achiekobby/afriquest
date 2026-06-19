import NavbarShell from "./NavbarShell";
import AccountDropdown, { AccountMobileSection } from "./AccountDropdown";

export default function AuthNavbar() {
  const authActions = <AccountDropdown />;

  const authMobileActions = (
    <AccountMobileSection onNavigate={() => {}} />
  );

  return <NavbarShell actions={authActions} mobileActions={authMobileActions} />;
}
