import React from "react"
import { createBrowserRouter } from "react-router"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { PublicRoute } from "./components/PublicRoute"
import { CoverPage } from "./pages/CoverPage"
import { FoundationsPage } from "./pages/FoundationsPage"
import { ComponentsPage } from "./pages/ComponentsPage"
import { FlowsPackagesPage } from "./pages/FlowsPackagesPage"
import { PKG01PackagesHomePage } from "./pages/PKG01PackagesHomePage"
import { PKG02PackageDetailPage } from "./pages/PKG02PackageDetailPage"
import { PKG03CheckoutPage } from "./pages/PKG03CheckoutPage"
import { PKG04SuccessPage } from "./pages/PKG04SuccessPage"
import { PKG05PackageDashboardPage } from "./pages/PKG05PackageDashboardPage"
import { PKG06UsageHistoryPage } from "./pages/PKG06UsageHistoryPage"
import { PKG07MyPackagesPage } from "./pages/PKG07MyPackagesPage"
import { DEP01DependentsListPage } from "./pages/DEP01DependentsListPage"
import { DEP02AddDependentPage } from "./pages/DEP02AddDependentPage"
import { DEP03EditDependentPage } from "./pages/DEP03EditDependentPage"
import { DEP04DependentProfilePage } from "./pages/DEP04DependentProfilePage"
import { DEP06ConfirmRemovePage } from "./pages/DEP06ConfirmRemovePage"
import { APR01ApprovalsInboxPage } from "./pages/APR01ApprovalsInboxPage"
import { APR02RequestDetailPage } from "./pages/APR02RequestDetailPage"
import { APR03EnterPinPage } from "./pages/APR03EnterPinPage"
import { APR04ApprovedSuccessPage } from "./pages/APR04ApprovedSuccessPage"
import { APR05PinResetPage } from "./pages/APR05PinResetPage"
import { APR06DeclineReasonPage } from "./pages/APR06DeclineReasonPage"
import { APR07DeclinedSuccessPage } from "./pages/APR07DeclinedSuccessPage"
import { APR08ApprovalCodePage } from "./pages/APR08ApprovalCodePage"
import { APR09RequestExpiredPage } from "./pages/APR09RequestExpiredPage"
import { APR10ConnectionErrorPage } from "./pages/APR10ConnectionErrorPage"
import { FlowsDependentsPage } from "./pages/FlowsDependentsPage"
import { FlowsApprovalsPage } from "./pages/FlowsApprovalsPage"
import { FlowsCareTrackingPage } from "./pages/FlowsCareTrackingPage"
import { CARE01CareHomePage } from "./pages/CARE01CareHomePage"
import { CARE02VisitDetailPage } from "./pages/CARE02VisitDetailPage"
import { CARE03DocumentsPage } from "./pages/CARE03DocumentsPage"
import { CARE04ReceiptsPage } from "./pages/CARE04ReceiptsPage"
import { MorePage } from "./pages/MorePage"
import { SET01ProfileSettingsPage } from "./pages/SET01ProfileSettingsPage"
import { SET02SecurityPinPage } from "./pages/SET02SecurityPinPage"
import { SET02AChangePinPage } from "./pages/SET02AChangePinPage"
import { SET02BResetPinPage } from "./pages/SET02BResetPinPage"
import { SET03NotificationsPage } from "./pages/SET03NotificationsPage"
import { SET04PaymentMethodsPage } from "./pages/SET04PaymentMethodsPage"
import { SET05PrivacyPolicyPage } from "./pages/SET05PrivacyPolicyPage"
import { SET06TermsOfServicePage } from "./pages/SET06TermsOfServicePage"
import { SET07HelpSupportPage } from "./pages/SET07HelpSupportPage"
import { HOME01HomePage } from "./pages/HOME01HomePage"
import { HOME02NotificationsPage } from "./pages/HOME02NotificationsPage"
import { FAC01FacilitiesListPage } from "./pages/FAC01FacilitiesListPage"
import { FAC02FacilityProfilePage } from "./pages/FAC02FacilityProfilePage"
import { AUTH01WelcomePage } from "./pages/AUTH01WelcomePage"
import { AUTH02EnterPhonePage } from "./pages/AUTH02EnterPhonePage"
import { AUTH03VerifyOTPPage } from "./pages/AUTH03VerifyOTPPage"
import { AUTH04ConsentPage } from "./pages/AUTH04ConsentPage"
import { AUTH05CreatePINPage } from "./pages/AUTH05CreatePINPage"
import { AUTH06SuccessPage } from "./pages/AUTH06SuccessPage"
import { AUTH06BCompleteProfilePage } from "./pages/AUTH06BCompleteProfilePage"
import { AUTH07EnterPINPage } from "./pages/AUTH07EnterPINPage"
import { AUTH08AResetPINPage } from "./pages/AUTH08AResetPINPage"
import { AUTH08CSetNewPINPage } from "./pages/AUTH08CSetNewPINPage"
import { AUTH08DDonePage } from "./pages/AUTH08DDonePage"
import { AUTH09LogoutConfirmPage } from "./pages/AUTH09LogoutConfirmPage"
import { FlowsAuthPage } from "./pages/FlowsAuthPage"
import { FlowsWalletPage } from "./pages/FlowsWalletPage"
import { WAL01WalletHomePage } from "./pages/WAL01WalletHomePage"
import { WAL02TopUpPage } from "./pages/WAL02TopUpPage"
import { WAL02APaymentSentPage } from "./pages/WAL02APaymentSentPage"
import { WAL03TransactionsPage } from "./pages/WAL03TransactionsPage"
import { WAL04TransactionDetailPage } from "./pages/WAL04TransactionDetailPage"
import { BOOK01BookVisitPage } from "./pages/BOOK01BookVisitPage"
import { BOOK02BookingSubmittedPage } from "./pages/BOOK02BookingSubmittedPage"
import { BOOK03MyBookingsPage } from "./pages/BOOK03MyBookingsPage"
import { BOOK04BookingDetailPage } from "./pages/BOOK04BookingDetailPage"

