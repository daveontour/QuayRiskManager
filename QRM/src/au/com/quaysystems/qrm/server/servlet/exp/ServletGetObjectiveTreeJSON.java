package au.com.quaysystems.qrm.server.servlet.exp;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;

import au.com.quaysystems.qrm.dto.DTOObjectiveTree;
import au.com.quaysystems.qrm.dto.ModelObjective;

@SuppressWarnings("serial")
@WebServlet (value = "/getObjectiveTreeJSON", asyncSupported = false)
public class ServletGetObjectiveTreeJSON extends QRMRPCServlet {

	@SuppressWarnings("unchecked")
	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {
		
		DTOObjectiveTree tree = new DTOObjectiveTree(); 
		List<ModelObjective> objectives = (List<ModelObjective>)sess.getNamedQuery("getAllObjectives").list();
		for (ModelObjective objective : objectives){
			if (objective.parentID == 1 && objective.objectiveID.longValue() != 1){
				DTOObjectiveTree item = tree.add(objective);
				addChildren(item, objectives);				
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
	
	private void addChildren(DTOObjectiveTree item, List<ModelObjective> objectives){
		for (ModelObjective objective : objectives){
			if (objective.parentID == item.objectiveID.longValue()){
				item.leaf = false;
				DTOObjectiveTree child = item.add(objective);
				addChildren(child, objectives);
			}
		}
	}

}
