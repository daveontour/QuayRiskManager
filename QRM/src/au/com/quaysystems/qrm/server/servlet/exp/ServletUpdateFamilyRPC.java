package au.com.quaysystems.qrm.server.servlet.exp;

import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import au.com.quaysystems.qrm.server.RESTTransportContainer;

@SuppressWarnings("serial")
@WebServlet (value = "/updateFamilyRPC", asyncSupported = false)
public class ServletUpdateFamilyRPC extends QRMRPCServlet {

	@Override
	void execute(HttpServletRequest request, HttpServletResponse response,
			Session sess, Long userID, HashMap<String, String> stringMap,
			HashMap<Object, Object> objMap, Long projectID, Long riskID) {

		ArrayList<HashMap<String, Long >> list  = new ArrayList<HashMap<String, Long >>(); 

		try {
			for (Object obj:(JSONArray)parser.parse(stringMap.get("CHANGES"))){
				JSONObject objJS = (JSONObject)obj;

				HashMap<String, Long> item = new HashMap<String, Long>(); 
				item.put("riskID", getLongJS(objJS.get("riskID")));
				item.put("parentSummaryRisk", getLongJS(objJS.get("parentSummaryRisk")));
				item.put("relationshipID", getLongJS(objJS.get("relationshipID")));
				item.put("tempIndex", getLongJS(objJS.get("tempIndex")));
				item.put("removeChild", getLongJS(objJS.get("removeChild")));

				list.add(item);
			}
		} catch (ParseException e1) {
			e1.printStackTrace();
		}

		for (HashMap<String, Long> item : list){
			Long childID = item.get("riskID");
			Long parentSummaryRisk = item.get("parentSummaryRisk");
			Long relationshipID = item.get("relationshipID");
			Long tempIndex = item.get("tempIndex");
			Long removeChild = item.get("removeChild");

			//The client requires a unique ID for tree elements, so a fudge is used to create a uniques riskID which is recoverable
			// Risks whi
			if (tempIndex != 0){
				childID = childID-ServletGetRiskLiteRPC.uniqueOffset-tempIndex;
			}
			
			//Simple deletion of a relationship
			if (removeChild == 1){
				this.removeContributingRisk(relationshipID, request);
				continue;
			}

			// Delete the relationship if the it has been moved
			if (relationshipID != null ){
				this.removeContributingRisk(relationshipID, request);
			}
			
			// Create the relationship
			this.associateContributingRisk(parentSummaryRisk, childID, request);

		}



		outputJSON(new RESTTransportContainer(0),response);


	}
}
