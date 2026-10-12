import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDashboard from "./pages/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import GovernancePage from "./pages/GovernancePage";
import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";
import SurveyAdminPage from "./pages/SurveyAdminPage";
import SurveyPage from "./pages/SurveyPage";
import AdminLoginPage from "./AdminLoginPage";
import MobileBottomNav from "./components/MobileBottomNav";
import { MobileRouteFrame, MobileRouteTransitionProvider } from "./components/MobileRouteTransition";

/**
 * توجه «الأثر الأخضر»: تطبيق عربي مؤسسي بهوية زراعية دافئة وواضحة.
 * لوحة الإدارة محميّة بصفحة دخول منفصلة على /admin/login.
 */
function Router() {
  return (
    <MobileRouteFrame>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/about"} component={AboutPage} />
        <Route path={"/contact"} component={ContactPage} />
        <Route path={"/governance"} component={GovernancePage} />
        <Route path={"/admin/login"} component={AdminLoginPage} />
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/admin/surveys"} component={SurveyAdminPage} />
        <Route path={"/survey"} component={SurveyPage} />
        <Route path={"/news/:id"} component={NewsDetail} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </MobileRouteFrame>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <MobileRouteTransitionProvider>
            <Toaster />
            <Router />
            <MobileBottomNav />
          </MobileRouteTransitionProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