export const router = createBrowserRouter([

  // ── Public routes ────────────────────────────────────────────────────────
  // Logged-in users are redirected to /home-01 from these pages
  {
    element: React.createElement(PublicRoute),
    children: [
      { path: "/",        Component: AUTH01WelcomePage },
      { path: "/auth-01", Component: AUTH01WelcomePage },
      { path: "/auth-07", Component: AUTH07EnterPINPage },
    ],
  },

  // ── Signup & PIN reset flow ───────────────────────────────────────────────
  // No auth gate: user may or may not have a session during onboarding
  // auth-02 is standalone (not inside PublicRoute) so onAuthStateChange mid-signup
  // cannot trigger PublicRoute's redirect and abort the flow
  { path: "/auth-02",  Component: AUTH02EnterPhonePage },
  { path: "/auth-03",  Component: AUTH03VerifyOTPPage },
  { path: "/auth-04",  Component: AUTH04ConsentPage },
  { path: "/auth-05",  Component: AUTH05CreatePINPage },
  { path: "/auth-06",  Component: AUTH06SuccessPage },
  { path: "/auth-06b", Component: AUTH06BCompleteProfilePage },
  { path: "/auth-08",  Component: AUTH08AResetPINPage },
  { path: "/auth-08c", Component: AUTH08CSetNewPINPage },
  { path: "/auth-08d", Component: AUTH08DDonePage },

  // ── Always public ─────────────────────────────────────────────────────────
  // Linked from pre-auth screens (consent, login help)
  { path: "/set-05", Component: SET05PrivacyPolicyPage },
  { path: "/set-06", Component: SET06TermsOfServicePage },
  { path: "/set-07", Component: SET07HelpSupportPage },

  // ── Protected routes ──────────────────────────────────────────────────────
  // Unauthenticated users are redirected to /auth-01
  {
    element: React.createElement(ProtectedRoute),
    children: [
      { path: "/home-01", Component: HOME01HomePage },
      { path: "/home-02", Component: HOME02NotificationsPage },

      { path: "/pkg-01",          Component: PKG01PackagesHomePage },
      { path: "/pkg-02/:packageId", Component: PKG02PackageDetailPage },
      { path: "/pkg-03",          Component: PKG03CheckoutPage },
      { path: "/pkg-04",          Component: PKG04SuccessPage },
      { path: "/pkg-05",          Component: PKG05PackageDashboardPage },
      { path: "/pkg-06",          Component: PKG06UsageHistoryPage },
      { path: "/pkg-07",          Component: PKG07MyPackagesPage },

      { path: "/dep-01", Component: DEP01DependentsListPage },
      { path: "/dep-02", Component: DEP02AddDependentPage },
      { path: "/dep-03", Component: DEP03EditDependentPage },
      { path: "/dep-04", Component: DEP04DependentProfilePage },
      { path: "/dep-06", Component: DEP06ConfirmRemovePage },

      { path: "/apr-01", Component: APR01ApprovalsInboxPage },
      { path: "/apr-02", Component: APR02RequestDetailPage },
      { path: "/apr-03", Component: APR03EnterPinPage },
      { path: "/apr-04", Component: APR04ApprovedSuccessPage },
      { path: "/apr-05", Component: APR05PinResetPage },
      { path: "/apr-06", Component: APR06DeclineReasonPage },
      { path: "/apr-07", Component: APR07DeclinedSuccessPage },
      { path: "/apr-08", Component: APR08ApprovalCodePage },
      { path: "/apr-09", Component: APR09RequestExpiredPage },
      { path: "/apr-10", Component: APR10ConnectionErrorPage },

      { path: "/care-01", Component: CARE01CareHomePage },
      { path: "/care-02", Component: CARE02VisitDetailPage },
      { path: "/care-03", Component: CARE03DocumentsPage },
      { path: "/care-04", Component: CARE04ReceiptsPage },

      { path: "/wal-01",         Component: WAL01WalletHomePage },
      { path: "/wal-02",         Component: WAL02TopUpPage },
      { path: "/wal-02a",        Component: WAL02APaymentSentPage },
      { path: "/wal-03",         Component: WAL03TransactionsPage },
      { path: "/wal-04/:txId",   Component: WAL04TransactionDetailPage },

      { path: "/book-01", Component: BOOK01BookVisitPage },
      { path: "/book-02", Component: BOOK02BookingSubmittedPage },
      { path: "/book-03", Component: BOOK03MyBookingsPage },
      { path: "/book-04", Component: BOOK04BookingDetailPage },

      { path: "/fac-01",            Component: FAC01FacilitiesListPage },
      { path: "/fac-02/:facilityId", Component: FAC02FacilityProfilePage },

      { path: "/more",    Component: MorePage },
      { path: "/set-01",  Component: SET01ProfileSettingsPage },
      { path: "/set-02",  Component: SET02SecurityPinPage },
      { path: "/set-02a", Component: SET02AChangePinPage },
      { path: "/set-02b", Component: SET02BResetPinPage },
      { path: "/set-03",  Component: SET03NotificationsPage },
      { path: "/set-04",  Component: SET04PaymentMethodsPage },

      { path: "/auth-09", Component: AUTH09LogoutConfirmPage },
    ],
  },

  // ── Dev / demo pages ──────────────────────────────────────────────────────
  // No auth gate — design review and flow previews
  { path: "/cover",               Component: CoverPage },
  { path: "/foundations",         Component: FoundationsPage },
  { path: "/components",          Component: ComponentsPage },
  { path: "/flows-auth",          Component: FlowsAuthPage },
  { path: "/flows-packages",      Component: FlowsPackagesPage },
  { path: "/flows-dependents",    Component: FlowsDependentsPage },
  { path: "/flows-approvals",     Component: FlowsApprovalsPage },
  { path: "/flows-care-tracking", Component: FlowsCareTrackingPage },
  { path: "/flows-wallet",        Component: FlowsWalletPage },
])
