package au.com.quaysystems.qrm.server.servlet.exp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import au.com.quaysystems.qrm.dto.DTORiskProjectTree;
import au.com.quaysystems.qrm.dto.ModelRiskProject;

@SuppressWarnings("serial")
@WebServlet (value = "/getUserProjectsJSON", asyncSupported = false)
public class ServletGetUserProjectsJSON extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {
		
		ArrayList<ModelRiskProject> projects = getAllRiskProjectsForUserLite(userID,sess);
		DTORiskProjectTree tree = new DTORiskProjectTree(); 
		
		for (ModelRiskProject project : projects){
			if (!findParent(project, projects)){
				DTORiskProjectTree item = tree.add(project);
				addChildren(item, projects);				
			}
		}
		try {
			xsJSON.toXML(tree, response.getOutputStream());
			return;
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	}
	
	private void addChildren(DTORiskProjectTree item, ArrayList<ModelRiskProject> projects){
		for (ModelRiskProject project : projects){
			if (project.parentID.longValue() == item.projectID.longValue()){
				item.leaf = false;
				DTORiskProjectTree child = item.add(project);
				addChildren(child, projects);
			}
		}
	}
	
	private boolean findParent(ModelRiskProject proj, ArrayList<ModelRiskProject> projects){
		for (ModelRiskProject project : projects){
			if (proj.parentID.longValue() == project.projectID.longValue()){
				return true;
			}
		} 
		return false;
	}
}
