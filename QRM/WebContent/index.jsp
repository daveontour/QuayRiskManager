<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="java.io.File"%>
<%@ page import="java.util.Properties"%>
<%@ page import="javax.servlet.ServletContextAttributeEvent"%>
<%@ page import="javax.servlet.ServletContextAttributeListener"%>
<%@ page import="javax.servlet.ServletContextEvent"%>
<%@ page import="javax.servlet.ServletContextListener"%><html>
<head>
<title>Quay Risk Manager</title>

<!-- <link rel="stylesheet" href="http://cdn.sencha.io/ext/gpl/4.2.0/resources/css/ext-all.css"/> -->
<!-- <link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all.css">  -->
<link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all-gray.css"> 
<link rel="StyleSheet" href="./style/qrm_styles.css" type="text/css" />

<script type="text/javascript" src="./js/jquery-1.9.1.min.js"></script>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="extjs/ext-all.js"></script>

<script type="text/javascript">

   Ext.ns('QRM.global');
   Ext.ns('qoQRM'); //backwards compatibility with SC code

   QRM.global.projectID = -1;
<% out.println("QRM.global.userName = '" + request.getAttribute("userName") + "';");
   out.println("QRM.global.userID = " + request.getAttribute("userID") + ";");
   if (request.getAttribute("repMgr") != null) {
		out.println("QRM.global.userRepMgr = true;");
	} else {
		out.println("QRM.global.userRepMgr = false;");
	}%>
  
</script>

<script type="text/javascript" src="qrm-common.js"></script>
<script type="text/javascript" src="app.js"></script>

</head>
<body></body>
</html>