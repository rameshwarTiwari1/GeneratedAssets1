import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch, Route } from "wouter";
import Dashboard from "./pages/dashboard";
import Auth from "./pages/auth";
import NotFound from "./pages/not-found";
import Profile from "./pages/profile";
import IndexDetail from "./pages/index-detail";
import HomePage from "./pages/home";
import MyIndexesPage from "./pages/myindexes";
// import MyIndexes from "./pages/myindexes";
function App() {
    return (_jsxs(Switch, { children: [_jsx(Route, { path: "/", component: HomePage }), _jsx(Route, { path: "/auth", component: Auth }), _jsx(Route, { path: "/dashboard", component: Dashboard }), _jsx(Route, { path: "/indexes", component: MyIndexesPage }), _jsx(Route, { path: "/profile", component: Profile }), _jsx(Route, { path: "/index/:id", component: IndexDetail }), _jsx(Route, { component: NotFound })] }));
}
export default App;
