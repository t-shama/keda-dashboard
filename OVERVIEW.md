# Overview

The KEDA Dashboard is divided into folders for each page in the site. For now, this consists of the scale controller dashboard, the scaled objects dashboard, and the scaled object dashboard. There is one component for each view, and each view consists of other components that are each of the panels on the web page. Each page has a method that returns its page components, and this method is then loaded in the content props for the sidebar nav. 

## General Dashboard Components

### AppBar and SideBarNav

`SideBarNav`: The sidebar navigation links to the scale controller dashboard ("Overview"), the scaled objects dashboard ("Scaled Objects"), and all currently deployed scaled objects. The sidebar navigation gets a list of all scaled objects by making an API call for the scaled object's namespace and name, and then constructing the link for that scaled object with this information. The SideBarNav class is a wrapper class for the SideNav component and is where API calls are made to get the current scaled objects and pass them in the props of the SideNav components. The primary reason why there is both a SideNav and a SideBarNav is because I needed `useStyles` to create CSS changes in a lot of my React components, but couldn't find a way to use `useStyles` in a component class.
	
`AppBar`: The app bar is included in the SideNav component. There are two app bar components that are being used--one that is meant only for the KEDA logo, and one that displays the breadcrumbs of the page you're currently on. The SideNav is also where it takes the list of breadcrumbs, formats them into React components. 
	
Any changes to be made to either the app bar or the side bar should therefore be made in the SideNav component, and any data that should be retried through API calls should be made in SideBarNav (apologies for the name confusion!).

### Loading View

`LoadingView` is a simple component; the most important thing to note about it is that it is used in every page that makes asynchronous API calls (`ScaleControllerDashboard`, `ScaledObjectDetailsDashboard`, and `ScaledObjectsDashboard`) so that it does not render the page until everything has been loaded. This is necessary so that the page doesn't look empty by rendering its components without the data in it.


## Scale Controller Dashboard components

### ScaleControllerDashboard 

`ScaleControllerDashboard` is the class that renders two main pieces of information: logs about your KEDA deployment and its scaling decisions, and details about your KEDA deployment. All API calls are made in `componentDidMount`, and calls are made to get logs every 5 seconds and update the log panel. Since this is where your KEDA deployment's logs are fetched, log parsing also occurs in this class. 

`formatLogs` parses through every line in the log and displays all except those emitting logs for historical data about a scaled object's replica count or metrics. An important thing to note that if you choose to change the way the Scaled Object's replica count and metrics are emitted in the longs, the regexes **must** be changed here too.

### ScaleControllerDetailPanel 

`ScaleControllerDetailPanel` primarily displays your KEDA deployment's information in a panel. The most notable thing to note about the panel is the `listChips` method, which formats a list into `Chip` components. I created a constant component called `ScaleControllerDetail` which took in a detailName and detailValue, but it became difficult to determine whether or not `detailValue` was a list or just one value, so I ended up creating another prop called `detailValueList` to only take list items in so that `ScaleControllerDetail` knew whether or not to display `Chips` or just a `Typography` element based on which prop was given. I did not do anything to validate that (between `detailValue` and `detailValueList`) so this might cause some bugs or issues.

### ScaleControllerLogPanel

`ScaleControllerLogPanel` displays all given KEDA logs. It mainly deals with the React components that create the panels so this would only need to be changed for UI changes (such as filtering logs).

## Scaled Objects Dashboard components

`ScaledObjectsDashboard` is a relatively simply page, as it tries to find general information about all scaled objects and their associated deployments and HPAs. Not all API calls are made only in the dashboard component - they are also made in the `ScaledObjectsTable` component (primarily because we only get the name and namespace of the scaled object in the first API call made by 
`ScaledObjectsDashboard`.
