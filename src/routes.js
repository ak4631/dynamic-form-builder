/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Main application pages
import Opticore from "layouts/pages/opticore";

// Soft UI Dashboard React icons
import SpaceShip from "examples/Icons/SpaceShip";
import OptiForm from "layouts/pages/optiform";
import OptiFormIntake from "layouts/pages/intake";
import OptiView from "layouts/pages/optiview";
import LayoutPreview from "layouts/pages/layoutpreview";
import OptiLayout from "layouts/pages/optilayout";
import ActivityTypeMaster from "layouts/pages/activityTypeMaster";
import Relationship from "layouts/pages/manageRelationship";
import ActivityType from "layouts/pages/activityType";
import UserIntake from "layouts/pages/userIntake";

const routes = [
  // {
  //   type: "collapse",
  //   name: "OptiCore Manager",
  //   key: "opticore",
  //   route: "/opticore",
  //   icon: <SpaceShip size="12px" />,
  //   component: <Opticore />,
  //   noCollapse: true,
  //   visible: true,
  // },
  {
    type: "collapse",
    name: "OptiForm Builder",
    key: "optiform",
    route: "/optiform",
    icon: <SpaceShip size="12px" />,
    component: <OptiForm />,
    noCollapse: true,
    visible: false,
  },
  // {
  //   type: "collapse",
  //   name: "OptiForm Builder",
  //   key: "optiform",
  //   route: "/optiform/:id/:id",
  //   icon: <SpaceShip size="12px" />,
  //   component: <OptiForm />,
  //   noCollapse: true,
  //   visible: false,
  // },
  // {
  //   type: "collapse",
  //   name: "OptiLayout Manager",
  //   key: "optilayout",
  //   route: "/layout/",
  //   icon: <SpaceShip size="12px" />,
  //   component: <OptiLayout />,
  //   noCollapse: true,
  //   visible: true,
  // },
  // {
  //   type: "collapse",
  //   name: "User Intake",
  //   key: "userIntake",
  //   route: "/user-intake/",
  //   icon: <SpaceShip size="12px" />,
  //   component: <UserIntake />,
  //   noCollapse: true,
  //   visible: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Optiview",
  //   key: "optiview",
  //   route: "/layoutbuilder",
  //   icon: <SpaceShip size="12px" />,
  //   component: <OptiView />,
  //   noCollapse: true,
  //   visible: false,
  // },
  // route for activity-type-master
  // {
  //   type: "collapse",
  //   name: "Activity Template",
  //   key: "activity-template",
  //   route: "/activity-template/",
  //   icon: <SpaceShip size="12px" />,
  //   component: <ActivityType />,
  //   noCollapse: true,
  //   visible: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Optiview",
  //   key: "optiview",
  //   route: "/layoutbuilder/:id",
  //   icon: <SpaceShip size="12px" />,
  //   component: <OptiView />,
  //   noCollapse: true,
  //   visible: false,
  // },
  {
    type: "collapse",
    name: "LayoutPreview",
    key: "layoutpreview",
    route: "/layout/:id",
    icon: <SpaceShip size="12px" />,
    component: <LayoutPreview />,
    noCollapse: true,
    visible: false,
  },
  // {
  //   type: "collapse",
  //   name: "Manage Relationship",
  //   key: "manage_relationship",
  //   route: "/manage_rel/:id",
  //   icon: <SpaceShip size="12px" />,
  //   component: <Relationship />,
  //   noCollapse: true,
  //   visible: false,
  // },
  // {
  //   type: "collapse",
  //   name: "Manage Module Activities",
  //   key: "module-activities",
  //   route: "/module-activities/:id",
  //   icon: <SpaceShip size="12px" />,
  //   component: <ActivityType />,
  //   noCollapse: true,
  //   visible: false,
  // },
  // {
  //   type: "collapse",
  //   name: "Data Intake",
  //   key: "intake",
  //   route: "/optiform/intake/:id",
  //   icon: <SpaceShip size="12px" />,
  //   component: <OptiFormIntake />,
  //   noCollapse: true,
  //   visible: false,
  // },

  /* {
    type: "collapse",
    name: "Logout",
    key: "logout",
    route: "/logout",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
    visible: false,
  }, */

];

export default routes;
